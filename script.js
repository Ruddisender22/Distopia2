/* ================================================================
   DISTOPIA 2 — script.js v7
   · Aurora background blobs
   · Login: GIS renderButton overlay
   · Horizontal sliders per category with counter + nav
   · Bento grid modal (desktop) / bottom sheet + carousel (mobile)
   · Vote: localStorage persistence + server sync
   · Particle disintegration badge + screen shake + card tint
   ================================================================ */

// ─── CONFIG ────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID =
  "913594462364-gertg3gi5104bfdv0onr9km4rvtg4p5s.apps.googleusercontent.com";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz2RtSxsb_HwurxvKLSXaz2wLin50Wf2Wx2L8y2FIl7r-mMdTh1rklIER9mnTb-Y0I/exec";
const PROXY_POST = "https://corsproxy.io/?";
const PROXY_GET  = "https://api.allorigins.win/raw?url=";

// ─── ESTADO ────────────────────────────────────────────────────
let localVotes = {};
let userVotes  = {};
let modData    = null;
let currentUser = null;
const votingLocked = new Set();
let userVotesReady = false;

// ─── PERSISTENCIA LOCAL (localStorage) ──────────────────────────
const LS_PREFIX = 'distopia2_uv_';
function lsGetVotes(sub) {
  try { const d = localStorage.getItem(LS_PREFIX + sub); return d ? JSON.parse(d) : {}; }
  catch { return {}; }
}
function lsSaveVotes(sub, votes) {
  try { localStorage.setItem(LS_PREFIX + sub, JSON.stringify(votes)); } catch {}
}
function lsClearVotes(sub) {
  try { localStorage.removeItem(LS_PREFIX + sub); } catch {}
}

// ══════════════════════════════════════════════════════════════
//  AURORA BACKGROUND — Blobs flotantes
// ══════════════════════════════════════════════════════════════
function initBlobBg() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BLOBS = [
    { x:0.18, y:0.22, r:0.48, vx:0.000075, vy:0.000060, h:268, s:75, l:58, a:0.28 },
    { x:0.82, y:0.72, r:0.44, vx:-0.000060, vy:-0.000075, h:298, s:72, l:55, a:0.22 },
    { x:0.50, y:0.05, r:0.36, vx:0.000095, vy:0.000085, h:200, s:80, l:62, a:0.18 },
    { x:0.08, y:0.78, r:0.32, vx:0.000085, vy:-0.000065, h:20,  s:78, l:62, a:0.16 },
    { x:0.90, y:0.18, r:0.28, vx:-0.000100, vy:0.000080, h:185, s:70, l:58, a:0.15 },
    { x:0.60, y:0.90, r:0.30, vx:-0.000070, vy:-0.000090, h:330, s:72, l:65, a:0.14 },
    { x:0.32, y:0.52, r:0.22, vx:0.000055, vy:0.000105, h:255, s:68, l:68, a:0.12 },
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
      const g = ctx.createRadialGradient(cx,cy,0,cx,cy,radius);
      g.addColorStop(0, `hsla(${b.h},${b.s}%,${b.l}%,${b.a})`);
      g.addColorStop(0.4, `hsla(${b.h},${b.s}%,${b.l}%,${(b.a*0.5).toFixed(3)})`);
      g.addColorStop(1, `hsla(${b.h},${b.s}%,${b.l}%,0)`);
      ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2);
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
  if (typeof google !== "undefined" && google.accounts) initGIS();
  else setTimeout(waitForGis, 200);
}

function initGIS() {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
  });
  google.accounts.id.renderButton(
    document.getElementById("google-login-btn"),
    { theme:"filled_black", size:"large", shape:"pill", text:"signin_with", width:200 }
  );
}

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

  // Cargamos caché local inmediatamente
  const cached = lsGetVotes(currentUser.sub);
  if (Object.keys(cached).length > 0) {
    userVotes = cached;
    userVotesReady = true;
  } else {
    userVotesReady = false;
  }

  updateAuthUI(true);
  refreshCardStates();
  refreshModalButtons();
  document.getElementById("stat-hint")?.classList.add("hidden");
  showToast(`👋 ¡Bienvenido, ${currentUser.name}!`);
  loadUserVotesFromServer();
}

