/* ================================================================
   DISTOPIA 2 — script.js v4
   · Fondo estelar (starfield + aurora borealis)
   · Google Sign-In con fix de botones bloqueados
   · Upvote / Downvote / Retirar por usuario (Google JWT)
   · Modal + carrusel táctil
   ================================================================ */

// ─── CONFIG ────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID =
  "913594462364-gertg3gi5104bfdv0onr9km4rvtg4p5s.apps.googleusercontent.com";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxrSAX-G-RsOJrvjyStydqKd36SEiSg_NEKoSmx4lt9B7Tv-QnNOc4ClvberNYj0GsI/exec";

const PROXY   = "https://corsproxy.io/?";
const GET_URL = PROXY + encodeURIComponent(APPS_SCRIPT_URL);

// ─── ESTADO ────────────────────────────────────────────────────
let localVotes    = {};   // { modId: number }  del servidor
let userVotes     = {};   // { modId: 1 | -1 }  del usuario
let modData       = null;
let currentUser   = null; // { token, sub, email, name, picture, exp }

// ══════════════════════════════════════════════════════════════
//  FONDO ESTELAR + AURORA BOREAL
// ══════════════════════════════════════════════════════════════
function initStarfield() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // ── Estrellas ─────────────────────────────────────────────
  const STAR_COUNT = 220;
  let stars = [];

  function buildStars(W, H) {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x:       Math.random() * W,
      y:       Math.random() * H,
      r:       Math.random() * 1.6 + 0.2,
      alpha:   Math.random() * 0.65 + 0.15,
      twSpeed: Math.random() * 0.018 + 0.004,
      twPhase: Math.random() * Math.PI * 2,
      color:   pickStarColor(),
    }));
  }

  function pickStarColor() {
    const roll = Math.random();
    if (roll < 0.06) return [180, 120, 255]; // morado
    if (roll < 0.10) return [255, 180, 100]; // naranja
    if (roll < 0.13) return [200, 100, 255]; // magenta
    return [255, 255, 255];                   // blanco
  }

  // ── Aurora Boreal ─────────────────────────────────────────
  // Bandas de aurora: muy lentas, muy suaves, con blur
  const AURORA = [
    { yRel: 0.12, amp: 55, freq: 0.0018, speed: 0.00008, ph: 0.0,  col: [180, 60, 255],  opa: 0.07 },
    { yRel: 0.20, amp: 40, freq: 0.0025, speed: 0.00006, ph: 2.1,  col: [220, 50, 250],  opa: 0.055 },
    { yRel: 0.07, amp: 35, freq: 0.0032, speed: 0.00010, ph: 4.5,  col: [255, 100, 50],  opa: 0.04 },
    { yRel: 0.30, amp: 65, freq: 0.0014, speed: 0.00005, ph: 1.4,  col: [100, 50, 255],  opa: 0.045 },
    { yRel: 0.01, amp: 30, freq: 0.0040, speed: 0.00012, ph: 3.3,  col: [200, 80, 255],  opa: 0.035 },
  ];

  // ── Meteoros ──────────────────────────────────────────────
  let meteors = [];
  let meteorTimer = 0;
  const METEOR_INTERVAL = 280; // frames entre meteoros

  function spawnMeteor(W, H) {
    const startX = Math.random() * W * 0.6 + W * 0.2;
    const startY = Math.random() * H * 0.3;
    const angle  = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    meteors.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8,
      len: Math.random() * 80 + 60,
      alpha: 1,
      life: 0, maxLife: 35,
    });
  }

  // ── Resize ────────────────────────────────────────────────
  let W = 0, H = 0;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars(W, H);
  }
  window.addEventListener("resize", resize);
  resize();

  // ── Bucle de render ───────────────────────────────────────
  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 1. Estrellas
    stars.forEach(s => {
      const twinkle = 0.65 + 0.35 * Math.sin(t * s.twSpeed + s.twPhase);
      const a = s.alpha * twinkle;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${a.toFixed(3)})`;
      if (s.r > 1.2) {
        ctx.shadowBlur  = 5;
        ctx.shadowColor = ctx.fillStyle;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 2. Aurora Boreal (con blur)
    ctx.save();
    ctx.filter = "blur(28px)";
    AURORA.forEach(band => {
      const yBase = H * band.yRel;

      // Construir el path ondulado
      ctx.beginPath();
      ctx.moveTo(0, yBase);
      for (let x = 0; x <= W + 4; x += 6) {
        const y = yBase
          + Math.sin(x * band.freq + t * band.speed * 6000 + band.ph) * band.amp
          + Math.sin(x * band.freq * 1.7 + t * band.speed * 3800 + band.ph + 1) * (band.amp * 0.22);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, yBase + band.amp * 2);
      ctx.lineTo(0, yBase + band.amp * 2);
      ctx.closePath();

      // Gradiente vertical dentro de la banda
      const grad = ctx.createLinearGradient(0, yBase - band.amp, 0, yBase + band.amp * 2);
      grad.addColorStop(0,   `rgba(${band.col},0)`);
      grad.addColorStop(0.35,`rgba(${band.col},${band.opa.toFixed(3)})`);
      grad.addColorStop(0.65,`rgba(${band.col},${(band.opa * 0.7).toFixed(3)})`);
      grad.addColorStop(1,   `rgba(${band.col},0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    });
    ctx.restore(); // elimina el blur para el resto

    // 3. Meteoros
    meteorTimer++;
    if (meteorTimer >= METEOR_INTERVAL && Math.random() < 0.025) {
      spawnMeteor(W, H); meteorTimer = 0;
    }
    meteors = meteors.filter(m => m.life < m.maxLife);
    meteors.forEach(m => {
      m.x += m.vx; m.y += m.vy; m.life++;
      const progress = m.life / m.maxLife;
      const a = (1 - progress) * 0.9;
      const tailX = m.x - m.vx * (m.len / 8);
      const tailY = m.y - m.vy * (m.len / 8);
      const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(1, `rgba(255,255,255,${a.toFixed(3)})`);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    });

    t++;
    requestAnimationFrame(draw);
  }

  draw();
}

