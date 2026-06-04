/* =============================================================
   DISTOPIA 2 — script.js
   Arq: data.json (estático) + Google Apps Script (votos)
   Corrección CORS: se usa fetch con mode:'no-cors' para POST
   y se lee el estado de votos vía GET (que sí admite CORS).
   ============================================================= */

// ─── CONFIGURACIÓN ─────────────────────────────────────────────
// Pega aquí la URL de tu Web App de Google Apps Script
// (Desplegar > Implementar como aplicación web > URL)
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyTn0kvhWm6Jk-qQAHg__HSaZ8D5C5cb_EFEcUjWLXH3EafZGxz7ymrxgYCZBupkP_8/exec";

// corsproxy.io sólo se usa para el GET (leer votos).
// Para el POST usamos no-cors directamente (el Apps Script no bloquea POST).
const GET_URL = "https://corsproxy.io/?" + encodeURIComponent(APPS_SCRIPT_URL);

// ─── ESTADO LOCAL ──────────────────────────────────────────────
// Guardamos los votos en memoria para no recargar la página
let localVotes = {};   // { modId: number }
let modData    = null; // secciones + mods del data.json

// ─── INIT ───────────────────────────────────────────────────────
async function init() {
  try {
    // Cargar data.json y votos en paralelo
    const [dataRes, votesRes] = await Promise.all([
      fetch("data.json"),
      fetchVotesSafe()   // GET con manejo de error
    ]);

    modData    = await dataRes.json();
    localVotes = votesRes;                // objeto { id: count } o {}

    renderAll();
    updateStatsBar();
    hideLoading();

  } catch (err) {
    console.error("[Distopia2] Error de carga:", err);
    hideLoading();
    showErrorState(err);
  }
}

// ─── FETCH DE VOTOS (GET) ───────────────────────────────────────
// Primero intenta con proxy; si falla, intenta directo; si sigue
// fallando, arranca con votos en 0 para no bloquear el render.
async function fetchVotesSafe() {
  const urls = [
    GET_URL,                   // proxy
    APPS_SCRIPT_URL            // directo (puede funcionar en algunos entornos)
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" },
        signal: AbortSignal.timeout(7000)   // 7 s máximo
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log("[Distopia2] Votos cargados:", data);
      return data;                         // ✅ éxito
    } catch (e) {
      console.warn("[Distopia2] Fetch fallido en", url, "—", e.message);
    }
  }

  // Fallback: arrancamos con todo a 0 (la página renderiza igual)
  console.warn("[Distopia2] No se pudieron cargar los votos. Se usarán 0.");
  return {};
}

// ─── RENDER PRINCIPAL ───────────────────────────────────────────
function renderAll() {
  const app = document.getElementById("app");
  app.innerHTML = ""; // limpia loading

  modData.sections.forEach(section => {
    const block = createSectionBlock(section);
    app.appendChild(block);
  });
}

function createSectionBlock(section) {
  const block = document.createElement("div");
  block.className = "section-block";

  // Título de sección
  const title = document.createElement("h2");
  title.className = "section-title";
  title.innerHTML = `
    <span class="section-icon">📦</span>
    ${escapeHtml(section.name)}
    <span class="section-count">${section.mods.length} mod${section.mods.length !== 1 ? "s" : ""}</span>
  `;
  block.appendChild(title);

  // Grid de mods
  const grid = document.createElement("div");
  grid.className = "mod-grid";

  section.mods.forEach(mod => {
    const card = createModCard(mod);
    grid.appendChild(card);
  });

  block.appendChild(grid);
  return block;
}

// ─── TARJETA DE MOD ─────────────────────────────────────────────
function createModCard(mod) {
  const count = localVotes[mod.id] ?? 0;

  const card = document.createElement("article");
  card.className = "mod-card";
  card.id = `card-${mod.id}`;

  // ── Galería de imágenes ──
  if (mod.images && mod.images.length > 0) {
    const gallery = buildGallery(mod.images, mod.id);
    card.appendChild(gallery);
  }

  // ── Cuerpo de la tarjeta ──
  const body = document.createElement("div");
  body.className = "mod-body";

  // Header: nombre + badge
  const header = document.createElement("div");
  header.className = "mod-header";
  header.innerHTML = `
    <h3 class="mod-name">${escapeHtml(mod.name)}</h3>
    <span class="mod-badge">Mod</span>
  `;
  body.appendChild(header);

  // Descripción (párrafos del data.json)
  if (mod.paragraphs && mod.paragraphs.length > 0) {
    const desc = document.createElement("p");
    desc.className = "mod-description";
    desc.id = `desc-${mod.id}`;
    // Juntamos párrafos con separador ·
    desc.textContent = mod.paragraphs.join("  ·  ");
    body.appendChild(desc);

    // Botón "ver más" si hay texto largo
    if (mod.paragraphs.join("").length > 120) {
      const expandBtn = document.createElement("button");
      expandBtn.className = "expand-btn";
      expandBtn.textContent = "Leer más";
      expandBtn.setAttribute("aria-expanded", "false");
      expandBtn.addEventListener("click", () => toggleExpand(desc, expandBtn));
      body.appendChild(expandBtn);
    }
  }

  // ── Votación ──
  const voting = document.createElement("div");
  voting.className = "voting";
  voting.innerHTML = `
    <div class="vote-count">
      <span class="vote-number" id="votes-${mod.id}">${count}</span>
      <span class="vote-label">votos</span>
    </div>
    <button
      class="vote-btn"
      id="btn-${mod.id}"
      onclick="vote('${mod.id}')"
      aria-label="Votar por ${escapeHtml(mod.name)}"
    >
      <span class="btn-icon">▲</span>
      Votar
    </button>
  `;
  body.appendChild(voting);
  card.appendChild(body);

  return card;
}

