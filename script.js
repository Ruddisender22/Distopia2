/* =============================================================
   DISTOPIA 2 — script.js v3
   · Ondas de arena (canvas)
   · Google Sign-In (GIS) — autenticación real
   · Upvote / Downvote / Retirar voto — 1 por mod por usuario
   · Modal + carrusel táctil
   ============================================================= */

// ─── ⚙️  CONFIGURACIÓN ─────────────────────────────────────────
// 1. Pega aquí tu Client ID de Google Cloud Console:
//    console.cloud.google.com → APIs y servicios → Credenciales → OAuth 2.0
const GOOGLE_CLIENT_ID = "TU_CLIENT_ID.apps.googleusercontent.com";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxrSAX-G-RsOJrvjyStydqKd36SEiSg_NEKoSmx4lt9B7Tv-QnNOc4ClvberNYj0GsI/exec";

// Proxy para peticiones GET (evita CORS en el navegador)
const PROXY = "https://corsproxy.io/?";
const GET_URL = PROXY + encodeURIComponent(APPS_SCRIPT_URL);

// ─── ESTADO ──────────────────────────────────────────────────────
let localVotes    = {};   // { modId: number }  — totales del servidor
let userVotes     = {};   // { modId: 1 | -1 }  — votos del usuario actual
let modData       = null;
let currentUser   = null; // { token, sub, email, name, picture, exp }
let gisReady      = false;// true cuando la librería GIS está cargada

// ─── ONDAS DE ARENA (canvas) ─────────────────────────────────────
function initSandWaves() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Capas de onda: posición Y relativa, amplitud, frecuencia espacial,
  // velocidad temporal, fase inicial, color RGBA
  const WAVES = [
    { yRel:0.08, amp:20, freq:0.0030, spd:0.00032, ph:0.0, col:"rgba(139,92,246,0.07)"  },
    { yRel:0.18, amp:16, freq:0.0038, spd:0.00048, ph:1.2, col:"rgba(224,89,245,0.065)" },
    { yRel:0.30, amp:24, freq:0.0024, spd:0.00027, ph:2.5, col:"rgba(251,146,60,0.05)"  },
    { yRel:0.42, amp:18, freq:0.0042, spd:0.00044, ph:0.8, col:"rgba(192,132,252,0.06)" },
    { yRel:0.55, amp:22, freq:0.0028, spd:0.00036, ph:3.1, col:"rgba(224,89,245,0.06)"  },
    { yRel:0.67, amp:15, freq:0.0046, spd:0.00052, ph:1.7, col:"rgba(139,92,246,0.055)" },
    { yRel:0.79, amp:26, freq:0.0022, spd:0.00028, ph:4.2, col:"rgba(251,146,60,0.045)" },
    { yRel:0.91, amp:13, freq:0.0052, spd:0.00058, ph:2.0, col:"rgba(224,89,245,0.05)"  },
  ];

  let t = 0;
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener("resize", resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;

    WAVES.forEach(w => {
      const yBase = H * w.yRel;
      ctx.beginPath();
      ctx.moveTo(0, yBase);
      for (let x = 0; x <= W + 3; x += 3) {
        const y = yBase
          + Math.sin(x * w.freq + t * w.spd * 6000 + w.ph) * w.amp
          + Math.sin(x * w.freq * 2.1 + t * w.spd * 4000 + w.ph + 1) * (w.amp * 0.3);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = w.col;
      ctx.fill();
    });

    t++;
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── GOOGLE SIGN-IN ───────────────────────────────────────────────

// Esta función es llamada por la librería GIS cuando está lista
window.onGisReady = function () {
  gisReady = true;
  if (typeof google === "undefined") return;

  google.accounts.id.initialize({
    client_id:         GOOGLE_CLIENT_ID,
    callback:          handleCredentialResponse,
    auto_select:       true,       // intento de login automático si ya autorizó antes
    cancel_on_tap_outside: false,
    itp_support:       true        // soporte ITP de Safari
  });

  // Renderizar el botón oficial de Google
  const btnContainer = document.getElementById("google-login-btn");
  if (btnContainer) {
    google.accounts.id.renderButton(btnContainer, {
      theme:  "filled_black",
      size:   "large",
      shape:  "pill",
      text:   "signin_with",
      locale: "es"
    });
  }

  // One Tap (popup automático si no está logueado)
  google.accounts.id.prompt(notification => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      console.log("[Distopia2] One Tap no mostrado:", notification.getNotDisplayedReason?.());
    }
  });
};

