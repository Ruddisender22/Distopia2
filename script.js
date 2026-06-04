/* ================================================================
   DISTOPIA 2 — script.js v6
   · Fondo: blobs flotantes estilo iOS/macOS Sonoma (canvas)
   · Login: GIS renderButton sobre overlay → siempre funciona
   · Votos: JWT decodificado sin verificación estricta (funcional)
   · Modal: retirar / cambiar voto sin cerrar
   ================================================================ */

// ─── CONFIG ────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID =
  "913594462364-gertg3gi5104bfdv0onr9km4rvtg4p5s.apps.googleusercontent.com";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz2RtSxsb_HwurxvKLSXaz2wLin50Wf2Wx2L8y2FIl7r-mMdTh1rklIER9mnTb-Y0I/exec";
const PROXY = "https://corsproxy.io/?";
// GET_URL se construye dinámicamente según la acción (ver fetchAggregateVotes / loadUserVotesFromServer)

// ─── ESTADO ────────────────────────────────────────────────────
let localVotes = {};
let userVotes = {};
let modData = null;
let currentUser = null;
const votingLocked = new Set();

// ══════════════════════════════════════════════════════════════
//  FONDO — Blobs flotantes (estilo iOS/macOS Sonoma)
// ══════════════════════════════════════════════════════════════
function initBlobBg() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Blobs: posición inicial, radio (relativo), velocidad, HSL, opacidad
  const BLOBS = [
    { x: 0.22, y: 0.28, r: 0.42, vx: 0.000080, vy: 0.000065, h: 270, s: 80, l: 62, a: 0.32 },
    { x: 0.78, y: 0.68, r: 0.40, vx: -0.000065, vy: -0.000080, h: 300, s: 78, l: 58, a: 0.26 },
    { x: 0.50, y: 0.08, r: 0.32, vx: 0.000100, vy: 0.000090, h: 245, s: 75, l: 65, a: 0.22 },
    { x: 0.12, y: 0.80, r: 0.34, vx: 0.000090, vy: -0.000070, h: 18, s: 82, l: 65, a: 0.20 },
    { x: 0.88, y: 0.22, r: 0.30, vx: -0.000110, vy: 0.000085, h: 200, s: 72, l: 60, a: 0.19 },
    { x: 0.62, y: 0.88, r: 0.28, vx: -0.000075, vy: -0.000095, h: 330, s: 76, l: 68, a: 0.18 },
    { x: 0.35, y: 0.55, r: 0.22, vx: 0.000060, vy: 0.000110, h: 260, s: 70, l: 70, a: 0.14 },
  ];

  let W = 0, H = 0;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener("resize", resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const R = Math.min(W, H);

    BLOBS.forEach(b => {
      // Mover
      b.x += b.vx; b.y += b.vy;
      // Rebote suave en bordes
      if (b.x < 0.1) b.vx = Math.abs(b.vx);
      if (b.x > 0.9) b.vx = -Math.abs(b.vx);
      if (b.y < 0.05) b.vy = Math.abs(b.vy);
      if (b.y > 0.95) b.vy = -Math.abs(b.vy);

      const cx = b.x * W, cy = b.y * H, radius = b.r * R;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, `hsla(${b.h},${b.s}%,${b.l}%,${b.a})`);
      grad.addColorStop(0.45, `hsla(${b.h},${b.s}%,${b.l}%,${(b.a * 0.55).toFixed(3)})`);
      grad.addColorStop(1, `hsla(${b.h},${b.s}%,${b.l}%,0)`);

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ══════════════════════════════════════════════════════════════
//  GOOGLE SIGN-IN — renderButton sobre overlay (siempre funciona)
// ══════════════════════════════════════════════════════════════
function waitForGis() {
  if (typeof google !== "undefined" && google.accounts) {
    initGIS();
  } else {
    setTimeout(waitForGis, 200);
  }
}

function initGIS() {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,   // no intentar sin interacción (menos errores)
    cancel_on_tap_outside: false,
    itp_support: true,
  });

  // Renderizar el botón oficial de Google DENTRO del overlay invisible
  const container = document.getElementById("google-login-btn");
  if (container) {
    google.accounts.id.renderButton(container, {
      theme: "filled_black",
      size: "large",
      text: "signin_with",
      width: 280,
    });
  }
}

