/* =============================================================
   DISTOPIA 2 — script.js v2
   Nuevas funciones:
     · Partículas animadas en canvas
     · Upvote / Downvote / Quitar voto (máx 1 por mod en localStorage)
     · Modal de detalle con carrusel táctil (1..N imágenes)
   ============================================================= */

// ─── CONFIG ─────────────────────────────────────────────────────
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzvKM00NP_Ise1FRdubQY6TY6EhFIAeNLV3-Z3Omas4PcY6WZRLS3Bt9MJzMb8n3zU/exec";

const GET_URL = "https://corsproxy.io/?" + encodeURIComponent(APPS_SCRIPT_URL);

// ─── ESTADO ─────────────────────────────────────────────────────
let localVotes  = {};  // { modId: number }  — del servidor
let modData     = null;
let userVotes   = {};  // { modId: 1 | -1 }  — localStorage

// Clave en localStorage
const LS_KEY = "distopia2_votes_v2";

function loadUserVotes()  { try { userVotes = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { userVotes = {}; } }
function saveUserVotes()  { localStorage.setItem(LS_KEY, JSON.stringify(userVotes)); }

// ─── PARTÍCULAS (canvas) ─────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Colores del tema Distopia
  const COLORS = [
    "rgba(217,70,239,ALPHA)",   // magenta
    "rgba(124,58,237,ALPHA)",   // purple
    "rgba(249,115,22,ALPHA)",   // orange
    "rgba(168,85,247,ALPHA)",   // purple-light
  ];

  let particles = [];
  const COUNT = 70;
  const MAX_DIST = 130;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function randomColor(alpha) {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return c.replace("ALPHA", alpha.toFixed(2));
  }

  function createParticle() {
    return {
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      vx:   (Math.random() - 0.5) * 0.45,
      vy:   (Math.random() - 0.5) * 0.45,
      r:    Math.random() * 2 + 0.8,
      color: randomColor(0.7),
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Líneas de conexión
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(217,70,239,${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Puntos
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Mover
      p.x += p.vx;
      p.y += p.vy;

      // Rebote en bordes
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => { resize(); init(); });
  resize();
  init();
  draw();
}

// ─── INIT PRINCIPAL ─────────────────────────────────────────────
async function init() {
  initParticles();
  loadUserVotes();

  try {
    const [dataRes, votesRes] = await Promise.all([
      fetch("data.json"),
      fetchVotesSafe()
    ]);

    modData    = await dataRes.json();
    localVotes = votesRes;

    renderAll();
    updateStatsBar();
    hideLoading();
    initModal();

  } catch (err) {
    console.error("[Distopia2]", err);
    hideLoading();
    showErrorState(err);
  }
}

// ─── FETCH VOTOS (GET) ───────────────────────────────────────────
async function fetchVotesSafe() {
  const urls = [GET_URL, APPS_SCRIPT_URL];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" },
        signal: AbortSignal.timeout(7000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn("[Distopia2] GET fallido:", url, e.message);
    }
  }
  return {};
}

// ─── RENDER PRINCIPAL ────────────────────────────────────────────
function renderAll() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  modData.sections.forEach(section => {
    app.appendChild(createSectionBlock(section));
  });
}

function createSectionBlock(section) {
  const block = document.createElement("div");
  block.className = "section-block";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.innerHTML = `
    <span class="section-icon">📦</span>
    ${escapeHtml(section.name)}
    <span class="section-count">${section.mods.length} mod${section.mods.length !== 1 ? "s" : ""}</span>
  `;
  block.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "mod-grid";
  section.mods.forEach(mod => grid.appendChild(createModCard(mod)));
  block.appendChild(grid);

  return block;
}

// ─── TARJETA DE MOD ─────────────────────────────────────────────
function createModCard(mod) {
  const score   = localVotes[mod.id] ?? 0;
  const myVote  = userVotes[mod.id]  ?? 0;

  const card = document.createElement("article");
  card.className = "mod-card";
  card.id = `card-${mod.id}`;

  // ── Thumbnail clickable ──
  if (mod.images && mod.images.length > 0) {
    const thumb = document.createElement("div");
    thumb.className = "mod-thumb";
    thumb.setAttribute("role", "button");
    thumb.setAttribute("tabindex", "0");
    thumb.setAttribute("aria-label", `Ver detalles de ${mod.name}`);

    const img = document.createElement("img");
    img.src = mod.images[0];
    img.alt = mod.name;
    img.className = "mod-thumb-img";
    img.loading = "lazy";
    img.decoding = "async";
    thumb.appendChild(img);

    // Overlay hover
    const overlay = document.createElement("div");
    overlay.className = "thumb-overlay";
    overlay.innerHTML = `<span class="thumb-overlay-text">🔍 Ver detalle</span>`;
    thumb.appendChild(overlay);

    // Badge nº imágenes
    if (mod.images.length > 1) {
      const badge = document.createElement("span");
      badge.className = "thumb-count-badge";
      badge.textContent = `🖼 ${mod.images.length}`;
      thumb.appendChild(badge);
    }

    thumb.addEventListener("click",  () => openModal(mod));
    thumb.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openModal(mod); });
    card.appendChild(thumb);
  }

  // ── Body ──
  const body = document.createElement("div");
  body.className = "mod-body";

  const headerRow = document.createElement("div");
  headerRow.className = "mod-header-row";

  const nameEl = document.createElement("h3");
  nameEl.className = "mod-name";
  nameEl.textContent = mod.name;
  nameEl.addEventListener("click", () => openModal(mod));

  const badge = document.createElement("span");
  badge.className = "mod-badge";
  badge.textContent = "MOD";

  headerRow.appendChild(nameEl);
  headerRow.appendChild(badge);
  body.appendChild(headerRow);

  // Snippet de descripción
  if (mod.paragraphs && mod.paragraphs.length > 0) {
    const snip = document.createElement("p");
    snip.className = "mod-snippet";
    snip.textContent = mod.paragraphs[0];
    body.appendChild(snip);
  }

  // ── Votación compacta ──
  const voting = document.createElement("div");
  voting.className = "voting";

  const scoreWrap = document.createElement("div");
  scoreWrap.className = "vote-score-wrap";
  scoreWrap.innerHTML = `
    <span class="vote-score-label">Puntos</span>
    <span class="vote-score ${score > 0 ? "positive" : score < 0 ? "negative" : ""}" id="score-${mod.id}">${score}</span>
  `;

  const btnGroup = document.createElement("div");
  btnGroup.className = "vote-btn-group";

  const upBtn = document.createElement("button");
  upBtn.className = `vote-btn upvote${myVote === 1 ? " active" : ""}`;
  upBtn.id = `up-${mod.id}`;
  upBtn.innerHTML = `▲`;
  upBtn.setAttribute("aria-label", "Votar positivo");
  upBtn.addEventListener("click", e => { e.stopPropagation(); handleVote(mod.id, 1); });

  const downBtn = document.createElement("button");
  downBtn.className = `vote-btn downvote${myVote === -1 ? " active" : ""}`;
  downBtn.id = `dn-${mod.id}`;
  downBtn.innerHTML = `▼`;
  downBtn.setAttribute("aria-label", "Votar negativo");
  downBtn.addEventListener("click", e => { e.stopPropagation(); handleVote(mod.id, -1); });

  btnGroup.appendChild(upBtn);
  btnGroup.appendChild(downBtn);

  voting.appendChild(scoreWrap);
  voting.appendChild(btnGroup);
  body.appendChild(voting);

  card.appendChild(body);
  return card;
}