// Comprueba periódicamente si GIS está cargado
function waitForGis() {
  if (typeof google !== "undefined" && google.accounts) {
    window.onGisReady();
  } else {
    setTimeout(waitForGis, 200);
  }
}

// Callback cuando el usuario completa el sign-in
function handleCredentialResponse(response) {
  const token = response.credential;
  const payload = parseJWT(token);

  if (!payload) { showToast("⚠️ Error al procesar el token de Google"); return; }

  currentUser = {
    token,
    sub:     payload.sub,
    email:   payload.email,
    name:    payload.given_name || payload.name || "Usuario",
    picture: payload.picture || "",
    exp:     payload.exp
  };

  updateAuthUI(true);
  showToast(`👋 ¡Bienvenido, ${currentUser.name}!`);

  // Cargar votos previos del usuario desde el servidor
  loadUserVotesFromServer();
}

function logout() {
  if (typeof google !== "undefined") {
    google.accounts.id.disableAutoSelect();
  }
  currentUser = null;
  userVotes   = {};
  updateAuthUI(false);
  refreshCardStates();
  showToast("👋 Sesión cerrada");
}

// ── UI de autenticación ───────────────────────────────────────────
function updateAuthUI(loggedIn) {
  const loginPrompt = document.getElementById("login-prompt");
  const userChip    = document.getElementById("user-chip");
  const nameEl      = document.getElementById("user-name");
  const emailEl     = document.getElementById("user-email");
  const avatarEl    = document.getElementById("user-avatar");

  if (loggedIn && currentUser) {
    loginPrompt?.setAttribute("hidden", "");
    userChip?.removeAttribute("hidden");
    if (nameEl)   nameEl.textContent  = currentUser.name;
    if (emailEl)  emailEl.textContent = currentUser.email;
    if (avatarEl && currentUser.picture) { avatarEl.src = currentUser.picture; avatarEl.alt = currentUser.name; }
  } else {
    loginPrompt?.removeAttribute("hidden");
    userChip?.setAttribute("hidden", "");
  }
}

// Decodifica el payload de un JWT (no verifica firma — la verificación
// real se hace en el servidor, aquí solo leemos el contenido)
function parseJWT(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  } catch { return null; }
}

// ─── INIT PRINCIPAL ──────────────────────────────────────────────
async function init() {
  initSandWaves();
  waitForGis();

  try {
    const [dataRes, votesData] = await Promise.all([
      fetch("data.json"),
      fetchAggregateVotes()
    ]);

    modData    = await dataRes.json();
    localVotes = votesData;

    renderAll();
    updateStatsBar();
    hideLoading();
    initModal();

    // Conectar botón de logout
    document.getElementById("logout-btn")?.addEventListener("click", logout);

  } catch (err) {
    console.error("[Distopia2]", err);
    hideLoading();
    showErrorState(err);
  }
}

// ─── FETCH VOTOS AGREGADOS (público, sin auth) ────────────────────
async function fetchAggregateVotes() {
  const urls = [
    `${GET_URL}&${new URLSearchParams({ action: "getVotes" })}`,
    `${APPS_SCRIPT_URL}?action=getVotes`
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { "Accept": "application/json" },
        signal:  AbortSignal.timeout(7000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (e) {
      console.warn("[Distopia2] Votos GET fallido:", e.message);
    }
  }
  return {};
}

// ─── FETCH VOTOS DEL USUARIO (requiere token) ────────────────────
async function loadUserVotesFromServer() {
  if (!currentUser) return;
  if (isTokenExpired()) return;

  try {
    const params = new URLSearchParams({ action: "getUserVotes", token: currentUser.token });
    const url = `${GET_URL}&${params}`;
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      signal:  AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    userVotes = data;  // { modId: 1 | -1 }
    refreshCardStates();
    syncModalScore(currentModalMod?.id);
    console.log("[Distopia2] Votos del usuario cargados:", userVotes);
  } catch (e) {
    console.warn("[Distopia2] getUserVotes fallido:", e.message);
  }
}

function isTokenExpired() {
  return !currentUser || (Date.now() / 1000) > currentUser.exp - 30;
}

// ─── RENDER PRINCIPAL ────────────────────────────────────────────
function renderAll() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  modData.sections.forEach(s => app.appendChild(createSectionBlock(s)));
}

function createSectionBlock(section) {
  const block = document.createElement("div");
  block.className = "section-block";

  const title = document.createElement("h2");
  title.className = "section-title";

  const pill = document.createElement("span");
  pill.className = "section-pill";
  pill.innerHTML = `<span class="section-pill-icon">⚙️</span>${escapeHtml(section.name)}`;

  const count = document.createElement("span");
  count.className = "section-count-pill";
  count.textContent = `${section.mods.length} mod${section.mods.length !== 1 ? "s" : ""}`;

  title.appendChild(pill);
  title.appendChild(count);
  block.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "mod-grid";
  section.mods.forEach(mod => grid.appendChild(createModCard(mod)));
  block.appendChild(grid);
  return block;
}