// Callback cuando el usuario completa el Sign-In
function handleCredentialResponse(response) {
  // Decodificamos el JWT localmente (sin verificar firma —
  // la integridad la garantiza Google entregando el token a través de HTTPS)
  const payload = parseJWT(response.credential);
  if (!payload) { showToast("⚠️ Error al procesar el token"); return; }

  currentUser = {
    token: response.credential,
    sub: payload.sub,
    email: payload.email || "",
    name: payload.given_name || payload.name || "Jugador",
    picture: payload.picture || "",
    exp: payload.exp,
  };

  updateAuthUI(true);
  refreshCardStates();   // desbloqueo inmediato
  refreshModalButtons(); // actualizar modal si estaba abierto
  document.getElementById("stat-hint")?.classList.add("hidden");
  showToast(`👋 ¡Bienvenido, ${currentUser.name}!`);
  loadUserVotesFromServer();
}

function logout() {
  if (typeof google !== "undefined") google.accounts.id.disableAutoSelect();
  currentUser = null; userVotes = {}; votingLocked.clear();
  updateAuthUI(false);
  refreshCardStates();
  refreshModalButtons();
  document.getElementById("stat-hint")?.classList.remove("hidden");
  showToast("👋 Sesión cerrada");
}

function updateAuthUI(loggedIn) {
  const wrapperEl = document.getElementById("login-wrapper");
  const chipEl = document.getElementById("user-chip");
  const nameEl = document.getElementById("user-name");
  const emailEl = document.getElementById("user-email");
  const avatarEl = document.getElementById("user-avatar");

  if (loggedIn && currentUser) {
    wrapperEl?.setAttribute("hidden", "");
    chipEl?.removeAttribute("hidden");
    if (nameEl) nameEl.textContent = currentUser.name;
    if (emailEl) emailEl.textContent = currentUser.email;
    if (avatarEl && currentUser.picture) { avatarEl.src = currentUser.picture; avatarEl.alt = currentUser.name; }
  } else {
    wrapperEl?.removeAttribute("hidden");
    chipEl?.setAttribute("hidden", "");
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

// ══════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════
async function init() {
  initBlobBg();
  waitForGis();

  document.getElementById("logout-btn")?.addEventListener("click", logout);

  try {
    const [dataRes, votes] = await Promise.all([
      fetch("data.json"),
      fetchAggregateVotes()
    ]);
    modData = await dataRes.json();
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

// ── Votos agregados (público) ─────────────────────────────
async function fetchAggregateVotes() {
  // La URL completa (con ?action=getVotes) debe codificarse antes de pasarla al proxy
  const targetUrl = `${APPS_SCRIPT_URL}?action=getVotes`;
  const urls = [
    PROXY + encodeURIComponent(targetUrl),
    targetUrl, // fallback directo (puede fallar por CORS)
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(7000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      console.log("[Distopia2] Votos cargados:", data);
      return data;
    } catch (e) { console.warn("[Distopia2] GET:", e.message); }
  }
  return {};
}

// ── Votos del usuario desde el servidor ──────────────────
async function loadUserVotesFromServer() {
  if (!currentUser) return;
  try {
    // La URL completa con params debe codificarse antes de pasarla al proxy
    const params = new URLSearchParams({ action: "getUserVotes", token: currentUser.token });
    const targetUrl = `${APPS_SCRIPT_URL}?${params}`;
    const res = await fetch(PROXY + encodeURIComponent(targetUrl), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    userVotes = data;
    console.log("[Distopia2] Votos usuario cargados:", data);
    refreshCardStates();
    refreshModalButtons();
  } catch (e) { console.warn("[Distopia2] getUserVotes:", e.message); }
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
  const block = document.createElement("div"); block.className = "section-block";
  const header = document.createElement("div"); header.className = "section-header";
  const label = document.createElement("h2"); label.className = "section-label"; label.textContent = section.name;
  const tag = document.createElement("span"); tag.className = "section-tag";
  tag.textContent = `${section.mods.length} mod${section.mods.length !== 1 ? "s" : ""}`;
  header.appendChild(label); header.appendChild(tag); block.appendChild(header);
  const grid = document.createElement("div"); grid.className = "mod-grid";
  section.mods.forEach(mod => grid.appendChild(buildCard(mod)));
  block.appendChild(grid); return block;
}

function buildCard(mod) {
  const score = localVotes[mod.id] ?? 0, myVote = userVotes[mod.id] ?? 0;
  const card = document.createElement("article");
  card.className = "mod-card"; card.id = `card-${mod.id}`;

  if (mod.images?.length > 0) {
    const thumb = document.createElement("div");
    thumb.className = "mod-thumb";
    thumb.setAttribute("role", "button"); thumb.setAttribute("tabindex", "0");
    thumb.setAttribute("aria-label", `Ver detalle de ${mod.name}`);
    const img = document.createElement("img");
    img.src = mod.images[0]; img.alt = mod.name;
    img.className = "mod-thumb-img"; img.loading = "lazy"; img.decoding = "async";
    img.onerror = () => { img.src = `https://placehold.co/800x450/08081a/56506a?text=${encodeURIComponent(mod.name)}`; };
    thumb.appendChild(img);
    const hover = document.createElement("div"); hover.className = "thumb-hover";
    hover.innerHTML = `<span class="thumb-label">Ver detalle</span>`; thumb.appendChild(hover);
    if (mod.images.length > 1) {
      const cnt = document.createElement("span"); cnt.className = "thumb-count";
      cnt.textContent = `${mod.images.length} imágenes`; thumb.appendChild(cnt);
    }
    thumb.addEventListener("click", () => openModal(mod));
    thumb.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openModal(mod); });
    card.appendChild(thumb);
  }

  const body = document.createElement("div"); body.className = "mod-body";
  const titleRow = document.createElement("div"); titleRow.className = "mod-title-row";
  const nameEl = document.createElement("h3"); nameEl.className = "mod-name";
  nameEl.textContent = mod.name; nameEl.addEventListener("click", () => openModal(mod));
  const typeTag = document.createElement("span"); typeTag.className = "mod-type-tag"; typeTag.textContent = "MOD";
  titleRow.appendChild(nameEl); titleRow.appendChild(typeTag); body.appendChild(titleRow);

  if (mod.paragraphs?.length > 0) {
    const ex = document.createElement("p"); ex.className = "mod-excerpt"; ex.textContent = mod.paragraphs[0];
    body.appendChild(ex);
  }

  const voteRow = document.createElement("div"); voteRow.className = "vote-row";
  const scorePill = document.createElement("div"); scorePill.className = "score-pill";
  scorePill.innerHTML = `<span class="score-val ${scoreClass(score)}" id="score-${mod.id}">${score}</span><span class="score-lbl">pts</span>`;
  const group = document.createElement("div"); group.className = "vote-group";
  group.appendChild(buildCardBtn(mod.id, 1, myVote));
  group.appendChild(buildCardBtn(mod.id, -1, myVote));
  voteRow.appendChild(scorePill); voteRow.appendChild(group);
  body.appendChild(voteRow); card.appendChild(body);
  return card;
}

function buildCardBtn(modId, dir, myVote) {
  const btn = document.createElement("button");
  btn.id = dir === 1 ? `up-${modId}` : `dn-${modId}`;
  btn.setAttribute("aria-label", dir === 1 ? "Votar positivo" : "Votar negativo");
  const upSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  const dnSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const lockSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

  if (!currentUser) {
    btn.className = "vote-btn-card locked"; btn.innerHTML = lockSVG;
    btn.title = "Inicia sesión para votar";
    btn.addEventListener("click", e => { e.stopPropagation(); showToast("🔐 Inicia sesión para votar"); });
  } else {
    btn.className = `vote-btn-card ${dir === 1 ? "up" : "dn"}${myVote === dir ? " active" : ""}`;
    btn.innerHTML = dir === 1 ? upSVG : dnSVG;
    btn.addEventListener("click", e => { e.stopPropagation(); handleVote(modId, dir); });
  }
  return btn;
}

function refreshCardStates() {
  if (!modData) return;
  const upSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  const dnSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const lockSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

  modData.sections.forEach(s => s.mods.forEach(mod => {
    const upBtn = document.getElementById(`up-${mod.id}`);
    const dnBtn = document.getElementById(`dn-${mod.id}`);
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
        btn.onclick = e => { e.stopPropagation(); showToast("🔐 Inicia sesión para votar"); };
      });
    }
  }));
}