// ══════════════════════════════════════════════════════════════
//  GOOGLE SIGN-IN
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
    client_id:            GOOGLE_CLIENT_ID,
    callback:             handleCredentialResponse,
    auto_select:          true,
    cancel_on_tap_outside:false,
    itp_support:          true,
  });

  // Renderizar botón oficial de Google
  const container = document.getElementById("google-login-btn");
  if (container) {
    google.accounts.id.renderButton(container, {
      theme: "filled_black", size: "medium", shape: "pill",
      text: "signin_with", locale: "es",
    });
  }

  // One Tap
  google.accounts.id.prompt(notification => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      // Mostrar botón fallback si One Tap no está disponible
      const fallback = document.getElementById("corner-login-fallback");
      if (fallback) fallback.hidden = false;
    }
  });
}

// Callback cuando Google completa el Sign-In
function handleCredentialResponse(response) {
  const payload = parseJWT(response.credential);
  if (!payload) { showToast("⚠️ Error procesando el token de Google"); return; }

  currentUser = {
    token:   response.credential,
    sub:     payload.sub,
    email:   payload.email,
    name:    payload.given_name || payload.name || "Jugador",
    picture: payload.picture || "",
    exp:     payload.exp,
  };

  // 1. Actualizar UI de auth
  updateAuthUI(true);

  // 2. ⚡ DESBLOQUEAR botones INMEDIATAMENTE (bug fix)
  refreshCardStates();
  syncModalVoteButtons();

  // 3. Ocultar pista de login en stats bar
  document.getElementById("stat-login-hint")?.classList.add("hidden");

  showToast(`👋 ¡Bienvenido, ${currentUser.name}!`);

  // 4. Cargar votos previos del servidor (en background)
  loadUserVotesFromServer();
}