// ─── TARJETA ─────────────────────────────────────────────────────
function createModCard(mod) {
  const score  = localVotes[mod.id] ?? 0;
  const myVote = userVotes[mod.id]  ?? 0;

  const card = document.createElement("article");
  card.className = "mod-card";
  card.id = `card-${mod.id}`;

  // Thumbnail
  if (mod.images?.length > 0) {
    const thumb = document.createElement("div");
    thumb.className = "mod-thumb";
    thumb.setAttribute("role", "button"); thumb.setAttribute("tabindex", "0");
    thumb.setAttribute("aria-label", `Ver detalle de ${mod.name}`);

    const img = document.createElement("img");
    img.src = mod.images[0]; img.alt = mod.name;
    img.className = "mod-thumb-img"; img.loading = "lazy"; img.decoding = "async";
    thumb.appendChild(img);

    const ov = document.createElement("div");
    ov.className = "thumb-overlay";
    ov.innerHTML = `<span class="thumb-overlay-text">🔍 Ver detalle</span>`;
    thumb.appendChild(ov);

    if (mod.images.length > 1) {
      const badge = document.createElement("span");
      badge.className = "thumb-count-badge";
      badge.textContent = `🖼 ${mod.images.length}`;
      thumb.appendChild(badge);
    }

    thumb.addEventListener("click",   () => openModal(mod));
    thumb.addEventListener("keydown", e  => { if (e.key === "Enter" || e.key === " ") openModal(mod); });
    card.appendChild(thumb);
  }

  // Body
  const body = document.createElement("div");
  body.className = "mod-body";

  const hRow = document.createElement("div");
  hRow.className = "mod-header-row";
  const nameEl = document.createElement("h3");
  nameEl.className = "mod-name";
  nameEl.textContent = mod.name;
  nameEl.addEventListener("click", () => openModal(mod));
  const badge = document.createElement("span");
  badge.className = "mod-badge"; badge.textContent = "MOD";
  hRow.appendChild(nameEl); hRow.appendChild(badge);
  body.appendChild(hRow);

  if (mod.paragraphs?.length > 0) {
    const snip = document.createElement("p");
    snip.className = "mod-snippet";
    snip.textContent = mod.paragraphs[0];
    body.appendChild(snip);
  }

  // Voting
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
  btnGroup.appendChild(buildVoteBtn(mod.id, 1,  myVote));
  btnGroup.appendChild(buildVoteBtn(mod.id, -1, myVote));

  voting.appendChild(scoreWrap);
  voting.appendChild(btnGroup);
  body.appendChild(voting);
  card.appendChild(body);
  return card;
}

function buildVoteBtn(modId, direction, myVote) {
  const isUp  = direction === 1;
  const btn   = document.createElement("button");
  const loggedIn = !!currentUser;

  btn.id = isUp ? `up-${modId}` : `dn-${modId}`;
  btn.setAttribute("aria-label", isUp ? "Votar positivo" : "Votar negativo");

  if (!loggedIn) {
    btn.className = "vote-btn locked";
    btn.innerHTML = isUp ? `🔐` : `🔒`;
    btn.title = "Inicia sesión para votar";
    btn.addEventListener("click", e => {
      e.stopPropagation();
      showToast("🔐 Inicia sesión con Google para votar");
      // Activar One Tap si disponible
      if (typeof google !== "undefined") google.accounts.id.prompt();
    });
  } else {
    btn.className = `vote-btn ${isUp ? "upvote" : "downvote"}${myVote === direction ? " active" : ""}`;
    btn.innerHTML = isUp ? `▲` : `▼`;
    btn.addEventListener("click", e => { e.stopPropagation(); handleVote(modId, direction); });
  }
  return btn;
}