// ─── LÓGICA DE VOTO (±1 / quitar) ───────────────────────────────
async function handleVote(modId, direction) {
  const upBtn  = document.getElementById(`up-${modId}`);
  const dnBtn  = document.getElementById(`dn-${modId}`);
  const scoreEl = document.getElementById(`score-${modId}`);

  if (!upBtn || upBtn.disabled) return;

  const current = userVotes[modId] ?? 0;
  let delta = 0;

  if (current === direction) {
    // Ya votó en esta dirección → quitar voto
    delta = -direction;
    delete userVotes[modId];
    upBtn.classList.remove("active");
    dnBtn.classList.remove("active");
    showToast("↩️ Voto retirado");
  } else if (current === 0) {
    // No había votado → nuevo voto
    delta = direction;
    userVotes[modId] = direction;
    if (direction === 1) { upBtn.classList.add("active");   dnBtn.classList.remove("active"); showToast("✅ ¡Voto positivo!"); }
    else                  { dnBtn.classList.add("active");   upBtn.classList.remove("active"); showToast("👎 Voto negativo registrado"); }
  } else {
    // Ya votó en dirección contraria → primero quitar, luego poner
    // (en un solo request: compensar + nuevo)
    delta = direction - current; // ej: pasas de -1 a +1 → delta = 2
    userVotes[modId] = direction;
    if (direction === 1) { upBtn.classList.add("active");   dnBtn.classList.remove("active"); showToast("✅ Voto cambiado a positivo"); }
    else                  { dnBtn.classList.add("active");   upBtn.classList.remove("active"); showToast("👎 Voto cambiado a negativo"); }
  }

  saveUserVotes();

  // Actualizar UI
  localVotes[modId] = (localVotes[modId] ?? 0) + delta;
  const newScore = localVotes[modId];
  if (scoreEl) {
    scoreEl.textContent = newScore;
    scoreEl.className = `vote-score${newScore > 0 ? " positive" : newScore < 0 ? " negative" : ""} bump`;
    setTimeout(() => scoreEl.classList.remove("bump"), 320);
  }

  // Sincronizar también en el modal si está abierto para este mod
  syncModalScore(modId);
  updateStatsBar();

  // Deshabilitar temporalmente para evitar spam
  upBtn.disabled = true;
  dnBtn.disabled = true;

  try {
    await fetch(APPS_SCRIPT_URL, {
      method:  "POST",
      mode:    "no-cors",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: modId, change: delta })
    });
  } catch (e) {
    console.warn("[Distopia2] Error enviando voto:", e.message);
  }

  setTimeout(() => {
    upBtn.disabled = false;
    dnBtn.disabled = false;
  }, 2500);
}

