/* ================================================================
   DISTOPIA 2 — script.js v5
   · Google Sign-In (GIS) con botón custom
   · Votaciones por usuario — fix modal (cambio/retirada sin cerrar)
   · Sin canvas — fondo CSS puro
   ================================================================ */

// ─── CONFIG ────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID =
  "913594462364-gertg3gi5104bfdv0onr9km4rvtg4p5s.apps.googleusercontent.com";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxrSAX-G-RsOJrvjyStydqKd36SEiSg_NEKoSmx4lt9B7Tv-QnNOc4ClvberNYj0GsI/exec";

const PROXY   = "https://corsproxy.io/?";
const GET_URL = PROXY + encodeURIComponent(APPS_SCRIPT_URL);

// ─── ESTADO ────────────────────────────────────────────────────
let localVotes  = {};   // { modId: number }  — totales del servidor
let userVotes   = {};   // { modId: 1 | -1 }  — votos del usuario
let modData     = null;
let currentUser = null; // { token, sub, email, name, picture, exp }

// Evita que se envíen dos peticiones para el mismo mod a la vez
const votingLocked = new Set();

// ══════════════════════════════════════════════════════════════
//  GOOGLE SIGN-IN
// ══════════════════════════════════════════════════════════════

// Esperar a que la librería GIS esté lista
function waitForGis() {
  if (typeof google !== "undefined" && google.accounts) {
    initGIS();
  } else {
    setTimeout(waitForGis, 200);
  }
}

function initGIS() {
  google.accounts.id.initialize({
    client_id:             GOOGLE_CLIENT_ID,
    callback:              handleCredentialResponse,
    auto_select:           true,
    cancel_on_tap_outside: false,
    itp_support:           true,
  });

  // Intentar One Tap silencioso (si el navegador lo permite)
  google.accounts.id.prompt(note => {
    if (note.isNotDisplayed() || note.isSkippedMoment()) {
      console.log("[Distopia2] One Tap no disponible:", note.getNotDisplayedReason?.() ?? note.getSkippedReason?.());
    }
  });
}

// Nuestro botón custom llama a este método
function triggerLogin() {
  if (typeof google === "undefined") {
    showToast("⚠️ Google aún no cargó. Espera un momento.");
    return;
  }
  google.accounts.id.prompt();
}

// Callback cuando el usuario completa el Sign-In
function handleCredentialResponse(response) {
  const payload = parseJWT(response.credential);
  if (!payload) { showToast("⚠️ Error al procesar el token de Google"); return; }

  currentUser = {
    token:   response.credential,
    sub:     payload.sub,
    email:   payload.email,
    name:    payload.given_name || payload.name || "Jugador",
    picture: payload.picture || "",
    exp:     payload.exp,
  };

  // 1. Mostrar chip de usuario (ocultar botón de login)
  updateAuthUI(true);

  // 2. ⚡ Desbloquear todos los botones INMEDIATAMENTE
  refreshCardStates();
  refreshModalButtons();

  // 3. Ocultar hint de login
  document.getElementById("stat-hint")?.classList.add("hidden");

  showToast(`👋 ¡Bienvenido, ${currentUser.name}!`);

  // 4. Cargar votos previos del servidor en background
  loadUserVotesFromServer();
}

function logout() {
  if (typeof google !== "undefined") google.accounts.id.disableAutoSelect();
  currentUser = null;
  userVotes   = {};
  votingLocked.clear();
  updateAuthUI(false);
  refreshCardStates();
  refreshModalButtons();
  document.getElementById("stat-hint")?.classList.remove("hidden");
  showToast("👋 Sesión cerrada");
}

// ── Actualizar UI de auth ─────────────────────────────────────
function updateAuthUI(loggedIn) {
  const loginBtn = document.getElementById("login-btn");
  const userChip = document.getElementById("user-chip");
  const nameEl   = document.getElementById("user-name");
  const emailEl  = document.getElementById("user-email");
  const avatarEl = document.getElementById("user-avatar");

  if (loggedIn && currentUser) {
    loginBtn?.setAttribute("hidden", "");
    userChip?.removeAttribute("hidden");
    if (nameEl)   nameEl.textContent  = currentUser.name;
    if (emailEl)  emailEl.textContent = currentUser.email;
    if (avatarEl && currentUser.picture) { avatarEl.src = currentUser.picture; avatarEl.alt = currentUser.name; }
  } else {
    loginBtn?.removeAttribute("hidden");
    userChip?.setAttribute("hidden", "");
  }
}