function logout() {
  if (typeof google !== "undefined") google.accounts.id.disableAutoSelect();
  currentUser = null;
  userVotes   = {};
  updateAuthUI(false);
  refreshCardStates();
  syncModalVoteButtons();
  document.getElementById("stat-login-hint")?.classList.remove("hidden");
  showToast("👋 Sesión cerrada");
}

// ── UI de auth ────────────────────────────────────────────────
function updateAuthUI(loggedIn) {
  const loginEl  = document.getElementById("login-corner");
  const userEl   = document.getElementById("user-corner");
  const nameEl   = document.getElementById("user-name-corner");
  const emailEl  = document.getElementById("user-email-corner");
  const avatarEl = document.getElementById("user-avatar");

  if (loggedIn && currentUser) {
    loginEl?.setAttribute("hidden", "");
    userEl?.removeAttribute("hidden");
    if (nameEl)   nameEl.textContent  = currentUser.name;
    if (emailEl)  emailEl.textContent = currentUser.email;
    if (avatarEl && currentUser.picture) { avatarEl.src = currentUser.picture; avatarEl.alt = currentUser.name; }
  } else {
    loginEl?.removeAttribute("hidden");
    userEl?.setAttribute("hidden", "");
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
  initStarfield();
  waitForGis();

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

    document.getElementById("logout-btn")?.addEventListener("click", logout);
    document.getElementById("corner-login-fallback")?.addEventListener("click", () => {
      if (typeof google !== "undefined") google.accounts.id.prompt();
    });

  } catch (err) {
    console.error("[Distopia2]", err);
    hideLoading();
    showErrorState(err);
  }
}

// ── Fetch votos agregados (público) ───────────────────────────
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

// ── Fetch votos del usuario (requiere JWT) ────────────────────
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
    syncModalVoteButtons();
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

// ── Tarjeta de mod ────────────────────────────────────────────
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

    const ov = document.createElement("div"); ov.className = "thumb-overlay";
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

  const hRow = document.createElement("div"); hRow.className = "mod-header-row";
  const nameEl = document.createElement("h3"); nameEl.className = "mod-name";
  nameEl.textContent = mod.name;
  nameEl.addEventListener("click", () => openModal(mod));
  const badge = document.createElement("span"); badge.className = "mod-badge"; badge.textContent = "MOD";
  hRow.appendChild(nameEl); hRow.appendChild(badge);
  body.appendChild(hRow);

  if (mod.paragraphs?.length > 0) {
    const snip = document.createElement("p");
    snip.className = "mod-snippet";
    snip.textContent = mod.paragraphs[0];
    body.appendChild(snip);
  }

  // Voting
  const voting = document.createElement("div"); voting.className = "voting";

  const scoreWrap = document.createElement("div"); scoreWrap.className = "vote-score-wrap";
  scoreWrap.innerHTML = `
    <span class="vote-score-label">Puntos</span>
    <span class="vote-score ${scoreClass(score)}" id="score-${mod.id}">${score}</span>
  `;

  const btnGroup = document.createElement("div"); btnGroup.className = "vote-btn-group";
  btnGroup.appendChild(buildVoteBtn(mod.id, 1,  myVote));
  btnGroup.appendChild(buildVoteBtn(mod.id, -1, myVote));

  voting.appendChild(scoreWrap); voting.appendChild(btnGroup);
  body.appendChild(voting); card.appendChild(body);
  return card;
}

function scoreClass(s) {
  return s > 0 ? "vote-score positive" : s < 0 ? "vote-score negative" : "vote-score";
}