// ─── MODAL DE DETALLE ────────────────────────────────────────────
let currentModalMod = null;
let carouselIdx = 0;
let touchStartX = 0;

function initModal() {
  const overlay   = document.getElementById("modal-overlay");
  const closeBtn  = document.getElementById("modal-close");
  const prevBtn   = document.getElementById("carousel-prev");
  const nextBtn   = document.getElementById("carousel-next");
  const upBtn     = document.getElementById("modal-upvote-btn");
  const dnBtn     = document.getElementById("modal-downvote-btn");
  const track     = document.getElementById("modal-carousel-track");

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  prevBtn.addEventListener("click", () => carouselGo(carouselIdx - 1));
  nextBtn.addEventListener("click", () => carouselGo(carouselIdx + 1));

  // Swipe táctil
  track.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend",   e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) carouselGo(carouselIdx + (dx > 0 ? 1 : -1));
  });

  // Flechas teclado cuando el modal está abierto
  document.addEventListener("keydown", e => {
    if (overlay.hidden) return;
    if (e.key === "ArrowLeft")  carouselGo(carouselIdx - 1);
    if (e.key === "ArrowRight") carouselGo(carouselIdx + 1);
  });

  upBtn.addEventListener("click", () => { if (currentModalMod) handleVote(currentModalMod.id, 1); });
  dnBtn.addEventListener("click", () => { if (currentModalMod) handleVote(currentModalMod.id, -1); });
}