// Reconstruye el estado de los botones sin re-renderizar todo
function refreshCardStates() {
  if (!modData) return;
  modData.sections.forEach(s => {
    s.mods.forEach(mod => {
      const myVote = userVotes[mod.id] ?? 0;
      const upBtn  = document.getElementById(`up-${mod.id}`);
      const dnBtn  = document.getElementById(`dn-${mod.id}`);
      if (!upBtn || !dnBtn) return;

      if (currentUser) {
        // Activar botones
        upBtn.className = `vote-btn upvote${myVote === 1  ? " active" : ""}`;
        upBtn.innerHTML = "▲";
        upBtn.title = "";
        upBtn.onclick = e => { e.stopPropagation(); handleVote(mod.id, 1); };
        dnBtn.className = `vote-btn downvote${myVote === -1 ? " active" : ""}`;
        dnBtn.innerHTML = "▼";
        dnBtn.title = "";
        dnBtn.onclick = e => { e.stopPropagation(); handleVote(mod.id, -1); };
      } else {
        // Bloquear botones
        upBtn.className = "vote-btn locked"; upBtn.innerHTML = "🔐"; upBtn.title = "Inicia sesión para votar";
        dnBtn.className = "vote-btn locked"; dnBtn.innerHTML = "🔒"; dnBtn.title = "Inicia sesión para votar";
      }
    });
  });
}

// ─── LÓGICA DE VOTO ──────────────────────────────────────────────
async function handleVote(modId, direction) {
  if (!currentUser) {
    showToast("🔐 Inicia sesión con Google para votar");
    return;
  }
  if (isTokenExpired()) {
    showToast("⏰ Sesión expirada, por favor vuelve a iniciar sesión");
    logout();
    return;
  }

  const upBtn   = document.getElementById(`up-${modId}`);
  const dnBtn   = document.getElementById(`dn-${modId}`);
  const scoreEl = document.getElementById(`score-${modId}`);

  if (!upBtn || upBtn.disabled) return;

  const current = userVotes[modId] ?? 0;
  let delta = 0;

  if (current === direction) {
    delta = -direction;
    delete userVotes[modId];
    upBtn.classList.remove("active"); dnBtn.classList.remove("active");
    showToast("↩️ Voto retirado");
  } else if (current === 0) {
    delta = direction;
    userVotes[modId] = direction;
    if (direction === 1) { upBtn.classList.add("active");  dnBtn.classList.remove("active"); showToast("✅ ¡Voto positivo!"); }
    else                  { dnBtn.classList.add("active");  upBtn.classList.remove("active"); showToast("👎 Voto negativo registrado"); }
  } else {
    delta = direction - current;
    userVotes[modId] = direction;
    if (direction === 1) { upBtn.classList.add("active");  dnBtn.classList.remove("active"); showToast("✅ Voto cambiado a positivo"); }
    else                  { dnBtn.classList.add("active");  upBtn.classList.remove("active"); showToast("👎 Voto cambiado a negativo"); }
  }

  // Actualizar UI inmediatamente (optimistic)
  localVotes[modId] = (localVotes[modId] ?? 0) + delta;
  const newScore = localVotes[modId];
  if (scoreEl) {
    scoreEl.textContent = newScore;
    scoreEl.className = `vote-score${newScore > 0 ? " positive" : newScore < 0 ? " negative" : ""} bump`;
    setTimeout(() => scoreEl.classList.remove("bump"), 320);
  }

  syncModalScore(modId);
  updateStatsBar();

  // Bloquear brevemente
  upBtn.disabled = dnBtn.disabled = true;

  // Enviar al servidor con el token JWT
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode:   "no-cors",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: modId, delta, token: currentUser.token })
    });
  } catch (e) {
    console.warn("[Distopia2] Error enviando voto:", e.message);
  }

  setTimeout(() => { if (upBtn) upBtn.disabled = false; if (dnBtn) dnBtn.disabled = false; }, 2500);
}

// ─── MODAL ───────────────────────────────────────────────────────
let currentModalMod = null;
let carouselIdx = 0;
let touchStartX = 0;

function initModal() {
  const overlay  = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  const prevBtn  = document.getElementById("carousel-prev");
  const nextBtn  = document.getElementById("carousel-next");
  const upBtn    = document.getElementById("modal-upvote-btn");
  const dnBtn    = document.getElementById("modal-downvote-btn");
  const track    = document.getElementById("modal-carousel-track");

  if (!overlay || !closeBtn || !track) {
    console.warn("[Distopia2] initModal: elementos del modal no encontrados"); return;
  }

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => {
    if (!overlay || overlay.hidden) return;
    if (e.key === "Escape")     closeModal();
    if (e.key === "ArrowLeft")  carouselGo(carouselIdx - 1);
    if (e.key === "ArrowRight") carouselGo(carouselIdx + 1);
  });
  prevBtn?.addEventListener("click", () => carouselGo(carouselIdx - 1));
  nextBtn?.addEventListener("click", () => carouselGo(carouselIdx + 1));

  track.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend",   e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) carouselGo(carouselIdx + (dx > 0 ? 1 : -1));
  });

  upBtn?.addEventListener("click", () => { if (currentModalMod) handleVote(currentModalMod.id, 1); });
  dnBtn?.addEventListener("click", () => { if (currentModalMod) handleVote(currentModalMod.id, -1); });
}

