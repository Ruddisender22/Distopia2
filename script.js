/* ================================================================
   DISTOPIA 2 — script.js v9
   Critical fix: Auth modal GIS lazy-render + auto-close on login
   · Dark vibrant aurora background (high saturation blobs)
   · Auth modal: NEVER auto-opens, lazy GIS render, auto-close
   · Sliders: ghost-dot fix, thumbnail nav, counter
   · Vote: stamp press + neon particles + localStorage + server
   ================================================================ */

// ─── CONFIG ────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID =
  "913594462364-gertg3gi5104bfdv0onr9km4rvtg4p5s.apps.googleusercontent.com";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz2RtSxsb_HwurxvKLSXaz2wLin50Wf2Wx2L8y2FIl7r-mMdTh1rklIER9mnTb-Y0I/exec";
const PROXY_POST = "https://corsproxy.io/?";
const PROXY_GET  = "https://api.allorigins.win/raw?url=";

// ─── STATE ─────────────────────────────────────────────────────
let localVotes  = {};
let userVotes   = {};
let modData     = null;
let currentUser = null;
const votingLocked = new Set();
let userVotesReady = false;
let gisReady = false; // GIS library fully loaded

// ─── LOCALSTORAGE ────────────────────────────────────────────────
const LS_PREFIX = "distopia2_uv_";
function lsGetVotes(sub) {
  try { const d = localStorage.getItem(LS_PREFIX+sub); return d ? JSON.parse(d) : {}; }
  catch { return {}; }
}
function lsSaveVotes(sub, votes) {
  try { localStorage.setItem(LS_PREFIX+sub, JSON.stringify(votes)); } catch {}
}