function openModal(mod) {
  currentModalMod = mod;
  carouselIdx = 0;

  const overlay = document.getElementById("modal-overlay");
  const track   = document.getElementById("modal-carousel-track");
  const dots    = document.getElementById("carousel-dots");
  const counter = document.getElementById("carousel-counter");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  // Nombre y descripción
  document.getElementById("modal-mod-name").textContent = mod.name;
  const descEl = document.getElementById("modal-description");
  descEl.innerHTML = (mod.paragraphs || []).map(p => `<p>${escapeHtml(p)}</p>`).join("");

  // Carrusel de imágenes
  track.innerHTML = "";
  dots.innerHTML  = "";

  const images = mod.images || [];
  images.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${mod.name} — imagen ${i + 1}`;
    img.loading = "lazy";
    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Imagen ${i + 1}`);
    dot.addEventListener("click", () => carouselGo(i));
    dots.appendChild(dot);
  });

  // Mostrar/ocultar controles
  const multi = images.length > 1;
  prevBtn.hidden = !multi;
  nextBtn.hidden = !multi;
  if (!multi) dots.innerHTML = "";
  counter.textContent = multi ? `1 / ${images.length}` : "";

  // Votos en modal
  syncModalScore(mod.id);

  // Abrir
  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";

  // Focus en el panel
  document.getElementById("modal-panel").focus?.();
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.setAttribute("hidden", "");
  document.body.style.overflow = "";
  currentModalMod = null;
}

function carouselGo(idx) {
  const images  = currentModalMod?.images || [];
  if (images.length <= 1) return;

  carouselIdx = ((idx % images.length) + images.length) % images.length;

  const track   = document.getElementById("modal-carousel-track");
  const dots    = document.getElementById("carousel-dots");
  const counter = document.getElementById("carousel-counter");

  track.style.transform = `translateX(-${carouselIdx * 100}%)`;
  counter.textContent   = `${carouselIdx + 1} / ${images.length}`;

  dots.querySelectorAll(".carousel-dot").forEach((d, i) =>
    d.classList.toggle("active", i === carouselIdx)
  );
}

function syncModalScore(modId) {
  if (!currentModalMod || currentModalMod.id !== modId) return;

  const score   = localVotes[modId] ?? 0;
  const myVote  = userVotes[modId]  ?? 0;
  const scoreEl = document.getElementById("modal-vote-score");
  const upBtn   = document.getElementById("modal-upvote-btn");
  const dnBtn   = document.getElementById("modal-downvote-btn");

  if (scoreEl) {
    scoreEl.textContent = score;
    scoreEl.className = `vote-score${score > 0 ? " positive" : score < 0 ? " negative" : ""}`;
  }
  if (upBtn) upBtn.classList.toggle("active", myVote === 1);
  if (dnBtn) dnBtn.classList.toggle("active", myVote === -1);
}

// ─── HELPERS ─────────────────────────────────────────────────────
function updateStatsBar() {
  if (!modData) return;
  const totalMods  = modData.sections.reduce((a, s) => a + s.mods.length, 0);
  const totalVotes = Object.values(localVotes).reduce((a, b) => a + Math.abs(b), 0);
  const sm = document.getElementById("stat-mods");
  const sv = document.getElementById("stat-votes");
  const ss = document.getElementById("stat-sections");
  if (sm) sm.textContent = `⬛ ${totalMods} mods`;
  if (sv) sv.textContent = `🗳️ ${totalVotes} votos`;
  if (ss) ss.textContent = `📂 ${modData.sections.length} secciones`;
}

function hideLoading() {
  document.getElementById("loading-screen")?.remove();
}

function showErrorState(err) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="error-state">
      <h2>⚠️ Error al cargar</h2>
      <p>Revisa la consola (F12) para más detalles.</p>
      <pre>${escapeHtml(String(err))}</pre>
    </div>`;
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

// ─── ARRANQUE ─────────────────────────────────────────────────────
init();