function parseJWT(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(
      atob(b64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    ));
  } catch { return null; }
}

function isTokenExpired() {
  return !currentUser || (Date.now() / 1000) > currentUser.exp - 30;
}

// ══════════════════════════════════════════════════════════════
//  INIT PRINCIPAL
// ══════════════════════════════════════════════════════════════
async function init() {
  waitForGis();

  // Conectar controles de UI
  document.getElementById("login-btn")?.addEventListener("click", triggerLogin);
  document.getElementById("logout-btn")?.addEventListener("click", logout);

  try {
    const [dataRes, votes] = await Promise.all([
      fetch("data.json"),
      fetchAggregateVotes()
    ]);

    modData    = await dataRes.json();
    localVotes = votes;

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

// ── Fetch votos agregados (público, sin auth) ─────────────────
async function fetchAggregateVotes() {
  const urls = [
    `${GET_URL}&${new URLSearchParams({ action: "getVotes" })}`,
    `${APPS_SCRIPT_URL}?action=getVotes`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal:  AbortSignal.timeout(7000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (e) {
      console.warn("[Distopia2] GET fallido:", e.message);
    }
  }
  return {};
}

// ── Fetch votos del usuario desde el servidor ─────────────────
async function loadUserVotesFromServer() {
  if (!currentUser || isTokenExpired()) return;
  try {
    const params = new URLSearchParams({ action: "getUserVotes", token: currentUser.token });
    const res = await fetch(`${GET_URL}&${params}`, {
      headers: { Accept: "application/json" },
      signal:  AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    userVotes = data;
    refreshCardStates();
    refreshModalButtons();
  } catch (e) {
    console.warn("[Distopia2] getUserVotes fallido:", e.message);
  }
}

// ══════════════════════════════════════════════════════════════
//  RENDER
// ══════════════════════════════════════════════════════════════
function renderAll() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  modData.sections.forEach(s => app.appendChild(buildSection(s)));
}

function buildSection(section) {
  const block = document.createElement("div");
  block.className = "section-block";

  // Cabecera de sección
  const header = document.createElement("div");
  header.className = "section-header";

  const label = document.createElement("h2");
  label.className = "section-label";
  label.textContent = section.name;

  const tag = document.createElement("span");
  tag.className = "section-tag";
  tag.textContent = `${section.mods.length} mod${section.mods.length !== 1 ? "s" : ""}`;

  header.appendChild(label);
  header.appendChild(tag);
  block.appendChild(header);

  // Grid de tarjetas
  const grid = document.createElement("div");
  grid.className = "mod-grid";
  section.mods.forEach(mod => grid.appendChild(buildCard(mod)));
  block.appendChild(grid);
  return block;
}

// ── Tarjeta ───────────────────────────────────────────────────
function buildCard(mod) {
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
    img.onerror = () => { img.src = `https://placehold.co/800x450/0d0d18/5e5575?text=${encodeURIComponent(mod.name)}`; };
    thumb.appendChild(img);

    const hover = document.createElement("div"); hover.className = "thumb-hover-layer";
    hover.innerHTML = `<span class="thumb-open-label">Ver detalle</span>`;
    thumb.appendChild(hover);

    if (mod.images.length > 1) {
      const badge = document.createElement("span");
      badge.className = "thumb-img-count";
      badge.textContent = `${mod.images.length} imágenes`;
      thumb.appendChild(badge);
    }

    thumb.addEventListener("click",   () => openModal(mod));
    thumb.addEventListener("keydown", e  => { if (e.key === "Enter" || e.key === " ") openModal(mod); });
    card.appendChild(thumb);
  }

  // Body
  const body = document.createElement("div"); body.className = "mod-body";

  const titleRow = document.createElement("div"); titleRow.className = "mod-title-row";
  const nameEl = document.createElement("h3"); nameEl.className = "mod-name";
  nameEl.textContent = mod.name;
  nameEl.addEventListener("click", () => openModal(mod));
  const typeTag = document.createElement("span"); typeTag.className = "mod-type-tag"; typeTag.textContent = "MOD";
  titleRow.appendChild(nameEl); titleRow.appendChild(typeTag);
  body.appendChild(titleRow);

  if (mod.paragraphs?.length > 0) {
    const ex = document.createElement("p"); ex.className = "mod-excerpt";
    ex.textContent = mod.paragraphs[0];
    body.appendChild(ex);
  }

  // Fila de votación
  const voteRow = document.createElement("div"); voteRow.className = "vote-row";

  const scorePill = document.createElement("div"); scorePill.className = "score-pill";
  scorePill.innerHTML = `
    <span class="score-val ${scoreClass(score)}" id="score-${mod.id}">${score}</span>
    <span class="score-lbl">puntos</span>
  `;

  const group = document.createElement("div"); group.className = "vote-group";
  group.appendChild(buildCardVoteBtn(mod.id, 1,  myVote));
  group.appendChild(buildCardVoteBtn(mod.id, -1, myVote));

  voteRow.appendChild(scorePill); voteRow.appendChild(group);
  body.appendChild(voteRow); card.appendChild(body);
  return card;
}

function buildCardVoteBtn(modId, dir, myVote) {
  const btn  = document.createElement("button");
  const isUp = dir === 1;
  btn.id = isUp ? `up-${modId}` : `dn-${modId}`;
  btn.setAttribute("aria-label", isUp ? "Votar positivo" : "Votar negativo");

  const upSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  const dnSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const lockSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

  if (!currentUser) {
    btn.className = "vote-btn-card locked";
    btn.innerHTML = lockSVG;
    btn.title = "Inicia sesión para votar";
    btn.addEventListener("click", e => {
      e.stopPropagation();
      showToast("🔐 Inicia sesión para votar");
      triggerLogin();
    });
  } else {
    btn.className = `vote-btn-card ${isUp ? "up" : "dn"}${myVote === dir ? " active" : ""}`;
    btn.innerHTML = isUp ? upSVG : dnSVG;
    btn.addEventListener("click", e => { e.stopPropagation(); handleVote(modId, dir); });
  }
  return btn;
}

// Actualiza el estado de TODOS los botones de tarjetas sin re-renderizar
function refreshCardStates() {
  if (!modData) return;
  const upSVG  = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  const dnSVG  = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const lockSVG= `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

  modData.sections.forEach(s => s.mods.forEach(mod => {
    const upBtn  = document.getElementById(`up-${mod.id}`);
    const dnBtn  = document.getElementById(`dn-${mod.id}`);
    if (!upBtn || !dnBtn) return;
    const myVote = userVotes[mod.id] ?? 0;

    if (currentUser) {
      [[upBtn, 1, "up", upSVG], [dnBtn, -1, "dn", dnSVG]].forEach(([btn, dir, cls, svg]) => {
        btn.className = `vote-btn-card ${cls}${myVote === dir ? " active" : ""}`;
        btn.innerHTML = svg; btn.title = ""; btn.disabled = false;
        btn.onclick = e => { e.stopPropagation(); handleVote(mod.id, dir); };
      });
    } else {
      [upBtn, dnBtn].forEach(btn => {
        btn.className = "vote-btn-card locked"; btn.innerHTML = lockSVG;
        btn.title = "Inicia sesión para votar"; btn.disabled = false;
        btn.onclick = e => { e.stopPropagation(); showToast("🔐 Inicia sesión para votar"); triggerLogin(); };
      });
    }
  }));
}

// ══════════════════════════════════════════════════════════════
//  LÓGICA DE VOTO — sin restricción por botón de tarjeta
// ══════════════════════════════════════════════════════════════
async function handleVote(modId, direction) {
  if (!currentUser) { showToast("🔐 Inicia sesión para votar"); triggerLogin(); return; }
  if (isTokenExpired()) { showToast("⏰ Sesión expirada, vuelve a iniciar sesión"); logout(); return; }
  if (votingLocked.has(modId)) return; // Petición en vuelo para este mod

  votingLocked.add(modId);

  const current = userVotes[modId] ?? 0;
  let delta, newMyVote;

  if (current === direction) {
    // Mismo voto → retirar
    delta = -direction; newMyVote = 0;
    delete userVotes[modId];
    showToast("↩️ Voto retirado");
  } else if (current === 0) {
    // Nuevo voto
    delta = direction; newMyVote = direction;
    userVotes[modId] = direction;
    showToast(direction === 1 ? "✅ ¡Voto positivo registrado!" : "👎 Voto negativo registrado");
  } else {
    // Cambio de dirección
    delta = direction - current; newMyVote = direction;
    userVotes[modId] = direction;
    showToast(direction === 1 ? "✅ Voto cambiado a positivo" : "👎 Voto cambiado a negativo");
  }

  // Actualizar score local (optimista)
  localVotes[modId] = (localVotes[modId] ?? 0) + delta;
  const newScore = localVotes[modId];

  // Actualizar score UI
  const scoreEl = document.getElementById(`score-${modId}`);
  if (scoreEl) {
    scoreEl.textContent = newScore;
    scoreEl.className = `score-val ${scoreClass(newScore)} bump`;
    setTimeout(() => scoreEl.classList.remove("bump"), 320);
  }

  // Actualizar botones de tarjeta
  updateCardBtnsState(modId, newMyVote);

  // Actualizar modal si está abierto en este mod
  refreshModalScore(modId);
  refreshModalButtons();

  updateStatsBar();

  // Enviar al servidor
  try {
    await fetch(APPS_SCRIPT_URL, {
      method:  "POST",
      mode:    "no-cors",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: modId, delta, token: currentUser.token }),
    });
  } catch (e) {
    console.warn("[Distopia2] Error enviando voto:", e.message);
  }

  // Liberar bloqueo tras 1.5 s (suficiente para evitar doble click rápido)
  setTimeout(() => votingLocked.delete(modId), 1500);
}

// Aplica la clase active a los botones de una tarjeta concreta
function updateCardBtnsState(modId, myVote) {
  const upBtn = document.getElementById(`up-${modId}`);
  const dnBtn = document.getElementById(`dn-${modId}`);
  if (!upBtn || !dnBtn) return;
  upBtn.classList.toggle("active", myVote === 1);
  dnBtn.classList.toggle("active", myVote === -1);
}

// ══════════════════════════════════════════════════════════════
//  MODAL DE DETALLE
// ══════════════════════════════════════════════════════════════
let currentModalMod = null;
let carouselIdx = 0, touchStartX = 0;

function initModal() {
  const overlay = document.getElementById("modal-overlay");
  const closeBtn= document.getElementById("modal-close");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const track   = document.getElementById("modal-carousel-track");
  const upBtn   = document.getElementById("modal-upvote-btn");
  const dnBtn   = document.getElementById("modal-downvote-btn");

  if (!overlay || !closeBtn) return;

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

  track?.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track?.addEventListener("touchend",   e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) carouselGo(carouselIdx + (dx > 0 ? 1 : -1));
  });

  // Botones de voto en modal — llaman directamente a handleVote
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

  // Rellenar contenido
  document.getElementById("modal-mod-name").textContent = mod.name;
  document.getElementById("modal-description").innerHTML =
    (mod.paragraphs || []).map(p => `<p>${escapeHtml(p)}</p>`).join("");

  // Galería
  track.innerHTML = ""; if (dots) dots.innerHTML = "";
  (mod.images || []).forEach((src, i) => {
    const slide = document.createElement("div"); slide.className = "gallery-slide";
    const img = document.createElement("img");
    img.src = src; img.alt = `${mod.name} ${i + 1}`; img.loading = "lazy";
    img.onerror = () => { img.src = `https://placehold.co/800x450/0d0d18/5e5575?text=Sin+imagen`; };
    slide.appendChild(img); track.appendChild(slide);
    if (dots && (mod.images || []).length > 1) {
      const dot = document.createElement("button");
      dot.className = `gallery-dot${i === 0 ? " active" : ""}`;
      dot.setAttribute("aria-label", `Imagen ${i + 1}`);
      dot.addEventListener("click", () => carouselGo(i));
      dots.appendChild(dot);
    }
  });

  const multi = (mod.images || []).length > 1;
  if (prevBtn) prevBtn.hidden = !multi;
  if (nextBtn) nextBtn.hidden = !multi;
  if (!multi && dots) dots.innerHTML = "";
  if (counter) counter.textContent = multi ? `1 / ${mod.images.length}` : "";

  refreshModalScore(mod.id);
  refreshModalButtons();

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
  const imgs = currentModalMod?.images || [];
  if (imgs.length <= 1) return;
  carouselIdx = ((idx % imgs.length) + imgs.length) % imgs.length;
  const track   = document.getElementById("modal-carousel-track");
  const counter = document.getElementById("carousel-counter");
  const dots    = document.getElementById("carousel-dots");
  if (track) track.style.transform = `translateX(-${carouselIdx * 100}%)`;
  if (counter) counter.textContent = `${carouselIdx + 1} / ${imgs.length}`;
  dots?.querySelectorAll(".gallery-dot").forEach((d, i) => d.classList.toggle("active", i === carouselIdx));
}

// Actualiza el marcador en el modal para un mod concreto
function refreshModalScore(modId) {
  if (!currentModalMod || currentModalMod.id !== modId) return;
  const score   = localVotes[modId] ?? 0;
  const scoreEl = document.getElementById("modal-vote-score");
  if (scoreEl) {
    scoreEl.textContent = score;
    scoreEl.className = `modal-score-number${score > 0 ? " pos" : score < 0 ? " neg" : ""}`;
  }
}

// Actualiza el estado active de los botones del modal
function refreshModalButtons() {
  if (!currentModalMod) return;
  const modId  = currentModalMod.id;
  const myVote = userVotes[modId] ?? 0;
  const upBtn  = document.getElementById("modal-upvote-btn");
  const dnBtn  = document.getElementById("modal-downvote-btn");
  const actions= document.getElementById("modal-actions");

  if (!upBtn || !dnBtn) return;

  if (!currentUser) {
    // Sin login: ocultar o deshabilitar botones del modal
    if (actions) {
      actions.innerHTML = `<p style="font-size:.82rem;color:var(--text-3);">
        <a href="#" onclick="triggerLogin();return false;" style="color:var(--accent);font-weight:600;text-decoration:none;">
          Inicia sesión
        </a> para votar este mod
      </p>`;
    }
    return;
  }

  // Con login: restaurar botones si se habían eliminado
  if (!document.getElementById("modal-upvote-btn")) {
    if (actions) {
      actions.innerHTML = `
        <button class="action-btn support" id="modal-upvote-btn" aria-label="Apoyar este mod">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>
          Apoyar
        </button>
        <button class="action-btn reject" id="modal-downvote-btn" aria-label="Rechazar este mod">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          Rechazar
        </button>`;
      document.getElementById("modal-upvote-btn")?.addEventListener("click", () => { if (currentModalMod) handleVote(currentModalMod.id, 1); });
      document.getElementById("modal-downvote-btn")?.addEventListener("click", () => { if (currentModalMod) handleVote(currentModalMod.id, -1); });
    }
  }

  // Actualizar estado active
  document.getElementById("modal-upvote-btn")?.classList.toggle("active", myVote === 1);
  document.getElementById("modal-downvote-btn")?.classList.toggle("active", myVote === -1);
}

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════
function scoreClass(s) { return s > 0 ? "pos" : s < 0 ? "neg" : ""; }

function updateStatsBar() {
  if (!modData) return;
  const totalMods  = modData.sections.reduce((a, s) => a + s.mods.length, 0);
  const totalVotes = Object.values(localVotes).reduce((a, v) => a + Math.abs(v), 0);
  const sm = document.getElementById("stat-mods");
  const sv = document.getElementById("stat-votes");
  const ss = document.getElementById("stat-sections");
  if (sm) sm.innerHTML = `📦 <strong>${totalMods}</strong> mods`;
  if (sv) sv.innerHTML = `🗳 <strong>${totalVotes}</strong> votos`;
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

function escapeHtml(s) {
  if (typeof s !== "string") return "";
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

// ── Arranque ──────────────────────────────────────────────────
init();