// ══════════════════════════════════════════════════════════════
//  AURORA BACKGROUND — Dark vibrant blobs
// ══════════════════════════════════════════════════════════════
function initBlobBg() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // High-saturation, luminous blobs for dark background
  const BLOBS = [
    { x:0.15, y:0.20, r:0.52, vx:0.000072, vy:0.000058, h:268, s:88, l:62, a:0.34 },
    { x:0.84, y:0.72, r:0.48, vx:-0.000058, vy:-0.000072, h:298, s:85, l:60, a:0.28 },
    { x:0.52, y:0.04, r:0.42, vx:0.000092, vy:0.000082, h:200, s:90, l:65, a:0.24 },
    { x:0.06, y:0.80, r:0.36, vx:0.000082, vy:-0.000062, h:22,  s:88, l:65, a:0.20 },
    { x:0.92, y:0.16, r:0.32, vx:-0.000098, vy:0.000078, h:185, s:82, l:62, a:0.22 },
    { x:0.62, y:0.92, r:0.34, vx:-0.000068, vy:-0.000088, h:330, s:86, l:68, a:0.18 },
    { x:0.30, y:0.54, r:0.26, vx:0.000055, vy:0.000102, h:252, s:80, l:70, a:0.16 },
    { x:0.75, y:0.38, r:0.22, vx:-0.000085, vy:0.000065, h:168, s:85, l:66, a:0.14 },
    { x:0.42, y:0.75, r:0.20, vx:0.000110, vy:-0.000075, h:350, s:90, l:65, a:0.12 },
  ];

  let W = 0, H = 0;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener("resize", resize); resize();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const R = Math.min(W, H);
    BLOBS.forEach(b => {
      b.x += b.vx; b.y += b.vy;
      if (b.x < 0.05) b.vx = Math.abs(b.vx);
      if (b.x > 0.95) b.vx = -Math.abs(b.vx);
      if (b.y < 0.02) b.vy = Math.abs(b.vy);
      if (b.y > 0.98) b.vy = -Math.abs(b.vy);
      const cx = b.x*W, cy = b.y*H, radius = b.r*R;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      g.addColorStop(0,   `hsla(${b.h},${b.s}%,${b.l}%,${b.a})`);
      g.addColorStop(0.45,`hsla(${b.h},${b.s}%,${b.l}%,${(b.a*0.45).toFixed(3)})`);
      g.addColorStop(1,   `hsla(${b.h},${b.s}%,${b.l}%,0)`);
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI*2);
      ctx.fillStyle = g; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ══════════════════════════════════════════════════════════════
//  GOOGLE SIGN-IN
// ══════════════════════════════════════════════════════════════
function waitForGis() {
  if (typeof google !== "undefined" && google.accounts) {
    gisReady = true;
    initGIS();
  } else {
    setTimeout(waitForGis, 200);
  }
}

function initGIS() {
  // Only initialize once
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  // CRITICAL: cancel any auto One-Tap prompt
  // (prevents modal from appearing on its own at page load)
  google.accounts.id.cancel();

  // Render the corner header button (always visible, always works)
  const cornerBtn = document.getElementById("google-login-btn");
  if (cornerBtn) {
    google.accounts.id.renderButton(cornerBtn, {
      theme: "filled_black", size: "large", shape: "pill",
      text: "signin_with", width: 200,
    });
  }
  // NOTE: The auth modal button is rendered lazily in openAuthModal()
  // because the element is hidden (display:none) at init time,
  // which means GIS cannot measure it → button renders broken.
}

// ── THE FIX: lazy-render GIS button when auth modal becomes visible ──
function renderGisModalButton() {
  if (!gisReady) return;
  const container = document.getElementById("google-login-btn-modal");
  if (!container) return;
  // Clear any previous render attempt
  container.innerHTML = "";
  // Use measured width after element is painted
  const w = Math.min(container.clientWidth || 280, 320);
  google.accounts.id.renderButton(container, {
    theme: "filled_black", size: "large", shape: "rectangular",
    text: "signin_with", width: w,
  });
}

// ── Called by GIS when login completes (from corner OR modal button) ──
function handleCredentialResponse(response) {
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

  // Load cached votes immediately for instant UI update
  const cached = lsGetVotes(currentUser.sub);
  if (Object.keys(cached).length > 0) {
    userVotes = cached;
    userVotesReady = true;
  } else {
    userVotesReady = false;
  }

  // ── AUTO-CLOSE AUTH MODAL with fade-out animation ──
  // This runs whether the user clicked the modal button OR the corner button.
  closeAuthModal();

  updateAuthUI(true);
  refreshCardStates();
  refreshModalButtons();
  showToast(`👋 ¡Bienvenido, ${currentUser.name}!`);
  // Sync votes from server in background
  loadUserVotesFromServer();
}

function logout() {
  if (typeof google !== "undefined") google.accounts.id.disableAutoSelect();
  currentUser = null; userVotes = {}; votingLocked.clear(); userVotesReady = false;
  updateAuthUI(false);
  refreshCardStates();
  refreshModalButtons();
  showToast("👋 Sesión cerrada");
}

function updateAuthUI(loggedIn) {
  const wrapperEl = document.getElementById("login-wrapper");
  const chipEl    = document.getElementById("user-chip");
  const nameEl    = document.getElementById("user-name");
  const emailEl   = document.getElementById("user-email");
  const avatarEl  = document.getElementById("user-avatar");
  if (loggedIn && currentUser) {
    wrapperEl?.setAttribute("hidden","");
    chipEl?.removeAttribute("hidden");
    if (nameEl)  nameEl.textContent  = currentUser.name;
    if (emailEl) emailEl.textContent = currentUser.email;
    if (avatarEl && currentUser.picture) { avatarEl.src = currentUser.picture; avatarEl.alt = currentUser.name; }
  } else {
    wrapperEl?.removeAttribute("hidden");
    chipEl?.setAttribute("hidden","");
  }
}

function parseJWT(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");
    return JSON.parse(decodeURIComponent(
      atob(b64).split("").map(c => "%" + ("00"+c.charCodeAt(0).toString(16)).slice(-2)).join("")
    ));
  } catch { return null; }
}

// ══════════════════════════════════════════════════════════════
//  AUTH MODAL
//  RULE: NEVER opens automatically on page load.
//        ONLY opens when unauthenticated user tries to vote.
// ══════════════════════════════════════════════════════════════
let authModalCloseTimer = null;

function openAuthModal() {
  const overlay = document.getElementById("auth-modal-overlay");
  if (!overlay) return;

  // Remove closing class if re-opening quickly
  overlay.classList.remove("closing");
  const sheet = document.getElementById("auth-modal-panel");
  sheet?.classList.remove("auth-modal-closing");

  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";

  // ── LAZY GIS RENDER ──
  // We do this AFTER the element is visible (has real dimensions).
  // Double rAF ensures the browser has painted the element.
  requestAnimationFrame(() => {
    requestAnimationFrame(renderGisModalButton);
  });
}