// ══════════════════════════════════════════════════════════════
//  LÓGICA DE VOTO
// ══════════════════════════════════════════════════════════════
async function handleVote(modId, direction) {
  if (!currentUser) { showToast("🔐 Inicia sesión para votar"); return; }
  if (votingLocked.has(modId)) return;
  votingLocked.add(modId);

  const current = userVotes[modId] ?? 0;
  let delta, newMyVote;

  if (current === direction) {
    delta = -direction; newMyVote = 0; delete userVotes[modId];
    showToast("↩️ Voto retirado");
  } else if (current === 0) {
    delta = direction; newMyVote = direction; userVotes[modId] = direction;
    showToast(direction === 1 ? "✅ Voto positivo registrado" : "👎 Voto negativo registrado");
  } else {
    delta = direction - current; newMyVote = direction; userVotes[modId] = direction;
    showToast(direction === 1 ? "✅ Cambiado a positivo" : "👎 Cambiado a negativo");
  }

  localVotes[modId] = (localVotes[modId] ?? 0) + delta;
  const newScore = localVotes[modId];

  // UI optimista — tarjeta
  const scoreEl = document.getElementById(`score-${modId}`);
  if (scoreEl) {
    scoreEl.textContent = newScore;
    scoreEl.className = `score-val ${scoreClass(newScore)} bump`;
    setTimeout(() => scoreEl.classList.remove("bump"), 320);
  }
  const upBtn = document.getElementById(`up-${modId}`);
  const dnBtn = document.getElementById(`dn-${modId}`);
  upBtn?.classList.toggle("active", newMyVote === 1);
  dnBtn?.classList.toggle("active", newMyVote === -1);

  // Modal
  refreshModalScore(modId);
  refreshModalButtons();
  updateStatsBar();

  // Enviar al servidor a través del proxy CORS para poder leer la respuesta
  try {
    const postBody = JSON.stringify({ id: modId, vote: newMyVote, token: currentUser.token, sub: currentUser.sub, email: currentUser.email });
    console.log("[Distopia2] POST enviando:", { modId, vote: newMyVote, sub: currentUser.sub });
    const res = await fetch(PROXY + encodeURIComponent(APPS_SCRIPT_URL), {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: postBody,
    });
    const text = await res.text();
    console.log("[Distopia2] POST respuesta:", text);
  } catch (e) { console.warn("[Distopia2] POST error:", e.message); }

  setTimeout(() => votingLocked.delete(modId), 1500);
}