// Construye un botón de voto (up o down)
function buildVoteBtn(modId, direction, myVote) {
  const btn = document.createElement("button");
  const isUp = direction === 1;
  btn.id = isUp ? `up-${modId}` : `dn-${modId}`;
  btn.setAttribute("aria-label", isUp ? "Votar positivo" : "Votar negativo");

  if (!currentUser) {
    // Bloqueado
    btn.className = "vote-btn locked";
    btn.innerHTML = isUp
      ? `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
      : `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
    btn.title = "Inicia sesión para votar";
    btn.addEventListener("click", e => {
      e.stopPropagation();
      showToast("🔐 Inicia sesión con Google para votar");
      if (typeof google !== "undefined") google.accounts.id.prompt();
    });
  } else {
    const isActive = myVote === direction;
    btn.className = `vote-btn ${isUp ? "upvote" : "downvote"}${isActive ? " active" : ""}`;
    btn.innerHTML = isUp
      ? `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>`
      : `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;
    btn.addEventListener("click", e => { e.stopPropagation(); handleVote(modId, direction); });
  }
  return btn;
}

// Refresca el estado de todos los botones sin re-renderizar todo
function refreshCardStates() {
  if (!modData) return;
  modData.sections.forEach(s => {
    s.mods.forEach(mod => {
      const myVote = userVotes[mod.id] ?? 0;
      const upBtn  = document.getElementById(`up-${mod.id}`);
      const dnBtn  = document.getElementById(`dn-${mod.id}`);
      if (!upBtn || !dnBtn) return;

      if (currentUser) {
        // Desbloquear y configurar
        [upBtn, dnBtn].forEach((btn, i) => {
          const dir = i === 0 ? 1 : -1;
          btn.className = `vote-btn ${dir === 1 ? "upvote" : "downvote"}${myVote === dir ? " active" : ""}`;
          btn.title = "";
          btn.innerHTML = dir === 1
            ? `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>`
            : `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;
          btn.onclick = e => { e.stopPropagation(); handleVote(mod.id, dir); };
        });
      } else {
        // Bloquear
        [upBtn, dnBtn].forEach(btn => {
          btn.className = "vote-btn locked";
          btn.title = "Inicia sesión para votar";
          btn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
          btn.onclick = e => { e.stopPropagation(); showToast("🔐 Inicia sesión para votar"); };
        });
      }
    });
  });
}

// ══════════════════════════════════════════════════════════════
//  LÓGICA DE VOTO
// ══════════════════════════════════════════════════════════════
async function handleVote(modId, direction) {
  if (!currentUser) { showToast("🔐 Inicia sesión para votar"); return; }
  if (isTokenExpired()) { showToast("⏰ Sesión expirada, vuelve a iniciar sesión"); logout(); return; }

  const upBtn   = document.getElementById(`up-${modId}`);
  const dnBtn   = document.getElementById(`dn-${modId}`);
  const scoreEl = document.getElementById(`score-${modId}`);
  if (!upBtn || upBtn.disabled) return;

  const current = userVotes[modId] ?? 0;
  let delta = 0;

  if (current === direction) {
    delta = -direction; delete userVotes[modId];
    upBtn.classList.remove("active"); dnBtn.classList.remove("active");
    showToast("↩️ Voto retirado");
  } else if (current === 0) {
    delta = direction; userVotes[modId] = direction;
    if (direction === 1) { upBtn.classList.add("active"); dnBtn.classList.remove("active"); showToast("✅ ¡Voto positivo registrado!"); }
    else                  { dnBtn.classList.add("active"); upBtn.classList.remove("active"); showToast("👎 Voto negativo registrado"); }
  } else {
    delta = direction - current; userVotes[modId] = direction;
    if (direction === 1) { upBtn.classList.add("active"); dnBtn.classList.remove("active"); showToast("✅ Voto cambiado a positivo"); }
    else                  { dnBtn.classList.add("active"); upBtn.classList.remove("active"); showToast("👎 Voto cambiado a negativo"); }
  }

  // Actualizar UI optimista
  localVotes[modId] = (localVotes[modId] ?? 0) + delta;
  const newScore = localVotes[modId];
  if (scoreEl) {
    scoreEl.textContent = newScore;
    scoreEl.className = scoreClass(newScore) + " bump";
    setTimeout(() => scoreEl.classList.remove("bump"), 320);
  }

  syncModalScore(modId);
  syncModalVoteButtons();
  updateStatsBar();

  upBtn.disabled = dnBtn.disabled = true;

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: modId, delta, token: currentUser.token }),
    });
  } catch (e) { console.warn("[Distopia2] Error enviando voto:", e.message); }

  setTimeout(() => { if (upBtn) upBtn.disabled = false; if (dnBtn) dnBtn.disabled = false; }, 2500);
}