function closeAuthModal() {
  const overlay = document.getElementById("auth-modal-overlay");
  const sheet   = document.getElementById("auth-modal-panel");
  if (!overlay || overlay.hidden) return;

  // Play fade-out animation, then hide
  overlay.classList.add("closing");
  sheet?.classList.add("auth-modal-closing");

  clearTimeout(authModalCloseTimer);
  authModalCloseTimer = setTimeout(() => {
    overlay.setAttribute("hidden","");
    overlay.classList.remove("closing");
    sheet?.classList.remove("auth-modal-closing");
    document.body.style.overflow = "";
    // Clear GIS container so next open re-renders fresh
    const container = document.getElementById("google-login-btn-modal");
    if (container) container.innerHTML = "";
  }, 260);
}

function initAuthModal() {
  const overlay  = document.getElementById("auth-modal-overlay");
  const closeBtn = document.getElementById("auth-modal-close");
  if (!overlay || !closeBtn) return;

  // X button — always functional
  closeBtn.addEventListener("click", closeAuthModal);

  // Click outside sheet to close
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeAuthModal();
  });

  // Escape key
  document.addEventListener("keydown", e => {
    if (overlay && !overlay.hidden && !overlay.classList.contains("closing") && e.key==="Escape") {
      closeAuthModal();
    }
  });
}

// ══════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════
async function init() {
  initBlobBg();
  waitForGis();
  document.getElementById("logout-btn")?.addEventListener("click", logout);
  initAuthModal();

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

// ── Aggregate votes ─────────────────────────────────────────────
async function fetchAggregateVotes() {
  const targetUrl = `${APPS_SCRIPT_URL}?action=getVotes`;
  const urls = [PROXY_GET + encodeURIComponent(targetUrl), targetUrl];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers:{Accept:"application/json"}, signal:AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = JSON.parse(await res.text());
      if (data.error) throw new Error(data.error);
      return data;
    } catch (e) { console.warn("[Distopia2] GET votos:", e.message); }
  }
  return {};
}