function logout() {
  if (typeof google !== "undefined") google.accounts.id.disableAutoSelect();
  currentUser = null; userVotes = {}; votingLocked.clear(); userVotesReady = false;
  updateAuthUI(false);
  refreshCardStates();
  refreshModalButtons();
  document.getElementById("stat-hint")?.classList.remove("hidden");
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

// ── Votos agregados (público) ──────────────────────────────────
async function fetchAggregateVotes() {
  const targetUrl = `${APPS_SCRIPT_URL}?action=getVotes`;
  const urls = [
    PROXY_GET + encodeURIComponent(targetUrl),
    targetUrl,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers:{Accept:"application/json"}, signal:AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = JSON.parse(await res.text());
      if (data.error) throw new Error(data.error);
      console.log("[Distopia2] Votos agregados:", data);
      return data;
    } catch (e) { console.warn("[Distopia2] GET votos:", e.message); }
  }
  return {};
}

// ── Votos del usuario ──────────────────────────────────────────
async function loadUserVotesFromServer() {
  if (!currentUser) return;
  try {
    const params = new URLSearchParams({ action:"getUserVotes", sub:currentUser.sub });
    const targetUrl = `${APPS_SCRIPT_URL}?${params}`;
    const res = await fetch(PROXY_GET + encodeURIComponent(targetUrl), {
      headers: { Accept:"application/json" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = JSON.parse(await res.text());
    if (data.error) throw new Error(data.error);
    userVotes = data;
    lsSaveVotes(currentUser.sub, data);
    console.log("[Distopia2] Votos usuario sincronizados:", data);
  } catch (e) {
    console.warn("[Distopia2] getUserVotes (usando caché):", e.message);
  } finally {
    userVotesReady = true;
    refreshCardStates();
    refreshModalButtons();
  }
}

// ══════════════════════════════════════════════════════════════
//  RENDER — Horizontal sliders
// ══════════════════════════════════════════════════════════════
function renderAll() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  modData.sections.forEach(s => app.appendChild(buildSection(s)));
}

function buildSection(section) {
  const block = document.createElement("div");
  block.className = "section-block";

  // Glow divider
  const divider = document.createElement("div");
  divider.className = "section-glow-divider";
  block.appendChild(divider);

  // Section header with counter
  const head = document.createElement("div"); head.className = "section-head";
  const labelWrap = document.createElement("div"); labelWrap.className = "section-label-wrap";
  const label = document.createElement("h2"); label.className = "section-label"; label.textContent = section.name;
  const tag = document.createElement("span"); tag.className = "section-tag";
  tag.textContent = `${section.mods.length} ${section.mods.length !== 1 ? "mods" : "mod"}`;
  labelWrap.appendChild(label); labelWrap.appendChild(tag);

  const counter = document.createElement("span");
  counter.className = "section-counter";
  counter.textContent = `01 / ${String(section.mods.length).padStart(2,"0")}`;

  head.appendChild(labelWrap); head.appendChild(counter);
  block.appendChild(head);

  // Slider viewport
  const viewport = document.createElement("div"); viewport.className = "slider-viewport";

  // Nav buttons
  const prevBtn = document.createElement("button"); prevBtn.className = "slider-nav prev"; prevBtn.innerHTML = "‹"; prevBtn.setAttribute("aria-label","Anterior");
  const nextBtn = document.createElement("button"); nextBtn.className = "slider-nav next"; nextBtn.innerHTML = "›"; nextBtn.setAttribute("aria-label","Siguiente");
  viewport.appendChild(prevBtn);

  // Track
  const track = document.createElement("div"); track.className = "slider-track";
  section.mods.forEach(mod => track.appendChild(buildCard(mod)));
  viewport.appendChild(track);
  viewport.appendChild(nextBtn);
  block.appendChild(viewport);

  // Dots
  const dotsWrap = document.createElement("div"); dotsWrap.className = "slider-dots";
  section.mods.forEach((_, i) => {
    const dot = document.createElement("button"); dot.className = `sdot${i===0?" active":""}`;
    dot.setAttribute("aria-label", `Mod ${i+1}`);
    dotsWrap.appendChild(dot);
  });
  block.appendChild(dotsWrap);

  // Slider logic
  let currentIdx = 0;
  const CARD_W = () => {
    const c = track.querySelector(".mod-card");
    if (!c) return 290;
    return c.offsetWidth + parseInt(getComputedStyle(track).gap || "20");
  };

  function scrollTo(idx) {
    const n = section.mods.length;
    currentIdx = Math.max(0, Math.min(idx, n - 1));
    track.scrollTo({ left: currentIdx * CARD_W(), behavior: "smooth" });
    counter.textContent = `${String(currentIdx+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`;
    dotsWrap.querySelectorAll(".sdot").forEach((d,i) => d.classList.toggle("active", i === currentIdx));
    prevBtn.disabled = currentIdx === 0;
    nextBtn.disabled = currentIdx === n - 1;
  }

  prevBtn.addEventListener("click", () => scrollTo(currentIdx - 1));
  nextBtn.addEventListener("click", () => scrollTo(currentIdx + 1));
  dotsWrap.querySelectorAll(".sdot").forEach((d,i) => d.addEventListener("click", () => scrollTo(i)));

  // Sync dots on native scroll
  track.addEventListener("scroll", () => {
    const w = CARD_W(); if (!w) return;
    const idx = Math.round(track.scrollLeft / w);
    if (idx !== currentIdx) {
      currentIdx = idx;
      counter.textContent = `${String(idx+1).padStart(2,"0")} / ${String(section.mods.length).padStart(2,"0")}`;
      dotsWrap.querySelectorAll(".sdot").forEach((d,i) => d.classList.toggle("active", i === idx));
    }
  }, { passive:true });

  scrollTo(0);
  return block;
}

// ── Mod Card ────────────────────────────────────────────────────
function buildCard(mod) {
  const score = localVotes[mod.id] ?? 0;
  const myVote = userVotes[mod.id] ?? 0;
  const card = document.createElement("article");
  card.className = "mod-card";
  card.id = `card-${mod.id}`;
  if (myVote === 1)  card.classList.add("voted-up");
  if (myVote === -1) card.classList.add("voted-down");

  // Thumbnail
  if (mod.images?.length > 0) {
    const thumb = document.createElement("div");
    thumb.className = "mod-thumb";
    thumb.setAttribute("role","button"); thumb.setAttribute("tabindex","0");
    thumb.setAttribute("aria-label", `Ver detalle de ${mod.name}`);
    const img = document.createElement("img");
    img.src = mod.images[0]; img.alt = mod.name;
    img.className = "mod-thumb-img"; img.loading = "lazy"; img.decoding = "async";
    img.onerror = () => { img.src = `https://placehold.co/800x450/050310/56406a?text=${encodeURIComponent(mod.name)}`; };
    thumb.appendChild(img);
    const hover = document.createElement("div"); hover.className = "thumb-hover";
    hover.innerHTML = `<span class="thumb-label">Ver detalle</span>`;
    thumb.appendChild(hover);
    if (mod.images.length > 1) {
      const cnt = document.createElement("span"); cnt.className = "thumb-count";
      cnt.textContent = `${mod.images.length} imágenes`; thumb.appendChild(cnt);
    }
    thumb.addEventListener("click", () => openModal(mod));
    thumb.addEventListener("keydown", e => { if (e.key==="Enter"||e.key===" ") openModal(mod); });
    card.appendChild(thumb);
  }

  // Body
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

  // Vote row
  const voteRow = document.createElement("div"); voteRow.className = "vote-row";
  const scorePill = document.createElement("div"); scorePill.className = "score-pill";
  scorePill.innerHTML = `<span class="score-val ${scoreClass(score)}" id="score-${mod.id}">${score}</span><span class="score-lbl">pts</span>`;
  const group = document.createElement("div"); group.className = "vote-group";
  group.appendChild(buildCardBtn(mod.id, 1, myVote));
  group.appendChild(buildCardBtn(mod.id, -1, myVote));
  voteRow.appendChild(scorePill); voteRow.appendChild(group);
  body.appendChild(voteRow);
  card.appendChild(body);

  // Unvoted badge
  const badge = document.createElement("div");
  badge.className = `unvoted-badge${(currentUser && userVotesReady && myVote === 0) ? "" : " hidden"}`;
  badge.id = `badge-${mod.id}`;
  badge.innerHTML = `<span class="unvoted-bang">!!</span><span class="unvoted-text">Vota este mod</span>`;
  card.appendChild(badge);

  return card;
}

function buildCardBtn(modId, dir, myVote) {
  const btn = document.createElement("button");
  btn.id = dir === 1 ? `up-${modId}` : `dn-${modId}`;
  btn.setAttribute("aria-label", dir === 1 ? "Votar positivo" : "Votar negativo");
  const upSVG   = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  const dnSVG   = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const lockSVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

  if (!currentUser) {
    btn.className = "vote-btn-card locked"; btn.innerHTML = lockSVG;
    btn.title = "Inicia sesión para votar";
    btn.onclick = e => { e.stopPropagation(); showToast("🔐 Inicia sesión para votar"); };
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

    // Badge
    const badge = document.getElementById(`badge-${mod.id}`);
    const showBadge = currentUser && userVotesReady && myVote === 0;
    if (badge) badge.classList.toggle("hidden", !showBadge);

    // Card tint classes
    const card = document.getElementById(`card-${mod.id}`);
    if (card) {
      card.classList.toggle("voted-up",   currentUser && myVote === 1);
      card.classList.toggle("voted-down", currentUser && myVote === -1);
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
        btn.onclick = e => { e.stopPropagation(); showToast("🔐 Inicia sesión para votar"); };
      });
    }
  }));
}