// ══════════════════════════════════════════════════════════════
//  MODAL DE DETALLE
// ══════════════════════════════════════════════════════════════
let currentModalMod = null, carouselIdx = 0, touchStartX = 0;

function initModal() {
  const overlay  = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  const prevBtn  = document.getElementById("carousel-prev");
  const nextBtn  = document.getElementById("carousel-next");
  const track    = document.getElementById("modal-carousel-track");
  const upBtn    = document.getElementById("modal-upvote-btn");
  const dnBtn    = document.getElementById("modal-downvote-btn");

  if (!overlay || !closeBtn || !track) { console.warn("[Distopia2] Modal: elementos no encontrados"); return; }

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

  // Tags
  const tagsEl = document.getElementById("modal-tags");
  if (tagsEl) tagsEl.innerHTML = `<span class="modal-tag type-mod">MOD</span>`;

  document.getElementById("modal-mod-name").textContent = mod.name;
  document.getElementById("modal-description").innerHTML =
    (mod.paragraphs || []).map(p => `<p>${escapeHtml(p)}</p>`).join("");

  // Carrusel
  track.innerHTML = ""; if (dots) dots.innerHTML = "";
  (mod.images || []).forEach((src, i) => {
    const slide = document.createElement("div"); slide.className = "carousel-slide";
    const img = document.createElement("img");
    img.src = src; img.alt = `${mod.name} ${i + 1}`; img.loading = "lazy";
    img.onerror = () => { img.src = `https://placehold.co/800x450/07001a/6b5485?text=Sin+imagen`; };
    slide.appendChild(img); track.appendChild(slide);
    if (dots && (mod.images || []).length > 1) {
      const dot = document.createElement("button");
      dot.className = `carousel-dot${i === 0 ? " active" : ""}`;
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

  syncModalScore(mod.id);
  syncModalVoteButtons();

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
  const dots    = document.getElementById("carousel-dots");
  const counter = document.getElementById("carousel-counter");
  if (track) track.style.transform = `translateX(-${carouselIdx * 100}%)`;
  if (counter) counter.textContent = `${carouselIdx + 1} / ${imgs.length}`;
  dots?.querySelectorAll(".carousel-dot").forEach((d, i) => d.classList.toggle("active", i === carouselIdx));
}

function syncModalScore(modId) {
  if (!currentModalMod || currentModalMod.id !== modId) return;
  const score  = localVotes[modId] ?? 0;
  const scoreEl = document.getElementById("modal-vote-score");
  if (scoreEl) { scoreEl.textContent = score; scoreEl.className = `modal-score-value${score > 0 ? " positive" : score < 0 ? " negative" : ""}`; }
}

function syncModalVoteButtons() {
  if (!currentModalMod) return;
  const modId  = currentModalMod.id;
  const myVote = userVotes[modId] ?? 0;
  const upBtn  = document.getElementById("modal-upvote-btn");
  const dnBtn  = document.getElementById("modal-downvote-btn");
  upBtn?.classList.toggle("active", myVote === 1);
  dnBtn?.classList.toggle("active", myVote === -1);
}

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════
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
  app.innerHTML = `<div class="error-state"><h2>⚠️ Error al cargar</h2><p>Revisa la consola (F12) para más detalles.</p><pre>${escapeHtml(String(err))}</pre></div>`;
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

// ── Arranque ─────────────────────────────────────────────────
init();