// ── User votes ──────────────────────────────────────────────────
async function loadUserVotesFromServer() {
  if (!currentUser) return;
  try {
    const params = new URLSearchParams({ action:"getUserVotes", sub:currentUser.sub });
    const res = await fetch(PROXY_GET + encodeURIComponent(`${APPS_SCRIPT_URL}?${params}`), {
      headers:{Accept:"application/json"}, signal:AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = JSON.parse(await res.text());
    if (data.error) throw new Error(data.error);
    userVotes = data;
    lsSaveVotes(currentUser.sub, data);
    console.log("[Distopia2] Votos sincronizados:", data);
  } catch (e) {
    console.warn("[Distopia2] getUserVotes (caché):", e.message);
  } finally {
    userVotesReady = true;
    refreshCardStates();
    refreshModalButtons();
  }
}

// ══════════════════════════════════════════════════════════════
//  RENDER — Horizontal sliders per section
// ══════════════════════════════════════════════════════════════
function renderAll() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  modData.sections.forEach(s => app.appendChild(buildSection(s)));
}

function buildSection(section) {
  const block = document.createElement("div"); block.className = "section-block";

  const rule = document.createElement("div"); rule.className = "section-rule";
  block.appendChild(rule);

  // Section header
  const head = document.createElement("div"); head.className = "section-head";
  const labelWrap = document.createElement("div"); labelWrap.className = "section-label-wrap";
  const label = document.createElement("h2"); label.className = "section-label"; label.textContent = section.name;
  const tag = document.createElement("span"); tag.className = "section-tag";
  tag.textContent = `${section.mods.length} ${section.mods.length!==1?"mods":"mod"}`;
  labelWrap.appendChild(label); labelWrap.appendChild(tag);

  const right = document.createElement("div"); right.className = "section-right";
  const thumbsWrap = document.createElement("div"); thumbsWrap.className = "section-thumbs";
  right.appendChild(thumbsWrap);
  const counter = document.createElement("span"); counter.className = "section-counter";
  counter.textContent = `01 / ${String(section.mods.length).padStart(2,"0")}`;
  right.appendChild(counter);

  head.appendChild(labelWrap); head.appendChild(right);
  block.appendChild(head);

  // Slider
  const viewport = document.createElement("div"); viewport.className = "slider-viewport";
  const prevBtn = document.createElement("button"); prevBtn.className = "slider-nav prev"; prevBtn.innerHTML = "‹"; prevBtn.setAttribute("aria-label","Anterior");
  const nextBtn = document.createElement("button"); nextBtn.className = "slider-nav next"; nextBtn.innerHTML = "›"; nextBtn.setAttribute("aria-label","Siguiente");
  viewport.appendChild(prevBtn);
  const track = document.createElement("div"); track.className = "slider-track";
  section.mods.forEach(mod => track.appendChild(buildCard(mod)));
  viewport.appendChild(track);
  viewport.appendChild(nextBtn);
  block.appendChild(viewport);

  // Dots
  const dotsWrap = document.createElement("div"); dotsWrap.className = "slider-dots";
  section.mods.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = `sdot${i===0?" active":""}`;
    dot.setAttribute("aria-label", `Mod ${i+1}`);
    dotsWrap.appendChild(dot);
  });
  block.appendChild(dotsWrap);

  // Logic
  let currentIdx = 0;

  function cardWidth() {
    const c = track.querySelector(".mod-card");
    if (!c) return 300;
    return c.offsetWidth + parseInt(getComputedStyle(track).gap || "18");
  }

  function updateThumbs(idx) {
    thumbsWrap.innerHTML = "";
    section.mods.slice(idx+1, idx+4).forEach((m, i) => {
      const th = document.createElement("div"); th.className = "sthumb"; th.title = m.name;
      const img = document.createElement("img"); img.src = m.images?.[0]||""; img.alt = m.name; img.loading="lazy";
      img.onerror = () => { th.style.background="var(--glass)"; img.style.display="none"; };
      th.appendChild(img);
      th.addEventListener("click", () => scrollTo(idx+1+i));
      thumbsWrap.appendChild(th);
    });
  }

  function scrollTo(idx) {
    const n = section.mods.length;
    currentIdx = Math.max(0, Math.min(idx, n-1));
    track.scrollTo({ left: currentIdx * cardWidth(), behavior:"smooth" });
    counter.textContent = `${String(currentIdx+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`;
    dotsWrap.querySelectorAll(".sdot").forEach((d,i) => d.classList.toggle("active", i===currentIdx));
    prevBtn.disabled = currentIdx===0;
    nextBtn.disabled = currentIdx===n-1;
    updateThumbs(currentIdx);
  }

  prevBtn.addEventListener("click", () => scrollTo(currentIdx-1));
  nextBtn.addEventListener("click", () => scrollTo(currentIdx+1));
  dotsWrap.querySelectorAll(".sdot").forEach((d,i) => d.addEventListener("click", () => scrollTo(i)));

  track.addEventListener("scroll", () => {
    const w = cardWidth(); if (!w) return;
    const idx = Math.round(track.scrollLeft / w);
    if (idx !== currentIdx) {
      currentIdx = idx;
      counter.textContent = `${String(idx+1).padStart(2,"0")} / ${String(section.mods.length).padStart(2,"0")}`;
      dotsWrap.querySelectorAll(".sdot").forEach((d,i) => d.classList.toggle("active", i===idx));
      updateThumbs(idx);
    }
  }, { passive:true });

  // ── GHOST-DOT FIX ──────────────────────────────────────────
  // Hide dots + arrows when all cards fit with no scroll needed
  function checkOverflow() {
    const hasOverflow = track.scrollWidth > track.clientWidth + 8;
    dotsWrap.style.display = hasOverflow ? "" : "none";
    prevBtn.style.display  = hasOverflow ? "" : "none";
    nextBtn.style.display  = hasOverflow ? "" : "none";
  }
  // After layout paint
  requestAnimationFrame(() => requestAnimationFrame(checkOverflow));
  window.addEventListener("resize", checkOverflow, { passive:true });

  scrollTo(0);
  return block;
}