// ══════════════════════════════════════════════════════════════
//  LÓGICA DE VOTO
// ══════════════════════════════════════════════════════════════
async function handleVote(modId, direction) {
  if (!currentUser)    { showToast("🔐 Inicia sesión para votar"); return; }
  if (!userVotesReady) { showToast("⏳ Cargando tus votos, un momento..."); return; }
  if (votingLocked.has(modId)) { showToast("⏱️ Voto en cooldown, espera un momento"); return; }
  votingLocked.add(modId);

  const current = userVotes[modId] ?? 0;
  let delta, newMyVote;

  if (current === direction) {
    delta = -direction; newMyVote = 0; delete userVotes[modId];
    showToast("↩️ Voto retirado");
  } else if (current === 0) {
    delta = direction; newMyVote = direction; userVotes[modId] = direction;
    showToast(direction===1 ? "✅ Voto positivo registrado" : "👎 Voto negativo registrado");
  } else {
    delta = direction - current; newMyVote = direction; userVotes[modId] = direction;
    showToast(direction===1 ? "✅ Cambiado a positivo" : "👎 Cambiado a negativo");
  }

  localVotes[modId] = (localVotes[modId] ?? 0) + delta;
  const newScore = localVotes[modId];

  // UI optimista — score
  const scoreEl = document.getElementById(`score-${modId}`);
  if (scoreEl) {
    scoreEl.textContent = newScore;
    scoreEl.className = `score-val ${scoreClass(newScore)} bump`;
    setTimeout(() => scoreEl.classList.remove("bump"), 320);
  }

  // UI — botones
  const upBtn = document.getElementById(`up-${modId}`);
  const dnBtn = document.getElementById(`dn-${modId}`);
  upBtn?.classList.toggle("active", newMyVote === 1);
  dnBtn?.classList.toggle("active", newMyVote === -1);

  // Card tint + shake
  const card = document.getElementById(`card-${modId}`);
  if (card) {
    card.classList.remove("voted-up","voted-down","shake");
    if (newMyVote === 1)  card.classList.add("voted-up");
    if (newMyVote === -1) card.classList.add("voted-down");
    // Screen shake — micro frame delay to trigger animation restart
    requestAnimationFrame(() => {
      card.classList.add("shake");
      setTimeout(() => card.classList.remove("shake"), 400);
    });
  }

  // Badge particles
  const badge = document.getElementById(`badge-${modId}`);
  if (badge && newMyVote !== 0 && !badge.classList.contains("hidden")) {
    particleDisintegrate(badge);
  } else if (badge && newMyVote === 0) {
    badge.classList.remove("hidden","hiding");
  }

  // localStorage
  lsSaveVotes(currentUser.sub, userVotes);

  // Modal sync
  refreshModalScore(modId);
  refreshModalButtons();
  updateStatsBar();

  // POST al servidor
  try {
    const postBody = JSON.stringify({
      id: modId, vote: newMyVote,
      token: currentUser.token, sub: currentUser.sub, email: currentUser.email
    });
    console.log("[Distopia2] POST:", { modId, vote: newMyVote });
    const res = await fetch(PROXY_POST + encodeURIComponent(APPS_SCRIPT_URL), {
      method: "POST", headers: { "Content-Type":"text/plain" }, body: postBody,
    });
    console.log("[Distopia2] POST respuesta:", await res.text());
  } catch (e) { console.warn("[Distopia2] POST error:", e.message); }

  setTimeout(() => votingLocked.delete(modId), 1500);
}

