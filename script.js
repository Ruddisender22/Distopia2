/* ================================================================
   DISTOPIA 2 — script.js v9
   Critical fix: Auth modal GIS lazy-render + auto-close on login
   · Dark vibrant aurora background (high saturation blobs)
   · Auth modal: NEVER auto-opens, lazy GIS render, auto-close
   · Sliders: ghost-dot fix, thumbnail nav, counter
   · Vote: stamp press + neon particles + localStorage + server
   ================================================================ */

// ─── CONFIG ────────────────────────────────────────────────────

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz2RtSxsb_HwurxvKLSXaz2wLin50Wf2Wx2L8y2FIl7r-mMdTh1rklIER9mnTb-Y0I/exec";
const PROXY_POST = "https://corsproxy.io/?";
const PROXY_GET  = "https://corsproxy.io/?";

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
//  FIRE SPARKS BACKGROUND
// ══════════════════════════════════════════════════════════════
function initBlobBg() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W = 0, H = 0;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener("resize", resize); resize();

  const sparks = [];
  const numSparks = 85;

  for (let i = 0; i < numSparks; i++) {
    sparks.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(Math.random() * 1.5 + 0.5), // Float upwards
      radius: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      fadeRate: Math.random() * 0.008 + 0.002,
      hue: Math.random() < 0.5 ? 35 : (Math.random() < 0.5 ? 15 : 55), // Red, Orange, Yellow
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.03 + 0.01
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    sparks.forEach(s => {
      // Gentle horizontal sway + vertical rise
      s.x += s.vx + Math.sin(s.swayOffset) * 0.4;
      s.swayOffset += s.swaySpeed;
      s.y += s.vy;
      s.alpha -= s.fadeRate;

      // Reset spark when it fades out or goes above screen
      if (s.alpha <= 0 || s.y < -10) {
        s.y = H + 10;
        s.x = Math.random() * W;
        s.alpha = Math.random() * 0.8 + 0.2;
        s.radius = Math.random() * 2.5 + 0.5;
        s.vx = (Math.random() - 0.5) * 1.2;
        s.vy = -(Math.random() * 1.5 + 0.5);
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 100%, 65%, ${s.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}


// ══════════════════════════════════════════════════════════════
//  CUSTOM AUTHENTICATION
// ══════════════════════════════════════════════════════════════
function loadSession() {
  const sessionData = localStorage.getItem("distopia2_session");
  if (sessionData) {
    try {
      currentUser = JSON.parse(sessionData);
      
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
      
      loadUserVotesFromServer();
    } catch (e) {
      logout();
    }
  }
}

async function handleCustomAuth(email) {
  try {
    console.log(`[Distopia2 Auth] Identificando con correo: ${email}`);
    
    // Simplemente usamos el email como 'sub' para identificar de forma única
    currentUser = {
      sub: email.toLowerCase(),
      email: email.toLowerCase(),
      name: email.split('@')[0],
      picture: ""
    };
    
    localStorage.setItem("distopia2_session", JSON.stringify(currentUser));
    
    const cached = lsGetVotes(currentUser.sub);
    if (Object.keys(cached).length > 0) {
      userVotes = cached;
      userVotesReady = true;
    } else {
      userVotesReady = false;
    }

    closeAuthModal();
    updateAuthUI(true);
    refreshCardStates();
    refreshModalButtons();
    showToast(`👋 ¡Bienvenido, ${currentUser.name}!`);
    
    loadUserVotesFromServer();
    return true;
  } catch (err) {
    showToast("⚠️ Error de autenticación local");
    console.error(err);
    return false;
  }
}

function logout() {
  localStorage.removeItem("distopia2_session");
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
    if (avatarEl) { avatarEl.src = "Recursos/Icon.png"; avatarEl.alt = currentUser.name; }
  } else {
    wrapperEl?.removeAttribute("hidden");
    chipEl?.setAttribute("hidden","");
  }
}

// ══════════════════════════════════════════════════════════════
//  AUTH MODAL
// ══════════════════════════════════════════════════════════════
let authModalCloseTimer = null;

function openAuthModal() {
  const overlay = document.getElementById("auth-modal-overlay");
  if (!overlay) return;

  overlay.classList.remove("closing");
  const sheet = document.getElementById("auth-modal-panel");
  sheet?.classList.remove("auth-modal-closing");

  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  
  const authEmail = document.getElementById("auth-email");
  if (authEmail) authEmail.value = "";
}

function closeAuthModal() {
  const overlay = document.getElementById("auth-modal-overlay");
  const sheet   = document.getElementById("auth-modal-panel");
  if (!overlay || overlay.hidden) return;

  overlay.classList.add("closing");
  sheet?.classList.add("auth-modal-closing");

  clearTimeout(authModalCloseTimer);
  authModalCloseTimer = setTimeout(() => {
    overlay.setAttribute("hidden","");
    overlay.classList.remove("closing");
    sheet?.classList.remove("auth-modal-closing");
    document.body.style.overflow = "";
  }, 260);
}

function initAuthModal() {
  const overlay  = document.getElementById("auth-modal-overlay");
  const closeBtn = document.getElementById("auth-modal-close");
  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener("click", closeAuthModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeAuthModal(); });
  document.addEventListener("keydown", e => {
    if (overlay && !overlay.hidden && !overlay.classList.contains("closing") && e.key==="Escape") closeAuthModal();
  });

  const submitBtn = document.getElementById("custom-auth-submit");
  const form = document.getElementById("custom-auth-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("auth-email").value.trim();
      if (!email) return;
      
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Cargando...";
      
      await handleCustomAuth(email);
      
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  }
}

// ══════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════
async function init() {
  initBlobBg();
  document.getElementById("logout-btn")?.addEventListener("click", logout);
  document.getElementById("login-wrapper")?.addEventListener("click", openAuthModal);
  initAuthModal();

  loadSession();

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
    startVotePolling();
  } catch (err) {
    console.error("[Distopia2]", err);
    hideLoading();
    showErrorState(err);
  }
}

// ══════════════════════════════════════════════════════════════
//  NAVIGATION — Tab switching
// ══════════════════════════════════════════════════════════════
function switchTab(tab) {
  const votPage = document.getElementById('app');
  const srvPage = document.getElementById('servidor-page');
  const votTab  = document.getElementById('tab-votaciones');
  const srvTab  = document.getElementById('tab-servidor');
  const title   = document.querySelector('.header-title');

  if (tab === 'votaciones') {
    votPage?.removeAttribute('hidden');
    srvPage?.setAttribute('hidden','');
    votTab?.classList.add('active');
    srvTab?.classList.remove('active');
    if (title) title.textContent = 'Votaciones';
  } else {
    votPage?.setAttribute('hidden','');
    srvPage?.removeAttribute('hidden');
    votTab?.classList.remove('active');
    srvTab?.classList.add('active');
    if (title) title.textContent = 'El Servidor';
  }
}

// ── Aggregate votes ─────────────────────────────────────────────
async function fetchAggregateVotes() {
  const targetUrl = `${APPS_SCRIPT_URL}?action=getVotes&t=${Date.now()}`;
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
    const params = new URLSearchParams({ action:"getUserVotes", sub:currentUser.sub, t:Date.now() });
    const res = await fetch(PROXY_GET + encodeURIComponent(`${APPS_SCRIPT_URL}?${params}`), {
      headers:{Accept:"application/json"}, signal:AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = JSON.parse(await res.text());
    if (data.error) throw new Error(data.error);
    // IMPORTANT: Actualizamos los votos locales con los del servidor
    userVotes = data;
    lsSaveVotes(currentUser.sub, userVotes);
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
  const sectionsContainer = document.getElementById("sections-container");
  if (!sectionsContainer) return;
  sectionsContainer.innerHTML = "";
  
  const controlsBar = document.getElementById("controls-bar");
  if (controlsBar) controlsBar.hidden = false;

  modData.sections.forEach(s => {
    s.mods.sort((a, b) => {
      const aSel = a.status === "SELECCIÓN DEL AUTOR";
      const bSel = b.status === "SELECCIÓN DEL AUTOR";
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;

      const aElim = a.status === "ELIMINADO";
      const bElim = b.status === "ELIMINADO";
      if (aElim && !bElim) return 1;
      if (!aElim && bElim) return -1;
      return 0;
    });
    sectionsContainer.appendChild(buildSection(s));
  });
}

function buildSection(section) {
  const block = document.createElement("div"); block.className = "section-block";

  const rule = document.createElement("div"); rule.className = "section-rule";
  block.appendChild(rule);

  // Section header with icon and aggregate score
  const head = document.createElement("div"); head.className = "section-head";
  const labelWrap = document.createElement("div"); labelWrap.className = "section-label-wrap";
  if (section.icon) {
    const iconEl = document.createElement("span"); iconEl.className = "section-icon"; iconEl.textContent = section.icon;
    labelWrap.appendChild(iconEl);
  }
  const label = document.createElement("h2"); label.className = "section-label"; label.textContent = section.name;
  const tag = document.createElement("span"); tag.className = "section-tag";
  tag.textContent = `${section.mods.length} ${section.mods.length!==1?"mods":"mod"}`;
  labelWrap.appendChild(label); labelWrap.appendChild(tag);

  const right = document.createElement("div"); right.className = "section-right";
  let sectionUp = 0, sectionDown = 0;
    section.mods.forEach(m => {
      const sv = localVotes[m.id] || {up:0, down:0};
      if (typeof sv === 'object') {
        sectionUp += sv.up || 0; sectionDown += sv.down || 0;
      } else if (typeof sv === 'number') {
        if (sv > 0) sectionUp += sv;
        else if (sv < 0) sectionDown += Math.abs(sv);
      }
    });

  const scoreChip = document.createElement("div"); scoreChip.className = "section-score-chip";
  scoreChip.id = `section-score-${section.name.replace(/\s+/g, '-')}`;
  scoreChip.innerHTML = `
      <span class="sscore-up">+${sectionUp}</span>
      <span class="sscore-down">-${sectionDown}</span>
  `;
  const counter = document.createElement("span"); counter.className = "section-counter";
  counter.textContent = `01 / ${String(section.mods.length).padStart(2,"0")}`;
  right.appendChild(scoreChip); right.appendChild(counter);

  head.appendChild(labelWrap); head.appendChild(right);
  block.appendChild(head);

  // Slider
  const viewport = document.createElement("div"); viewport.className = "slider-viewport";
  const prevBtn = document.createElement("button"); prevBtn.className = "slider-nav prev"; prevBtn.innerHTML = "‹"; prevBtn.setAttribute("aria-label","Anterior");
  const nextBtn = document.createElement("button"); nextBtn.className = "slider-nav next"; nextBtn.innerHTML = "›"; nextBtn.setAttribute("aria-label","Siguiente");
  viewport.appendChild(prevBtn);
  const track = document.createElement("div"); track.className = "slider-track";
  section.mods.forEach(mod => track.appendChild(buildCard(mod, section.name)));
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


  function scrollTo(idx) {
    const n = section.mods.length;
    let targetIdx = Math.max(0, Math.min(idx, n-1));
    track.scrollTo({ left: targetIdx * cardWidth(), behavior:"smooth" });
  }

  function updateCarouselUI() {
    const w = cardWidth(); if (!w) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const isAtEnd = track.scrollLeft >= maxScroll - 5;
    
    let idx = Math.round(track.scrollLeft / w);
    if (isAtEnd) idx = section.mods.length - 1;

    if (idx !== currentIdx) {
      currentIdx = idx;
      counter.textContent = `${String(idx+1).padStart(2,"0")} / ${String(section.mods.length).padStart(2,"0")}`;
      dotsWrap.querySelectorAll(".sdot").forEach((d,i) => d.classList.toggle("active", i===idx));
    }
    prevBtn.disabled = track.scrollLeft <= 5;
    nextBtn.disabled = isAtEnd;
  }

  prevBtn.addEventListener("click", () => {
    let targetIdx = Math.ceil(track.scrollLeft / cardWidth()) - 1;
    scrollTo(targetIdx);
  });
  nextBtn.addEventListener("click", () => {
    let targetIdx = Math.floor(track.scrollLeft / cardWidth()) + 1;
    scrollTo(targetIdx);
  });
  dotsWrap.querySelectorAll(".sdot").forEach((d,i) => d.addEventListener("click", () => scrollTo(i)));

  track.addEventListener("scroll", updateCarouselUI, { passive:true });
  // Initialize UI state
  setTimeout(updateCarouselUI, 50);

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



// ── Polling & Secciones ─────────────────────────────────────────

function updateSectionHeaders() {
  if (!modData || !modData.sections) return;
  modData.sections.forEach(section => {
    const chip = document.getElementById(`section-score-${section.name.replace(/\s+/g, '-')}`);
    if (!chip) return;
    let sectionUp = 0, sectionDown = 0;
    section.mods.forEach(m => {
      const sv = localVotes[m.id] || {up:0, down:0};
      if (typeof sv === 'object') {
        sectionUp += sv.up || 0; sectionDown += sv.down || 0;
      } else if (typeof sv === 'number') {
        if (sv > 0) sectionUp += sv;
        else if (sv < 0) sectionDown += Math.abs(sv);
      }
    });
    chip.innerHTML = `
      <span class="sscore-up">+${sectionUp}</span>
      <span class="sscore-down">-${sectionDown}</span>
    `;
  });
}

function startVotePolling() {
  setInterval(async () => {
    try {
      const newVotes = await fetchAggregateVotes();
      if (Object.keys(newVotes).length > 0) {
        let changed = false;
        for (const [modId, scoreObj] of Object.entries(newVotes)) {
          if (typeof scoreObj !== 'object') continue;
          
          const old = localVotes[modId] || {up:0, down:0};
          const oldUp = typeof old === 'object' ? (old.up||0) : (old>0?old:0);
          const oldDown = typeof old === 'object' ? (old.down||0) : (old<0?Math.abs(old):0);
          
          if (oldUp !== scoreObj.up || oldDown !== scoreObj.down) {
            changed = true;
            localVotes[modId] = scoreObj;
            
            const upEl = document.getElementById(`score-up-${modId}`);
            const dnEl = document.getElementById(`score-down-${modId}`);
              if (upEl && parseInt(upEl.textContent) !== scoreObj.up) {
                upEl.textContent = scoreObj.up; upEl.classList.add("bump"); setTimeout(()=>upEl.classList.remove("bump"), 320);
              }
              if (dnEl && parseInt(dnEl.textContent) !== scoreObj.down) {
                dnEl.textContent = scoreObj.down; dnEl.classList.add("bump"); setTimeout(()=>dnEl.classList.remove("bump"), 320);
              }
            refreshModalScore(modId);
          }
        }
        if (changed) {
          updateStatsBar();
          updateSectionHeaders();
        }
      }
    } catch (e) {
      console.warn("[Distopia2] Polling error:", e);
    }
  }, 30000); // 30 seconds polling
}

// ── Mod Card ────────────────────────────────────────────────────
function buildCard(mod, sectionName = "") {
  const scoreObj = localVotes[mod.id] || {up:0, down:0};
  const upvotes = typeof scoreObj === 'object' ? (scoreObj.up || 0) : (scoreObj > 0 ? scoreObj : 0);
  const downvotes = typeof scoreObj === 'object' ? (scoreObj.down || 0) : (scoreObj < 0 ? Math.abs(scoreObj) : 0);
  const myVote = userVotes[mod.id] ?? 0;
  const card = document.createElement("article");
  card.className = "mod-card"; card.id = `card-${mod.id}`;
  if (myVote === 1)  card.classList.add("voted-up");
  if (myVote === -1) card.classList.add("voted-down");
  if (mod.status === "ELIMINADO") {
    card.classList.add("is-eliminated");
    const stamp = document.createElement("div");
    stamp.className = "eliminated-stamp";
    stamp.textContent = "ELIMINADO";
    card.appendChild(stamp);
  }

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

  const baseTag = document.createElement("span");
  if (sectionName === "Resource Packs" || mod._sectionName === "Resource Packs") {
    baseTag.className = "mod-type-tag status-inline status-rp";
    baseTag.textContent = "RESOURCE PACK";
  } else {
    baseTag.className = "mod-type-tag status-inline status-mod";
    baseTag.textContent = "MOD";
  }
  
  titleRow.appendChild(nameEl);
  body.appendChild(titleRow);

  const tagsRow = document.createElement("div");
  tagsRow.className = "mod-tags-row";
  tagsRow.appendChild(baseTag);

  if (mod.status === "SELECCIÓN DEL AUTOR") {
    const selTag = document.createElement("span");
    selTag.className = "mod-type-tag status-inline status-confirmed";
    selTag.textContent = "SELECCIÓN DEL AUTOR";
    tagsRow.appendChild(selTag);
  } else if (mod.status === "EN DESARROLLO") {
    const devTag = document.createElement("span");
    devTag.className = "mod-type-tag status-inline status-pending";
    devTag.textContent = "EN DESARROLLO";
    tagsRow.appendChild(devTag);
  }

  body.appendChild(tagsRow);

  if (mod.paragraphs?.length > 0) {
    const ex = document.createElement("p"); ex.className = "mod-excerpt"; ex.textContent = mod.paragraphs[0];
    body.appendChild(ex);
  }

  const voteRow = document.createElement("div"); voteRow.className = "vote-row";
  const scoreSplit = document.createElement("div"); scoreSplit.className = "score-split";
  scoreSplit.innerHTML = `
    <div class="score-pill score-up">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
      <span class="score-val" id="score-up-${mod.id}">${upvotes}</span>
    </div>
    <div class="score-pill score-down">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      <span class="score-val" id="score-down-${mod.id}">${downvotes}</span>
    </div>
  `;
  const group = document.createElement("div"); group.className = "vote-group";
  group.appendChild(buildCardBtn(mod.id, 1, myVote));
  group.appendChild(buildCardBtn(mod.id, -1, myVote));
  voteRow.appendChild(scoreSplit); voteRow.appendChild(group);
  body.appendChild(voteRow);
  card.appendChild(body);

  const badge = document.createElement("div");
  badge.className = `unvoted-badge${(currentUser && userVotesReady && myVote===0) ? "" : " hidden"}`;
  badge.id = `badge-${mod.id}`;
  badge.innerHTML = `<span class="unvoted-bang">!!</span><span class="unvoted-text">Vota</span>`;
  card.appendChild(badge);

  // Mouse-tracking specular light (Apple glass effect)
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  });

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
  let newMyVote;
  if (current === direction) {
    newMyVote = 0; delete userVotes[modId]; showToast("↩ Voto retirado");
  } else {
    newMyVote = direction; userVotes[modId] = direction;
    showToast(direction===1 ? "✓ Voto positivo" : "✗ Voto negativo");
  }

  // Update local votes count object
  const oldVal = localVotes[modId] || {up:0, down:0};
  const val = typeof oldVal === 'object' ? oldVal : (oldVal > 0 ? {up:oldVal, down:0} : {up:0, down:Math.abs(oldVal)});
  
  if (current !== 0) { // Removing old vote from counter
    if (current === 1) val.up--; else val.down--;
  }
  if (newMyVote !== 0) { // Adding new vote to counter
    if (newMyVote === 1) val.up++; else val.down++;
  }
  localVotes[modId] = val;

  // Score UI update
  const upEl = document.getElementById(`score-up-${modId}`);
  const dnEl = document.getElementById(`score-down-${modId}`);
  if(upEl) { upEl.textContent = val.up; upEl.classList.add("bump"); setTimeout(()=>upEl.classList.remove("bump"), 320); }
  if(dnEl) { dnEl.textContent = val.down; dnEl.classList.add("bump"); setTimeout(()=>dnEl.classList.remove("bump"), 320); }
  
  refreshModalScore(modId);
  updateStatsBar();
  updateSectionHeaders();

  // Button states
  const upBtn = document.getElementById(`up-${modId}`);
  const dnBtn = document.getElementById(`dn-${modId}`);
  upBtn?.classList.toggle("active", newMyVote===1);
  dnBtn?.classList.toggle("active", newMyVote===-1);

  // Card classes
  const card = document.getElementById(`card-${modId}`);
  if (card) {
    card.classList.remove("voted-up","voted-down");
    if (newMyVote === 1)  card.classList.add("voted-up");
    if (newMyVote === -1) card.classList.add("voted-down");
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
  if (window.refreshSearchFilter) window.refreshSearchFilter();

  try {
    const body = JSON.stringify({ id:modId, vote:newMyVote, sub:currentUser.sub, email:currentUser.email });
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
  track.style.transform = "translateX(0)";
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
  const sv = localVotes[modId] || {up:0, down:0};
  const upvotes = typeof sv === 'object' ? (sv.up || 0) : (sv > 0 ? sv : 0);
  const downvotes = typeof sv === 'object' ? (sv.down || 0) : (sv < 0 ? Math.abs(sv) : 0);
  
  const modalScoreRow = document.querySelector(".modal-score-row");
  if (modalScoreRow) {
    modalScoreRow.innerHTML = `
      <div class="modal-score-card score-up">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>
        <span class="modal-score-number" id="modal-vote-score-up">${upvotes}</span>
        <span class="modal-score-label">a favor</span>
      </div>
      <div class="modal-score-card score-down">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        <span class="modal-score-number" id="modal-vote-score-down">${downvotes}</span>
        <span class="modal-score-label">en contra</span>
      </div>
    `;
  }

  const mobileScoreRow = document.querySelector(".mmv-score");
  if (mobileScoreRow) {
    mobileScoreRow.innerHTML = `
      <span class="m-score-up">+<span id="modal-vote-score-up-m">${upvotes}</span></span>
      <span class="m-score-down">-<span id="modal-vote-score-down-m">${downvotes}</span></span>
    `;
  }
}

function refreshModalButtons() {
  if(!currentModalMod) return;
  const myVote=userVotes[currentModalMod.id]??0;
  [["modal-upvote-btn",1],["modal-downvote-btn",-1],["modal-upvote-btn-m",1],["modal-downvote-btn-m",-1]].forEach(([id,dir])=>{
    const b=document.getElementById(id); if(!b) return;
    b.disabled=false; b.classList.toggle("active",myVote===dir);
  });
}

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════
function scoreClass(s){ return s>0?"pos":s<0?"neg":""; }

function updateStatsBar() {
  if(!modData) return;
  const totalMods  = modData.sections.filter(s => s.name !== "Resource Packs").reduce((a,s)=>a+s.mods.length,0);
  const totalRP    = modData.sections.find(s => s.name === "Resource Packs")?.mods.length || 0;
  
  let totalUp = 0, totalDown = 0;
  Object.values(localVotes).forEach(v => {
    if (typeof v === 'object' && v !== null) {
      totalUp += v.up || 0;
      totalDown += v.down || 0;
    } else if (typeof v === 'number') {
      if (v > 0) totalUp += v;
      else if (v < 0) totalDown += Math.abs(v);
    }
  });

  const sm=document.getElementById("stat-mods-val");   if(sm) sm.textContent=totalMods;
  const srp=document.getElementById("stat-rp-val");    if(srp) srp.textContent=totalRP;
  const sv=document.getElementById("stat-votes-val");  if(sv) sv.textContent=(totalUp + totalDown);
  const ss=document.getElementById("stat-sections-val"); if(ss) ss.textContent=modData.sections.length - 1;
  const smh=document.getElementById("stat-mods");   if(smh) smh.textContent=`${totalMods} mods`;
  const svh=document.getElementById("stat-votes");  if(svh) svh.textContent=`${totalUp + totalDown} votos`;
  const ssh=document.getElementById("stat-sections"); if(ssh) ssh.textContent=`${modData.sections.length - 1} secciones`;
}

function hideLoading() {
  const loading = document.getElementById("loading-screen");
  if (loading) {
    loading.style.opacity = "0";
    setTimeout(() => loading.remove(), 400);
  }
}
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

// ══════════════════════════════════════════════════════════════
//  SEARCH, FILTER & SORT
// ══════════════════════════════════════════════════════════════
function initSearchAndFilter() {
  const searchInput = document.getElementById("search-input");
  const filterSelect = document.getElementById("filter-select");
  const sortSelect = document.getElementById("sort-select");
  
  if (!searchInput || !filterSelect || !sortSelect) return;

  const updateView = () => {
    const query = searchInput.value.toLowerCase().trim();
    const filter = filterSelect.value;
    const sort = sortSelect.value;
    
    if (query === "" && filter === "all" && sort === "default") {
      document.getElementById("sections-container").hidden = false;
      document.getElementById("search-results-grid").hidden = true;
      return;
    }
    
    document.getElementById("sections-container").hidden = true;
    const grid = document.getElementById("search-results-grid");
    grid.hidden = false;
    grid.innerHTML = "";
    
    let allMods = [];
    modData.sections.forEach(s => {
      s.mods.forEach((m, idx) => {
        allMods.push({...m, _sectionName: s.name, _idxFromEnd: s.mods.length - idx});
      });
    });
    
    let filtered = allMods.filter(m => {
      if (query !== "") {
        const text = (m.name + " " + (m.paragraphs?m.paragraphs.join(" "):"")).toLowerCase();
        if (!text.includes(query)) return false;
      }
      
      const sv = userVotesReady ? (userVotes[m.id] || 0) : 0;
      if (filter === "unvoted") {
        if (sv !== 0) return false;
      } else if (filter === "voted-up") {
        if (sv !== 1) return false;
      } else if (filter === "voted-down") {
        if (sv !== -1) return false;
      } else if (filter === "status-deleted") {
        if (m.status !== "ELIMINADO") return false;
      }
      
      return true;
    });
    
    if (sort === "recent") {
      filtered.sort((a,b) => a._idxFromEnd - b._idxFromEnd);
    } else if (sort === "alphabetical") {
      filtered.sort((a,b) => a.name.localeCompare(b.name));
    }
    
    if (filtered.length === 0) {
      grid.innerHTML = `<div class="no-results"><p>No se han encontrado mods que coincidan con la búsqueda.</p></div>`;
      return;
    }
    
    filtered.forEach(m => {
      grid.appendChild(buildCard(m));
    });
  };

  searchInput.addEventListener("input", updateView);
  filterSelect.addEventListener("change", updateView);
  sortSelect.addEventListener("change", updateView);
  
  window.refreshSearchFilter = updateView;
}

// ══════════════════════════════════════════════════════════════
//  MOBILE SWIPE GESTURES
// ══════════════════════════════════════════════════════════════
function initSwipeGestures() {
  const modalPanel = document.getElementById("modal-panel");
  const track = document.getElementById("modal-carousel-track");
  
  if (!modalPanel || !track) return;

  // Swipe for closing modal (downward)
  let modalStartY = 0;
  let modalCurrentY = 0;
  
  modalPanel.addEventListener("touchstart", (e) => {
    // Solo si el contenido interno está arriba del todo (scrollTop === 0)
    // O si tocamos una zona no scrolleable (como el head)
    modalStartY = e.touches[0].clientY;
  }, {passive: true});

  modalPanel.addEventListener("touchmove", (e) => {
    modalCurrentY = e.touches[0].clientY;
    const diff = modalCurrentY - modalStartY;
    
    // Si hacemos scroll hacia abajo y estamos en la parte superior del panel
    if (diff > 0 && modalPanel.scrollTop <= 0) {
      modalPanel.style.transform = `translateY(${diff}px)`;
      modalPanel.style.transition = "none";
    }
  }, {passive: true});

  modalPanel.addEventListener("touchend", (e) => {
    const diff = modalCurrentY - modalStartY;
    modalPanel.style.transform = "";
    modalPanel.style.transition = "";
    
    // Umbral de 100px para cerrar
    if (diff > 100 && modalPanel.scrollTop <= 0) {
      closeModal();
    }
    modalStartY = 0;
    modalCurrentY = 0;
  });

  // Swipe for gallery (horizontal)
  let trackStartX = 0;
  let trackCurrentX = 0;
  const galleryContainer = document.querySelector(".gallery-container");
  
  if (galleryContainer) {
    galleryContainer.addEventListener("touchstart", (e) => {
      trackStartX = e.touches[0].clientX;
    }, {passive: true});
    
    galleryContainer.addEventListener("touchmove", (e) => {
      trackCurrentX = e.touches[0].clientX;
    }, {passive: true});
    
    galleryContainer.addEventListener("touchend", (e) => {
      const diffX = trackStartX - trackCurrentX;
      // Umbral de 50px para pasar imagen
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left -> Next image
          carouselGo(carouselIdx + 1);
        } else {
          // Swipe right -> Prev image
          carouselGo(carouselIdx - 1);
        }
      }
      trackStartX = 0;
      trackCurrentX = 0;
    });
  }
}

// ── Boot ──────────────────────────────────────────────────────
initSearchAndFilter();
initSwipeGestures();
init();