// ── Mod Card ────────────────────────────────────────────────────
function buildCard(mod) {
  const score  = localVotes[mod.id] ?? 0;
  const myVote = userVotes[mod.id] ?? 0;
  const card = document.createElement("article");
  card.className = "mod-card"; card.id = `card-${mod.id}`;
  if (myVote === 1)  card.classList.add("voted-up");
  if (myVote === -1) card.classList.add("voted-down");

  // Thumbnail
  if (mod.images?.length > 0) {
    const thumb = document.createElement("div"); thumb.className = "mod-thumb";
    thumb.setAttribute("role","button"); thumb.setAttribute("tabindex","0");
    thumb.setAttribute("aria-label",`Ver detalle de ${mod.name}`);
    const img = document.createElement("img");
    img.src = mod.images[0]; img.alt = mod.name;
    img.className = "mod-thumb-img"; img.loading = "lazy"; img.decoding = "async";
    img.onerror = () => { img.src = `https://placehold.co/800x450/07041a/4c3a8a?text=${encodeURIComponent(mod.name)}`; };
    thumb.appendChild(img);
    const hover = document.createElement("div"); hover.className = "thumb-hover";
    hover.innerHTML = `<span class="thumb-label">Ver detalle</span>`; thumb.appendChild(hover);
    if (mod.images.length > 1) {
      const cnt = document.createElement("span"); cnt.className = "thumb-count";
      cnt.textContent = `${mod.images.length} img`; thumb.appendChild(cnt);
    }
    thumb.addEventListener("click", () => openModal(mod));
    thumb.addEventListener("keydown", e => { if (e.key==="Enter"||e.key===" ") openModal(mod); });
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
  body.appendChild(voteRow);
  card.appendChild(body);

  const badge = document.createElement("div");
  badge.className = `unvoted-badge${(currentUser && userVotesReady && myVote===0) ? "" : " hidden"}`;
  badge.id = `badge-${mod.id}`;
  badge.innerHTML = `<span class="unvoted-bang">!!</span><span class="unvoted-text">Vota</span>`;
  card.appendChild(badge);

  return card;
}

function buildCardBtn(modId, dir, myVote) {
  const btn = document.createElement("button");
  btn.id = dir===1 ? `up-${modId}` : `dn-${modId}`;
  btn.setAttribute("aria-label", dir===1 ? "Votar positivo" : "Votar negativo");
  const upSVG   = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  const dnSVG   = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const lockSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

  if (!currentUser) {
    btn.className = "vote-btn-card locked"; btn.innerHTML = lockSVG;
    btn.title = "Inicia sesión para votar";
    btn.onclick = e => { e.stopPropagation(); openAuthModal(); };
  } else {
    btn.className = `vote-btn-card ${dir===1?"up":"dn"}${myVote===dir?" active":""}`;
    btn.innerHTML = dir===1 ? upSVG : dnSVG;
    btn.onclick = e => { e.stopPropagation(); handleVote(modId, dir); };
  }
  return btn;
}

function refreshCardStates() {
  if (!modData) return;
  const upSVG   = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  const dnSVG   = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const lockSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

  modData.sections.forEach(s => s.mods.forEach(mod => {
    const upBtn = document.getElementById(`up-${mod.id}`);
    const dnBtn = document.getElementById(`dn-${mod.id}`);
    if (!upBtn || !dnBtn) return;
    const myVote = userVotes[mod.id] ?? 0;

    const badge = document.getElementById(`badge-${mod.id}`);
    if (badge) badge.classList.toggle("hidden", !(currentUser && userVotesReady && myVote===0));

    const card = document.getElementById(`card-${mod.id}`);
    if (card) {
      card.classList.toggle("voted-up",   currentUser && myVote===1);
      card.classList.toggle("voted-down", currentUser && myVote===-1);
    }

    if (currentUser) {
      const waiting = !userVotesReady;
      [[upBtn,1,"up",upSVG],[dnBtn,-1,"dn",dnSVG]].forEach(([btn,dir,cls,svg]) => {
        btn.className = `vote-btn-card ${cls}${myVote===dir?" active":""}${waiting?" loading":""}`;
        btn.innerHTML = svg; btn.title = waiting ? "Cargando votos..." : ""; btn.disabled = waiting;
        btn.onclick = waiting ? null : (e => { e.stopPropagation(); handleVote(mod.id, dir); });
      });
    } else {
      [upBtn,dnBtn].forEach(btn => {
        btn.className = "vote-btn-card locked"; btn.innerHTML = lockSVG;
        btn.title = "Inicia sesión para votar"; btn.disabled = false;
        btn.onclick = e => { e.stopPropagation(); openAuthModal(); };
      });
    }
  }));
}

// ══════════════════════════════════════════════════════════════
//  VOTE LOGIC
// ══════════════════════════════════════════════════════════════
async function handleVote(modId, direction) {
  if (!currentUser)    { openAuthModal(); return; }
  if (!userVotesReady) { showToast("⏳ Cargando tus votos, un momento..."); return; }
  if (votingLocked.has(modId)) { showToast("⏱ Voto en cooldown, espera un momento"); return; }
  votingLocked.add(modId);

  const current = userVotes[modId] ?? 0;
  let delta, newMyVote;
  if (current === direction) {
    delta = -direction; newMyVote = 0; delete userVotes[modId]; showToast("↩ Voto retirado");
  } else if (current === 0) {
    delta = direction; newMyVote = direction; userVotes[modId] = direction;
    showToast(direction===1 ? "✓ Voto positivo" : "✗ Voto negativo");
  } else {
    delta = direction - current; newMyVote = direction; userVotes[modId] = direction;
    showToast(direction===1 ? "✓ Cambiado a positivo" : "✗ Cambiado a negativo");
  }

  localVotes[modId] = (localVotes[modId] ?? 0) + delta;
  const newScore = localVotes[modId];

  // Score
  const scoreEl = document.getElementById(`score-${modId}`);
  if (scoreEl) {
    scoreEl.textContent = newScore;
    scoreEl.className = `score-val ${scoreClass(newScore)} bump`;
    setTimeout(() => scoreEl.classList.remove("bump"), 320);
  }

  // Button states + stamp press
  const upBtn = document.getElementById(`up-${modId}`);
  const dnBtn = document.getElementById(`dn-${modId}`);
  upBtn?.classList.toggle("active", newMyVote===1);
  dnBtn?.classList.toggle("active", newMyVote===-1);
  const pressedBtn = direction===1 ? upBtn : dnBtn;
  if (pressedBtn) {
    pressedBtn.classList.add("stamp");
    setTimeout(() => pressedBtn.classList.remove("stamp"), 240);
  }

  // Card tint + shake
  const card = document.getElementById(`card-${modId}`);
  if (card) {
    card.classList.remove("voted-up","voted-down","shake");
    if (newMyVote === 1)  card.classList.add("voted-up");
    if (newMyVote === -1) card.classList.add("voted-down");
    requestAnimationFrame(() => {
      card.classList.add("shake");
      setTimeout(() => card.classList.remove("shake"), 340);
    });
  }

  // Badge particles
  const badge = document.getElementById(`badge-${modId}`);
  if (badge && newMyVote !== 0 && !badge.classList.contains("hidden")) {
    particleDisintegrate(badge);
  } else if (badge && newMyVote === 0) {
    badge.classList.remove("hidden");
  }

  lsSaveVotes(currentUser.sub, userVotes);
  refreshModalScore(modId);
  refreshModalButtons();
  updateStatsBar();

  try {
    const body = JSON.stringify({ id:modId, vote:newMyVote, token:currentUser.token, sub:currentUser.sub, email:currentUser.email });
    const res = await fetch(PROXY_POST + encodeURIComponent(APPS_SCRIPT_URL), {
      method:"POST", headers:{"Content-Type":"text/plain"}, body,
    });
    console.log("[Distopia2] POST:", await res.text());
  } catch (e) { console.warn("[Distopia2] POST error:", e.message); }

  setTimeout(() => votingLocked.delete(modId), 1500);
}

// ══════════════════════════════════════════════════════════════
//  PARTICLES — Neon orange/gold disintegration
// ══════════════════════════════════════════════════════════════
function particleDisintegrate(badge) {
  const rect = badge.getBoundingClientRect();
  badge.style.transition = "opacity 0.15s ease, transform 0.15s ease";
  badge.style.opacity = "0"; badge.style.transform = "scale(0.65)";

  for (let i = 0; i < 24; i++) {
    const p = document.createElement("div"); p.className = "vote-particle";
    const startX = rect.left + Math.random()*rect.width;
    const startY = rect.top  + Math.random()*rect.height;
    const angle  = (Math.PI*2*i/24) + (Math.random()-0.5)*0.9;
    const dist   = 28 + Math.random()*72;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist - (16+Math.random()*24);
    const size = 1.8 + Math.random()*3.5;
    const hue  = 18 + Math.random()*38;   // orange→amber
    const dur  = 0.4 + Math.random()*0.4;
    const del  = Math.random()*0.1;

    p.style.cssText = [
      `position:fixed`,`left:${startX}px`,`top:${startY}px`,
      `width:${size}px`,`height:${size}px`,`border-radius:50%`,
      `background:hsl(${hue},100%,60%)`,
      `box-shadow:0 0 ${size*2.5}px hsl(${hue},100%,60%)`,
      `pointer-events:none`,`z-index:9999`,
      `--dx:${dx}px`,`--dy:${dy}px`,
      `animation:particleFly ${dur}s ${del}s ease-out forwards`
    ].join(";");

    document.body.appendChild(p);
    setTimeout(() => p.remove(), (dur+del)*1000+80);
  }

  setTimeout(() => {
    badge.classList.add("hidden");
    badge.style.opacity = ""; badge.style.transform = ""; badge.style.transition = "";
  }, 280);
}

// ══════════════════════════════════════════════════════════════
//  MOD DETAIL MODAL
// ══════════════════════════════════════════════════════════════
let currentModalMod = null, carouselIdx = 0, touchStartX = 0;

function initModal() {
  const overlay  = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target===overlay) closeModal(); });
  document.addEventListener("keydown", e => {
    if (!overlay || overlay.hidden) return;
    if (e.key==="Escape") closeModal();
    if (e.key==="ArrowLeft")  carouselGo(carouselIdx-1);
    if (e.key==="ArrowRight") carouselGo(carouselIdx+1);
  });
  document.getElementById("carousel-prev")?.addEventListener("click", () => carouselGo(carouselIdx-1));
  document.getElementById("carousel-next")?.addEventListener("click", () => carouselGo(carouselIdx+1));
  const track = document.getElementById("modal-carousel-track");
  track?.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive:true });
  track?.addEventListener("touchend", e => { const dx = touchStartX - e.changedTouches[0].clientX; if (Math.abs(dx)>40) carouselGo(carouselIdx+(dx>0?1:-1)); });
  document.getElementById("modal-upvote-btn")?.addEventListener("click",   () => { if(currentModalMod) handleVote(currentModalMod.id, 1); });
  document.getElementById("modal-downvote-btn")?.addEventListener("click", () => { if(currentModalMod) handleVote(currentModalMod.id, -1); });
  document.getElementById("modal-upvote-btn-m")?.addEventListener("click",   () => { if(currentModalMod) handleVote(currentModalMod.id, 1); });
  document.getElementById("modal-downvote-btn-m")?.addEventListener("click", () => { if(currentModalMod) handleVote(currentModalMod.id, -1); });
}