// ══════════════════════════════════════════════════════════════
//  PARTÍCULAS — Desintegración del badge
// ══════════════════════════════════════════════════════════════
function particleDisintegrate(badge) {
  const rect = badge.getBoundingClientRect();
  const PARTICLE_COUNT = 24;

  badge.style.transition = "opacity 0.15s ease, transform 0.15s ease";
  badge.style.opacity = "0";
  badge.style.transform = "scale(0.65)";

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("div");
    p.className = "vote-particle";
    const startX = rect.left + Math.random() * rect.width;
    const startY = rect.top  + Math.random() * rect.height;
    const angle  = (Math.PI*2*i/PARTICLE_COUNT) + (Math.random()-0.5)*0.9;
    const dist   = 30 + Math.random() * 75;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist - (18+Math.random()*22);
    const size     = 1.8 + Math.random()*3.5;
    const hue      = 18  + Math.random()*42;
    const duration = 0.42 + Math.random()*0.38;
    const delay    = Math.random()*0.1;

    p.style.cssText = [
      `position:fixed`,
      `left:${startX}px`,`top:${startY}px`,
      `width:${size}px`, `height:${size}px`,
      `border-radius:50%`,
      `background:hsl(${hue},100%,62%)`,
      `box-shadow:0 0 ${size*2.5}px hsl(${hue},100%,62%)`,
      `pointer-events:none`,`z-index:9999`,
      `--dx:${dx}px`,`--dy:${dy}px`,
      `animation:particleFly ${duration}s ${delay}s ease-out forwards`
    ].join(";");

    document.body.appendChild(p);
    setTimeout(() => p.remove(), (duration+delay)*1000+60);
  }

  setTimeout(() => {
    badge.classList.add("hidden");
    badge.style.opacity = "";
    badge.style.transform = "";
    badge.style.transition = "";
  }, 280);
}