// ─── GALERÍA CON NAVEGACIÓN ─────────────────────────────────────
function buildGallery(images, modId) {
  const wrapper = document.createElement("div");
  wrapper.className = "mod-gallery";

  const inner = document.createElement("div");
  inner.className = "mod-gallery-inner";
  inner.id = `gallery-${modId}`;

  images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Imagen ${i + 1}`;
    img.className = "mod-img";
    img.loading = "lazy";
    img.decoding = "async";
    inner.appendChild(img);
  });

  wrapper.appendChild(inner);

  // Solo añadir controles si hay más de 1 imagen
  if (images.length > 1) {
    let currentIndex = 0;

    // Flechas
    const prevBtn = document.createElement("button");
    prevBtn.className = "gallery-nav prev";
    prevBtn.innerHTML = "‹";
    prevBtn.setAttribute("aria-label", "Imagen anterior");

    const nextBtn = document.createElement("button");
    nextBtn.className = "gallery-nav next";
    nextBtn.innerHTML = "›";
    nextBtn.setAttribute("aria-label", "Imagen siguiente");

    // Dots
    const dots = document.createElement("div");
    dots.className = "gallery-dots";

    const dotEls = images.map((_, i) => {
      const dot = document.createElement("button");
      dot.className = "gallery-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Ir a imagen ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dots.appendChild(dot);
      return dot;
    });

    function goTo(idx) {
      currentIndex = (idx + images.length) % images.length;
      inner.style.transform = `translateX(-${currentIndex * 100}%)`;
      dotEls.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
    }

    prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
    nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

    wrapper.appendChild(prevBtn);
    wrapper.appendChild(nextBtn);
    wrapper.appendChild(dots);
  }

  return wrapper;
}

// ─── VOTACIÓN ───────────────────────────────────────────────────
async function vote(modId) {
  const btn     = document.getElementById(`btn-${modId}`);
  const counter = document.getElementById(`votes-${modId}`);

  if (!btn || btn.disabled) return;

  // Optimistic UI: actualizar inmediatamente
  btn.disabled = true;
  btn.classList.add("voted");
  localVotes[modId] = (localVotes[modId] ?? 0) + 1;
  const newCount = localVotes[modId];

  counter.textContent = newCount;
  counter.classList.add("bump");
  setTimeout(() => counter.classList.remove("bump"), 350);

  showToast("✅ ¡Voto registrado para " + modId + "!");

  // Enviar al servidor de fondo (fire-and-forget)
  // Usamos no-cors para el POST: el navegador acepta la petición
  // aunque no podamos leer la respuesta. El Apps Script la procesa.
  try {
    await fetch(APPS_SCRIPT_URL, {
      method:  "POST",
      mode:    "no-cors",          // ← clave para evitar el error CORS en POST
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: modId, change: 1 })
    });
  } catch (e) {
    // Con no-cors los errores de red sí se capturan
    console.warn("[Distopia2] Error al enviar voto:", e.message);
    showToast("⚠️ Voto local guardado, pero sin conexión al servidor.");
  }

  // Rehabilitar botón tras 3 s (anti-spam)
  setTimeout(() => {
    btn.disabled = false;
    btn.classList.remove("voted");
  }, 3000);
}

// ─── HELPERS ────────────────────────────────────────────────────
function toggleExpand(el, btn) {
  const expanded = el.classList.toggle("expanded");
  btn.textContent = expanded ? "Ver menos" : "Leer más";
  btn.setAttribute("aria-expanded", String(expanded));
}

function updateStatsBar() {
  if (!modData) return;
  const totalMods = modData.sections.reduce((acc, s) => acc + s.mods.length, 0);
  const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0);
  const el = document.getElementById("stats-mods");
  if (el) {
    el.textContent = `${totalMods} mods · ${totalVotes} votos totales · ${modData.sections.length} secciones`;
  }
}

function hideLoading() {
  const screen = document.getElementById("loading-screen");
  if (screen) screen.remove();
}

function showErrorState(err) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="error-state">
      <h2>⚠️ Error al cargar los mods</h2>
      <p>Revisa la consola (F12) para más detalles.</p>
      <pre>${escapeHtml(String(err))}</pre>
      <p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)">
        Si el error es de CORS, verifica que tu Google Apps Script esté
        desplegado como <strong>aplicación web pública</strong> y que el
        Apps Script devuelva los headers correctos.
      </p>
    </div>
  `;
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── ARRANQUE ───────────────────────────────────────────────────
init();