function openModal(mod) {
  currentModalMod = mod; carouselIdx = 0;
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;
  document.getElementById("modal-mod-name").textContent = mod.name;
  document.getElementById("modal-description").innerHTML =
    (mod.paragraphs||[]).map(p=>`<p>${escapeHtml(p)}</p>`).join("");
  buildBentoGrid(mod);
  buildCarousel(mod);
  refreshModalScore(mod.id);
  refreshModalButtons();
  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("modal-panel")?.focus();
}

function buildBentoGrid(mod) {
  const bento = document.getElementById("modal-bento");
  if (!bento) return;
  bento.innerHTML = "";
  const images = mod.images||[];
  const count  = Math.min(images.length, 4);
  bento.className = `bento-grid count-${count||1}`;
  (count>0 ? images.slice(0,count) : ["placeholder"]).forEach((src,i) => {
    const item = document.createElement("div"); item.className = "bento-item";
    const img  = document.createElement("img");
    img.src = src==="placeholder" ? `https://placehold.co/800x450/07041a/4c3a8a?text=${encodeURIComponent(mod.name)}` : src;
    img.alt = `${mod.name} — imagen ${i+1}`; img.loading="lazy";
    img.onerror=()=>{ img.src=`https://placehold.co/800x450/07041a/4c3a8a?text=Sin+imagen`; };
    item.appendChild(img); bento.appendChild(item);
  });
}