// ══════════════════════════════════════════════════════════════
//  MODAL — Split layout (desktop) / Bottom sheet (mobile)
// ══════════════════════════════════════════════════════════════
let currentModalMod = null, carouselIdx = 0, touchStartX = 0;

function initModal() {
  const overlay  = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  const prevBtn  = document.getElementById("carousel-prev");
  const nextBtn  = document.getElementById("carousel-next");
  const track    = document.getElementById("modal-carousel-track");
  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target===overlay) closeModal(); });
  document.addEventListener("keydown", e => {
    if (!overlay || overlay.hidden) return;
    if (e.key==="Escape") closeModal();
    if (e.key==="ArrowLeft")  carouselGo(carouselIdx-1);
    if (e.key==="ArrowRight") carouselGo(carouselIdx+1);
  });
  prevBtn?.addEventListener("click", () => carouselGo(carouselIdx-1));
  nextBtn?.addEventListener("click", () => carouselGo(carouselIdx+1));
  track?.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive:true });
  track?.addEventListener("touchend", e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx)>40) carouselGo(carouselIdx+(dx>0?1:-1));
  });

  // Desktop buttons
  document.getElementById("modal-upvote-btn")?.addEventListener("click",   () => { if (currentModalMod) handleVote(currentModalMod.id, 1); });
  document.getElementById("modal-downvote-btn")?.addEventListener("click", () => { if (currentModalMod) handleVote(currentModalMod.id, -1); });

  // Mobile sticky bar buttons
  document.getElementById("modal-upvote-btn-m")?.addEventListener("click",   () => { if (currentModalMod) handleVote(currentModalMod.id, 1); });
  document.getElementById("modal-downvote-btn-m")?.addEventListener("click", () => { if (currentModalMod) handleVote(currentModalMod.id, -1); });
}