function openModal(mod) {
  currentModalMod = mod; carouselIdx = 0;
  const overlay = document.getElementById("modal-overlay");
  const track   = document.getElementById("modal-carousel-track");
  const dots    = document.getElementById("carousel-dots");
  const counter = document.getElementById("carousel-counter");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  if (!overlay || !track) return;

  document.getElementById("modal-mod-name").textContent = mod.name;
  document.getElementById("modal-description").innerHTML =
    (mod.paragraphs || []).map(p => `<p>${escapeHtml(p)}</p>`).join("");

  track.innerHTML = ""; if (dots) dots.innerHTML = "";
  const images = mod.images || [];
  images.forEach((src, i) => {
    const slide = document.createElement("div"); slide.className = "carousel-slide";
    const img = document.createElement("img"); img.src = src; img.alt = `${mod.name} ${i + 1}`; img.loading = "lazy";
    slide.appendChild(img); track.appendChild(slide);
    if (dots) {
      const dot = document.createElement("button");
      dot.className = `carousel-dot${i === 0 ? " active" : ""}`;
      dot.setAttribute("aria-label", `Imagen ${i + 1}`);
      dot.addEventListener("click", () => carouselGo(i));
      dots.appendChild(dot);
    }
  });

  const multi = images.length > 1;
  if (prevBtn) prevBtn.hidden = !multi;
  if (nextBtn) nextBtn.hidden = !multi;
  if (!multi && dots) dots.innerHTML = "";
  if (counter) counter.textContent = multi ? `1 / ${images.length}` : "";

  syncModalScore(mod.id);
  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("modal-panel")?.focus();
}

function closeModal() {
  document.getElementById("modal-overlay")?.setAttribute("hidden", "");
  document.body.style.overflow = "";
  currentModalMod = null;
}

function carouselGo(idx) {
  const images = currentModalMod?.images || [];
  if (images.length <= 1) return;
  carouselIdx = ((idx % images.length) + images.length) % images.length;
  const track   = document.getElementById("modal-carousel-track");
  const dots    = document.getElementById("carousel-dots");
  const counter = document.getElementById("carousel-counter");
  if (track) track.style.transform = `translateX(-${carouselIdx * 100}%)`;
  if (counter) counter.textContent = `${carouselIdx + 1} / ${images.length}`;
  dots?.querySelectorAll(".carousel-dot").forEach((d, i) => d.classList.toggle("active", i === carouselIdx));
}

function syncModalScore(modId) {
  if (!modId || !currentModalMod || currentModalMod.id !== modId) return;
  const score  = localVotes[modId] ?? 0;
  const myVote = userVotes[modId]  ?? 0;
  const scoreEl = document.getElementById("modal-vote-score");
  const upBtn   = document.getElementById("modal-upvote-btn");
  const dnBtn   = document.getElementById("modal-downvote-btn");
  if (scoreEl) { scoreEl.textContent = score; scoreEl.className = `vote-score${score > 0 ? " positive" : score < 0 ? " negative" : ""}`; }
  upBtn?.classList.toggle("active", myVote === 1);
  dnBtn?.classList.toggle("active", myVote === -1);
}

// ─── HELPERS ─────────────────────────────────────────────────────
function updateStatsBar() {
  if (!modData) return;
  const totalMods  = modData.sections.reduce((a, s) => a + s.mods.length, 0);
  const totalVotes = Object.values(localVotes).reduce((a, b) => a + Math.abs(b), 0);
  const sm = document.getElementById("stat-mods");
  const sv = document.getElementById("stat-votes");
  const ss = document.getElementById("stat-sections");
  if (sm) sm.innerHTML = `📦 <strong>${totalMods}</strong> mods`;
  if (sv) sv.innerHTML = `🗳️ <strong>${totalVotes}</strong> votos`;
  if (ss) ss.innerHTML = `📂 <strong>${modData.sections.length}</strong> secciones`;
}

function hideLoading() { document.getElementById("loading-screen")?.remove(); }

function showErrorState(err) {
  const app = document.getElementById("app");
  app.innerHTML = `<div class="error-state"><h2>⚠️ Error al cargar</h2><p>Revisa la consola (F12).</p><pre>${escapeHtml(String(err))}</pre></div>`;
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById("toast"); if (!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
            .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

// ─── ARRANQUE ────────────────────────────────────────────────────
init();