function buildCarousel(mod) {
  const track   = document.getElementById("modal-carousel-track");
  const dots    = document.getElementById("carousel-dots");
  const counter = document.getElementById("carousel-counter");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  if (!track) return;
  track.innerHTML=""; if(dots) dots.innerHTML="";
  (mod.images||[]).forEach((src,i)=>{
    const slide = document.createElement("div"); slide.className="gallery-slide";
    const img   = document.createElement("img"); img.src=src; img.alt=`${mod.name} ${i+1}`; img.loading="lazy";
    img.onerror=()=>{ img.src=`https://placehold.co/800x450/07041a/4c3a8a?text=Sin+imagen`; };
    slide.appendChild(img); track.appendChild(slide);
    if(dots&&(mod.images||[]).length>1){
      const dot=document.createElement("button"); dot.className=`gallery-dot${i===0?" active":""}`; dot.setAttribute("aria-label",`Imagen ${i+1}`);
      dot.addEventListener("click",()=>carouselGo(i)); dots.appendChild(dot);
    }
  });
  const multi=(mod.images||[]).length>1;
  if(prevBtn) prevBtn.hidden=!multi;
  if(nextBtn) nextBtn.hidden=!multi;
  if(!multi&&dots) dots.innerHTML="";
  if(counter) counter.textContent=multi?`1 / ${mod.images.length}`:"";
}