// ══════════════════════════════════════════════════════════════
//  MODAL
// ══════════════════════════════════════════════════════════════
let currentModalMod = null, carouselIdx = 0, touchStartX = 0;

function initModal() {
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const track = document.getElementById("modal-carousel-track");
  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => {
    if (!overlay || overlay.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") carouselGo(carouselIdx - 1);
    if (e.key === "ArrowRight") carouselGo(carouselIdx + 1);
  });
  prevBtn?.addEventListener("click", () => carouselGo(carouselIdx - 1));
  nextBtn?.addEventListener("click", () => carouselGo(carouselIdx + 1));
  track?.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track?.addEventListener("touchend", e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) carouselGo(carouselIdx + (dx > 0 ? 1 : -1));
  });
  document.getElementById("modal-upvote-btn")?.addEventListener("click", () => { if (currentModalMod) handleVote(currentModalMod.id, 1); });
  document.getElementById("modal-downvote-btn")?.addEventListener("click", () => { if (currentModalMod) handleVote(currentModalMod.id, -1); });
}

function openModal(mod) {
  currentModalMod = mod; carouselIdx = 0;
  const overlay = document.getElementById("modal-overlay");
  const track = document.getElementById("modal-carousel-track");
  const dots = document.getElementById("carousel-dots");
  const counter = document.getElementById("carousel-counter");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  if (!overlay || !track) return;

  document.getElementById("modal-mod-name").textContent = mod.name;
  document.getElementById("modal-description").innerHTML =
    (mod.paragraphs || []).map(p => `<p>${escapeHtml(p)}</p>`).join("");

  track.innerHTML = ""; if (dots) dots.innerHTML = "";
  (mod.images || []).forEach((src, i) => {
    const slide = document.createElement("div"); slide.className = "gallery-slide";
    const img = document.createElement("img");
    img.src = src; img.alt = `${mod.name} ${i + 1}`; img.loading = "lazy";
    img.onerror = () => { img.src = `https://placehold.co/800x450/08081a/56506a?text=Sin+imagen`; };
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
  const track = document.getElementById("modal-carousel-track");
  if (track) track.style.transform = `translateX(-${carouselIdx * 100}%)`;
  const counter = document.getElementById("carousel-counter");
  if (counter) counter.textContent = `${carouselIdx + 1} / ${imgs.length}`;
  document.getElementById("carousel-dots")?.querySelectorAll(".gallery-dot")
    .forEach((d, i) => d.classList.toggle("active", i === carouselIdx));
}

function refreshModalScore(modId) {
  if (!currentModalMod || currentModalMod.id !== modId) return;
  const score = localVotes[modId] ?? 0;
  const el = document.getElementById("modal-vote-score");
  if (el) { el.textContent = score; el.className = `modal-score-number${score > 0 ? " pos" : score < 0 ? " neg" : ""}`; }
}

function refreshModalButtons() {
  if (!currentModalMod) return;
  const myVote = userVotes[currentModalMod.id] ?? 0;
  const upBtn = document.getElementById("modal-upvote-btn");
  const dnBtn = document.getElementById("modal-downvote-btn");
  if (!upBtn || !dnBtn) return;

  if (!currentUser) {
    upBtn.disabled = dnBtn.disabled = true;
  } else {
    upBtn.disabled = dnBtn.disabled = false;
    upBtn.classList.toggle("active", myVote === 1);
    dnBtn.classList.toggle("active", myVote === -1);
  }
}

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════
function scoreClass(s) { return s > 0 ? "pos" : s < 0 ? "neg" : ""; }

function updateStatsBar() {
  if (!modData) return;
  const totalMods = modData.sections.reduce((a, s) => a + s.mods.length, 0);
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
  document.getElementById("app").innerHTML =
    `<div class="error-state"><h2>⚠️ Error al cargar</h2><p>Revisa la consola (F12).</p><pre>${escapeHtml(String(err))}</pre></div>`;
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById("toast"); if (!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

function escapeHtml(s) {
  if (typeof s !== "string") return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ── Arranque ──────────────────────────────────────────────────
init();