function openModal(mod) {
  currentModalMod = mod; carouselIdx = 0;
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;

  document.getElementById("modal-mod-name").textContent = mod.name;
  document.getElementById("modal-description").innerHTML =
    (mod.paragraphs||[]).map(p=>`<p>${escapeHtml(p)}</p>`).join("");

  // Bento grid (desktop)
  buildBentoGrid(mod);

  // Carousel (mobile fallback)
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
  const images = mod.images || [];
  const count  = Math.min(images.length, 4);
  bento.className = `bento-grid count-${count || 1}`;

  (count > 0 ? images.slice(0,count) : ["placeholder"]).forEach((src, i) => {
    const item = document.createElement("div"); item.className = "bento-item";
    const img  = document.createElement("img");
    img.src = src === "placeholder"
      ? `https://placehold.co/800x450/050310/56406a?text=${encodeURIComponent(mod.name)}`
      : src;
    img.alt = `${mod.name} — imagen ${i+1}`;
    img.loading = "lazy";
    img.onerror = () => { img.src = `https://placehold.co/800x450/050310/56406a?text=Sin+imagen`; };
    item.appendChild(img);
    bento.appendChild(item);
  });
}

function buildCarousel(mod) {
  const track   = document.getElementById("modal-carousel-track");
  const dots    = document.getElementById("carousel-dots");
  const counter = document.getElementById("carousel-counter");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  if (!track) return;

  track.innerHTML = ""; if (dots) dots.innerHTML = "";
  (mod.images||[]).forEach((src,i) => {
    const slide = document.createElement("div"); slide.className = "gallery-slide";
    const img   = document.createElement("img");
    img.src = src; img.alt = `${mod.name} ${i+1}`; img.loading="lazy";
    img.onerror = () => { img.src = `https://placehold.co/800x450/050310/56406a?text=Sin+imagen`; };
    slide.appendChild(img); track.appendChild(slide);
    if (dots && (mod.images||[]).length > 1) {
      const dot = document.createElement("button");
      dot.className = `gallery-dot${i===0?" active":""}`;
      dot.setAttribute("aria-label",`Imagen ${i+1}`);
      dot.addEventListener("click", () => carouselGo(i));
      dots.appendChild(dot);
    }
  });

  const multi = (mod.images||[]).length > 1;
  if (prevBtn) prevBtn.hidden = !multi;
  if (nextBtn) nextBtn.hidden = !multi;
  if (!multi && dots) dots.innerHTML = "";
  if (counter) counter.textContent = multi ? `1 / ${mod.images.length}` : "";
}