function closeModal() {
  document.getElementById("modal-overlay")?.setAttribute("hidden","");
  document.body.style.overflow = "";
  currentModalMod = null;
}

function carouselGo(idx) {
  const imgs=currentModalMod?.images||[]; if(imgs.length<=1) return;
  carouselIdx=((idx%imgs.length)+imgs.length)%imgs.length;
  const track=document.getElementById("modal-carousel-track");
  if(track) track.style.transform=`translateX(-${carouselIdx*100}%)`;
  const counter=document.getElementById("carousel-counter");
  if(counter) counter.textContent=`${carouselIdx+1} / ${imgs.length}`;
  document.getElementById("carousel-dots")?.querySelectorAll(".gallery-dot")
    .forEach((d,i)=>d.classList.toggle("active",i===carouselIdx));
}

function refreshModalScore(modId) {
  if(!currentModalMod||currentModalMod.id!==modId) return;
  const score=localVotes[modId]??0;
  const cls=score>0?" pos":score<0?" neg":"";
  const el=document.getElementById("modal-vote-score");
  const elm=document.getElementById("modal-vote-score-m");
  if(el){el.textContent=score; el.className=`modal-score-number${cls}`;}
  if(elm) elm.textContent=score;
}

function refreshModalButtons() {
  if(!currentModalMod) return;
  const myVote=userVotes[currentModalMod.id]??0;
  [["modal-upvote-btn",1],["modal-downvote-btn",-1],["modal-upvote-btn-m",1],["modal-downvote-btn-m",-1]].forEach(([id,dir])=>{
    const b=document.getElementById(id); if(!b) return;
    b.disabled=!currentUser; b.classList.toggle("active",myVote===dir);
  });
}

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════
function scoreClass(s){ return s>0?"pos":s<0?"neg":""; }

function updateStatsBar() {
  if(!modData) return;
  const totalMods  = modData.sections.reduce((a,s)=>a+s.mods.length,0);
  const totalVotes = Object.values(localVotes).reduce((a,v)=>a+Math.abs(v),0);
  const sm=document.getElementById("stat-mods-val");   if(sm) sm.textContent=totalMods;
  const sv=document.getElementById("stat-votes-val");  if(sv) sv.textContent=totalVotes;
  const ss=document.getElementById("stat-sections-val"); if(ss) ss.textContent=modData.sections.length;
  const smh=document.getElementById("stat-mods");   if(smh) smh.textContent=`${totalMods} mods`;
  const svh=document.getElementById("stat-votes");  if(svh) svh.textContent=`${totalVotes} votos`;
  const ssh=document.getElementById("stat-sections"); if(ssh) ssh.textContent=`${modData.sections.length} secciones`;
}

function hideLoading(){ document.getElementById("loading-screen")?.remove(); }
function showErrorState(err){
  document.getElementById("app").innerHTML=
    `<div class="error-state"><h2>⚠️ Error al cargar</h2><p>Revisa la consola (F12).</p><pre>${escapeHtml(String(err))}</pre></div>`;
}

let toastTimer=null;
function showToast(msg){
  const t=document.getElementById("toast"); if(!t) return;
  t.textContent=msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),2800);
}

function escapeHtml(s){
  if(typeof s!=="string") return "";
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

// ── Boot ──────────────────────────────────────────────────────
init();