function closeModal() {
  document.getElementById("modal-overlay")?.setAttribute("hidden","");
  document.body.style.overflow = "";
  currentModalMod = null;
}

function carouselGo(idx) {
  const imgs = currentModalMod?.images || [];
  if (imgs.length <= 1) return;
  carouselIdx = ((idx%imgs.length)+imgs.length)%imgs.length;
  const track = document.getElementById("modal-carousel-track");
  if (track) track.style.transform = `translateX(-${carouselIdx*100}%)`;
  const counter = document.getElementById("carousel-counter");
  if (counter) counter.textContent = `${carouselIdx+1} / ${imgs.length}`;
  document.getElementById("carousel-dots")?.querySelectorAll(".gallery-dot")
    .forEach((d,i) => d.classList.toggle("active", i===carouselIdx));
}

function refreshModalScore(modId) {
  if (!currentModalMod || currentModalMod.id !== modId) return;
  const score = localVotes[modId] ?? 0;
  const cls = score > 0 ? " pos" : score < 0 ? " neg" : "";
  // Desktop
  const el = document.getElementById("modal-vote-score");
  if (el) { el.textContent = score; el.className = `modal-score-number${cls}`; }
  // Mobile
  const elm = document.getElementById("modal-vote-score-m");
  if (elm) elm.textContent = score;
}

function refreshModalButtons() {
  if (!currentModalMod) return;
  const myVote = userVotes[currentModalMod.id] ?? 0;
  // Desktop
  const upBtn = document.getElementById("modal-upvote-btn");
  const dnBtn = document.getElementById("modal-downvote-btn");
  // Mobile
  const upBtnM = document.getElementById("modal-upvote-btn-m");
  const dnBtnM = document.getElementById("modal-downvote-btn-m");

  [upBtn, upBtnM].forEach(b => { if (!b) return; b.disabled = !currentUser; b.classList.toggle("active", myVote===1); });
  [dnBtn, dnBtnM].forEach(b => { if (!b) return; b.disabled = !currentUser; b.classList.toggle("active", myVote===-1); });
}

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════
function scoreClass(s) { return s>0 ? "pos" : s<0 ? "neg" : ""; }

function updateStatsBar() {
  if (!modData) return;
  const totalMods  = modData.sections.reduce((a,s) => a+s.mods.length, 0);
  const totalVotes = Object.values(localVotes).reduce((a,v) => a+Math.abs(v), 0);
  // Hidden bar (JS compat)
  const sm = document.getElementById("stat-mods");
  const sv = document.getElementById("stat-votes");
  const ss = document.getElementById("stat-sections");
  if (sm) sm.innerHTML = `📦 <strong>${totalMods}</strong> mods`;
  if (sv) sv.innerHTML = `🗳 <strong>${totalVotes}</strong> votos`;
  if (ss) ss.innerHTML = `📂 <strong>${modData.sections.length}</strong> secciones`;
  // Visible header stats
  const smv = document.getElementById("stat-mods-val");
  const svv = document.getElementById("stat-votes-val");
  const ssv = document.getElementById("stat-sections-val");
  if (smv) smv.textContent = totalMods;
  if (svv) svv.textContent = totalVotes;
  if (ssv) ssv.textContent = modData.sections.length;
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
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

// ── Arranque ──────────────────────────────────────────────────
init();
