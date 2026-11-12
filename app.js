(() => {
  "use strict";
  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const email = D.person.emailParts.join("@");

  /* ---------- theme ---------- */
  const root = document.documentElement;
  $("#theme-toggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    field.recolor();
  });

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- hero ---------- */
  $("#pitch").textContent = D.person.pitch;
  $("#stats").innerHTML = D.stats
    .map((s) => `<li><strong data-count="${s.value}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</strong><span>${esc(s.label)}</span></li>`)
    .join("");

  function typeRoles() {
    const el = $("#role");
    const roles = D.person.roles;
    if (reduce) { el.textContent = roles[0]; return; }
    let i = 0, j = roles[0].length, deleting = true;
    const tick = () => {
      const word = roles[i];
      j += deleting ? -1 : 1;
      el.textContent = word.slice(0, j);
      let wait = deleting ? 35 : 70;
      if (!deleting && j === word.length) { deleting = true; wait = 2200; }
      else if (deleting && j === 0) { deleting = false; i = (i + 1) % roles.length; wait = 300; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 2600);
  }
  typeRoles();
  setTimeout(() => $(".hero-title .outline").classList.add("filled"), 900);

  function countUp(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix;
    if (reduce) { el.textContent = target + suffix; return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- interactive dot field ---------- */
  const field = (() => {
    const c = $("#field"), ctx = c.getContext("2d");
    let w, h, dpr, pts = [], mouse = { x: -9999, y: -9999 }, colA, colB, running = true, t = 0;
    const css = (v) => getComputedStyle(root).getPropertyValue(v).trim();
    function recolor() { colA = css("--accent"); colB = css("--accent-2"); if (reduce) draw(); }
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 700 ? 34 : 42;
      pts = [];
      for (let y = gap / 2; y < h; y += gap)
        for (let x = gap / 2; x < w; x += gap) pts.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
      if (reduce) draw();
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.012;
      for (const p of pts) {
        const wave = reduce ? 0 : Math.sin(p.ox * 0.01 + t) * Math.cos(p.oy * 0.012 + t * 0.8) * 3;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy, R = 140;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 6;
          p.vx += (dx / d) * f; p.vy += (dy / d) * f;
        }
        p.vx += (p.ox - p.x) * 0.06; p.vy += (p.oy + wave - p.y) * 0.06;
        p.vx *= 0.82; p.vy *= 0.82;
        p.x += p.vx; p.y += p.vy;
        const disp = Math.min(1, Math.hypot(p.x - p.ox, p.y - p.oy) / 18);
        ctx.globalAlpha = 0.18 + disp * 0.7;
        ctx.fillStyle = disp > 0.25 ? colB : colA;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 + disp * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function loop() { if (running) draw(); requestAnimationFrame(loop); }
    addEventListener("resize", resize);
    addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, { passive: true });
    document.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(([e]) => (running = e.isIntersecting)).observe(c);
    recolor(); resize();
    if (!reduce) loop();
    return { recolor };
  })();

  /* cursor glow */
  addEventListener("pointermove", (e) => {
    root.style.setProperty("--mx", e.clientX + "px");
    root.style.setProperty("--my", e.clientY + "px");
  }, { passive: true });

  /* ---------- generated cover art (for projects without screenshots) ---------- */
  function seeded(str) {
    let h = 2166136261;
    for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  }
  function coverArt(p) {
    const r = seeded(p.id), [c1, c2] = p.accent;
    const blocks = [];
    if (p.type === "mobile") {
      const x = 205, y = 30, W = 110, H = 200;
      blocks.push(`<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="18" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.35)"/>`);
      blocks.push(`<rect x="${x + 40}" y="${y + 8}" width="30" height="5" rx="2.5" fill="rgba(255,255,255,.35)"/>`);
      let yy = y + 26;
      for (let i = 0; i < 6; i++) {
        const hh = 12 + Math.floor(r() * 26);
        if (yy + hh > y + H - 12) break;
        blocks.push(`<rect x="${x + 10}" y="${yy}" width="${W - 20 - Math.floor(r() * 40)}" height="${hh}" rx="6" fill="rgba(255,255,255,${(0.14 + r() * 0.22).toFixed(2)})"/>`);
        yy += hh + 8;
      }
    } else if (p.type === "iot") {
      blocks.push(`<rect x="200" y="70" width="120" height="120" rx="16" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.4)"/>`);
      for (let i = 1; i <= 5; i++) {
        const px = 200 + i * 20, py = 70 + i * 20;
        blocks.push(`<path d="M${px} 70v-24M${px} 190v24M200 ${py}h-24M320 ${py}h24" stroke="rgba(255,255,255,.35)" stroke-width="3" stroke-linecap="round"/>`);
      }
      blocks.push(`<circle cx="260" cy="130" r="24" fill="rgba(255,255,255,.3)"/>`);
    } else {
      const x = 90, y = 34, W = 340, H = 200;
      blocks.push(`<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="12" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)"/>`);
      blocks.push(`<path d="M${x} ${y + 22}h${W}" stroke="rgba(255,255,255,.25)"/>`);
      for (let i = 0; i < 3; i++) blocks.push(`<circle cx="${x + 14 + i * 12}" cy="${y + 11}" r="3.5" fill="rgba(255,255,255,.45)"/>`);
      const side = r() > 0.4;
      if (side) blocks.push(`<rect x="${x + 10}" y="${y + 32}" width="60" height="${H - 42}" rx="6" fill="rgba(255,255,255,.12)"/>`);
      const gx = side ? x + 80 : x + 10, gw = side ? W - 90 : W - 20;
      const cols = 2 + Math.floor(r() * 2), rows = 2;
      const cw = (gw - (cols - 1) * 8) / cols, ch = (H - 52 - (rows - 1) * 8) / rows;
      for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++)
          blocks.push(`<rect x="${(gx + j * (cw + 8)).toFixed(1)}" y="${(y + 32 + i * (ch + 8)).toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" rx="6" fill="rgba(255,255,255,${(0.1 + r() * 0.22).toFixed(2)})"/>`);
    }
    const orbs = Array.from({ length: 3 }, () =>
      `<circle cx="${Math.floor(r() * 520)}" cy="${Math.floor(r() * 270)}" r="${60 + Math.floor(r() * 90)}" fill="${r() > 0.5 ? c2 : "#ffffff"}" opacity="${(0.08 + r() * 0.14).toFixed(2)}"/>`).join("");
    return `<div class="cover-art" aria-hidden="true"><svg viewBox="0 0 520 270" preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="g-${p.id}" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="rgba(255,255,255,.07)"/></pattern></defs>
      <rect width="520" height="270" fill="url(#g-${p.id})"/>${orbs}${blocks.join("")}</svg></div>`;
  }

  const lock = `<svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>`;
  const kindLabel = { client: "Client", nda: "Under NDA", personal: "Personal", university: "University" };
  const typeLabel = { web: "Web", mobile: "Mobile", iot: "IoT" };

  function cover(p, big = false) {
    const style = `style="--c1:${p.accent[0]};--c2:${p.accent[1]}"`;
    const badges = `<div class="badges">${p.kind === "nda" ? `<span class="badge nda">${lock} NDA</span>` : ""}<span class="badge">${typeLabel[p.type]}</span></div>`;
    if (p.image && p.phone) {
      const imgs = [p.image, big ? p.imageAlt : null].filter(Boolean)
        .map((src) => `<img src="${src}" alt="${esc(p.title)} screenshot" loading="lazy" />`).join("");
      return `<div class="cover phone" ${style}>${imgs}${badges}</div>`;
    }
    if (p.image) return `<div class="cover" ${style}><img src="${p.image}" alt="${esc(p.title)} screenshot" loading="lazy" />${badges}</div>`;
    return `<div class="cover" ${style}>${coverArt(p)}<span class="cover-word">${esc(p.title)}</span>${badges}</div>`;
  }

  /* ---------- projects ---------- */
  const projects = [...D.projects].sort((a, b) => (b.featured - a.featured));
  const filters = [
    { id: "all", label: "All", test: () => true },
    { id: "web", label: "Web", test: (p) => p.type === "web" },
    { id: "mobile", label: "Mobile", test: (p) => p.type === "mobile" },
    { id: "iot", label: "IoT", test: (p) => p.type === "iot" },
    { id: "client", label: "Client", test: (p) => p.kind === "client" },
    { id: "nda", label: "Under NDA", test: (p) => p.kind === "nda" },
    { id: "side", label: "Personal & uni", test: (p) => p.kind === "personal" || p.kind === "university" },
  ];
  let active = "all", query = "";
  $("#filters").innerHTML = filters
    .map((f) => `<button class="chip" data-f="${f.id}" aria-pressed="${f.id === active}">${f.label}<span class="n">${projects.filter(f.test).length}</span></button>`)
    .join("");
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    active = b.dataset.f;
    $$(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    renderGrid();
  });
  const search = $("#search");
  search.addEventListener("input", () => { query = search.value.trim().toLowerCase(); renderGrid(); });

  const matches = (p) => {
    if (!filters.find((f) => f.id === active).test(p)) return false;
    if (!query) return true;
    return [p.title, p.tagline, p.summary, ...p.stack, typeLabel[p.type], kindLabel[p.kind]].join(" ").toLowerCase().includes(query);
  };

  function cardHTML(p) {
    const big = p.featured && active === "all" && !query;
    const tags = p.stack.slice(0, 5).map((s) => `<span class="tag${query && s.toLowerCase().includes(query) ? " hit" : ""}">${esc(s)}</span>`).join("");
    return `<button class="card${big ? " featured" : ""}" data-id="${p.id}" aria-label="${esc(p.title)}: open details">
      ${cover(p)}
      <div class="card-body">
        <div class="card-meta"><span>${kindLabel[p.kind]}</span><span>${esc(p.year)}</span></div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.tagline)}</p>
        <div class="tags">${tags}</div>
      </div>
    </button>`;
  }

  let renderToken = 0;
  function renderGrid() {
    const grid = $("#grid"), token = ++renderToken;
    const list = projects.filter(matches);
    $("#result-count").textContent = query || active !== "all" ? `${list.length} project${list.length === 1 ? "" : "s"}` : "";
    const old = $$(".card", grid);
    old.forEach((c) => c.classList.add("out"));
    setTimeout(() => {
      if (token !== renderToken) return;
      grid.innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="empty">Nothing matches “${esc(query)}”. Try another technology.</p>`;
      const cards = $$(".card", grid);
      cards.forEach((c) => c.classList.add("out"));
      requestAnimationFrame(() => cards.forEach((c, i) => setTimeout(() => c.classList.remove("out"), reduce ? 0 : i * 35)));
      bindCards();
    }, old.length && !reduce ? 220 : 0);
  }

  function bindCards() {
    $$(".card").forEach((card) => {
      card.addEventListener("click", () => openProject(card.dataset.id));
      if (reduce || matchMedia("(hover: none)").matches) return;
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--cx", x * 100 + "%");
        card.style.setProperty("--cy", y * 100 + "%");
        card.style.setProperty("--ry", (x - 0.5) * 6 + "deg");
        card.style.setProperty("--rx", (0.5 - y) * 6 + "deg");
      });
      card.addEventListener("pointerleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
    });
  }
  renderGrid();

  /* modal */
  const modal = $("#modal");
  function openProject(id) {
    const p = D.projects.find((x) => x.id === id); if (!p) return;
    const links = p.links.map((l) => `<a class="btn ${/visit/i.test(l.label) ? "btn-primary" : "btn-ghost"}" href="${l.url}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");
    $("#modal-body").innerHTML = `
      <button class="close" aria-label="Close" data-close>×</button>
      ${cover(p, true)}
      <div class="modal-content">
        <div class="card-meta"><span>${kindLabel[p.kind]} · ${typeLabel[p.type]}</span><span>${esc(p.year)}</span></div>
        <h2 id="modal-title">${esc(p.title)}</h2>
        <p>${esc(p.summary)}</p>
        <h4>Highlights</h4>
        <ul class="hl">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
        <h4>Built with</h4>
        <div class="tags">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
        ${p.kind === "nda" ? `<p class="nda-note">${lock} Built under an NDA, so names, screenshots and code stay private. I'm happy to talk through my role and the engineering in an interview.</p>` : ""}
        ${p.kind === "client" && !p.links.length ? `<p class="nda-note">Private client project. The code isn't public.</p>` : ""}
        ${links ? `<div class="modal-links">${links}</div>` : ""}
      </div>`;
    modal.showModal();
    history.replaceState(null, "", "#project-" + id);
  }
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) modal.close(); });
  modal.addEventListener("close", () => history.replaceState(null, "", location.pathname + "#work"));

  /* ---------- experience ---------- */
  const tl = $("#timeline");
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parseYM = (s) => { if (!s) { const d = new Date(); return [d.getFullYear(), d.getMonth() + 1]; } const [y, m] = s.split("-").map(Number); return [y, m]; };
  const fmtYM = (s) => (s ? `${MONTHS[parseYM(s)[1] - 1]} ${parseYM(s)[0]}` : "Present");
  const duration = (a, b) => {
    const [y1, m1] = parseYM(a), [y2, m2] = parseYM(b);
    const months = (y2 - y1) * 12 + (m2 - m1) + 1, y = Math.floor(months / 12), m = months % 12;
    return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
  };

  const g = D.careerGlance;
  $("#glance").innerHTML = `
    <div class="glance-block"><p class="glance-label">Career path</p>
      <ol class="path">${g.path.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>
    <div class="glance-block"><p class="glance-label">Industries</p>
      <div class="tags">${g.industries.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div></div>`;

  const projTitle = (id) => (D.projects.find((p) => p.id === id) || {}).title;
  tl.insertAdjacentHTML("beforeend", D.experience.map((j, i) => {
    const current = !j.end;
    const projects = (j.projects || []).filter(projTitle);
    return `
    <li class="job reveal${current ? " current" : ""}">
      <article class="job-card" data-open="${i === 0}">
        <button class="job-head" aria-expanded="${i === 0}" aria-controls="job-${i}">
          <div class="job-title">
            <p class="job-focus">${esc(j.focus)}</p>
            <h3>${esc(j.role)}</h3>
            <p class="co">${esc(j.company)}</p>
          </div>
          <div class="job-when">
            ${current ? `<span class="now"><span class="dot"></span>Current</span>` : ""}
            <span class="when">${fmtYM(j.start)} – ${fmtYM(j.end)}</span>
            <span class="dur">${duration(j.start, j.end)}</span>
          </div>
        </button>
        <p class="job-summary">${esc(j.summary)}</p>
        <ul class="facts">${j.facts.map((f) => `<li><strong>${esc(f.value)}</strong><span>${esc(f.label)}</span></li>`).join("")}</ul>
        <div class="job-body" id="job-${i}"><div>
          <div class="groups">${j.groups.map((gr) => `
            <section class="group"><h4>${esc(gr.title)}</h4>
              <ul>${gr.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
            </section>`).join("")}</div>
          ${projects.length ? `<div class="job-projects"><h4>Related work</h4><div class="proj-links">${projects.map((id) =>
            `<button class="proj-link" data-project="${id}">${esc(projTitle(id))} <span aria-hidden="true">↗</span></button>`).join("")}</div></div>` : ""}
          <div class="job-stack"><h4>Stack</h4><div class="tags">${j.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div></div>
        </div></div>
        <button class="job-toggle" aria-controls="job-${i}"><span>${i === 0 ? "Show less" : "Show details"}</span>
          <svg class="chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
      </article>
    </li>`;
  }).join(""));

  function setJob(card, open) {
    card.dataset.open = open;
    $(".job-head", card).setAttribute("aria-expanded", open);
    $(".job-toggle span", card).textContent = open ? "Show less" : "Show details";
  }
  function syncExpandAll() {
    const all = $$(".job-card", tl).every((c) => c.dataset.open === "true");
    const b = $("#expand-all");
    b.textContent = all ? "Collapse all" : "Expand all";
    b.setAttribute("aria-pressed", all);
  }
  tl.addEventListener("click", (e) => {
    const link = e.target.closest(".proj-link");
    if (link) { openProject(link.dataset.project); return; }
    const t = e.target.closest(".job-head, .job-toggle"); if (!t) return;
    const card = t.closest(".job-card");
    setJob(card, card.dataset.open !== "true");
    syncExpandAll();
    setTimeout(timelineProgress, 480);
  });
  $("#expand-all").addEventListener("click", () => {
    const open = !$$(".job-card", tl).every((c) => c.dataset.open === "true");
    $$(".job-card", tl).forEach((c) => setJob(c, open));
    syncExpandAll();
    setTimeout(timelineProgress, 480);
  });
  function timelineProgress() {
    const r = tl.getBoundingClientRect(), vh = innerHeight;
    const p = Math.max(0, Math.min(1, (vh * 0.6 - r.top) / r.height));
    $(".timeline-progress").style.height = p * (r.height - 12) + "px";
    $$(".job", tl).forEach((j) => j.classList.toggle("lit", j.getBoundingClientRect().top < vh * 0.6));
  }

  /* ---------- skills ---------- */
  const usage = (skill) => {
    const s = skill.toLowerCase();
    return D.projects.filter((p) => p.stack.some((x) => x.toLowerCase().startsWith(s) || x.toLowerCase().includes(s))).length;
  };
  $("#skill-groups").innerHTML = D.skills.map((g) => `
    <div class="skill-group reveal"><h3>${esc(g.group)}</h3><div class="skill-list">
      ${g.items.map((s) => { const n = usage(s); return `<button class="skill" data-skill="${esc(s)}" ${n ? "" : "disabled"} title="${n ? `Show ${n} project${n > 1 ? "s" : ""} using ${esc(s)}` : "Used in work not shown here"}">${esc(s)}${n ? `<span class="n">${n}</span>` : ""}</button>`; }).join("")}
    </div></div>`).join("");
  $("#skill-groups").addEventListener("click", (e) => {
    const b = e.target.closest(".skill"); if (!b || b.disabled) return;
    search.value = b.dataset.skill; query = b.dataset.skill.toLowerCase();
    active = "all"; $$(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.f === "all"));
    renderGrid();
    $("#work").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    toast(`Showing projects that use ${b.dataset.skill}`);
  });

  /* ---------- about / education / community ---------- */
  $("#about-text").innerHTML = D.person.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#education").innerHTML = D.education.map((e) => `<li><strong>${esc(e.school)}</strong><span>${esc(e.detail)}</span><em>${esc(e.period)}</em></li>`).join("");
  $("#community").innerHTML = D.community.map((c) => `<li><strong>${esc(c.title)}</strong><span>${esc(c.text)}</span></li>`).join("");

  /* ---------- contact ---------- */
  const icons = {
    github: '<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>',
    linkedin: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9Z"/>',
    stack: '<path d="M17.4 20.5v-5.4h1.8V22H3.8v-6.9h1.8v5.4h11.8ZM7.6 14.6l8.8 1.8.4-1.7-8.8-1.9-.4 1.8Zm1.2-4.3 8.2 3.8.7-1.6-8.2-3.8-.7 1.6Zm2.3-4 6.9 5.8 1.1-1.4-6.9-5.8-1.1 1.4ZM15.6 2l-1.4 1.1 5.4 7.2 1.4-1.1L15.6 2ZM7.4 18.7h9v-1.8h-9v1.8Z"/>',
    x: '<path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z"/>',
  };
  $("#socials").innerHTML = D.person.links.map((l) =>
    `<li><a href="${l.url}" target="_blank" rel="noopener me"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">${icons[l.icon] || ""}</svg>${esc(l.label)}</a></li>`).join("");
  const mailLink = $("#email-link");
  mailLink.href = "mailto:" + email;
  mailLink.textContent = "Email me";
  $("#copy-email").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(email); toast("Email address copied"); }
    catch (e) { toast(email); }
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- magnetic buttons ---------- */
  if (!reduce && !matchMedia("(hover: none)").matches) {
    $$(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty("--tx", (e.clientX - r.left - r.width / 2) * 0.25 + "px");
        b.style.setProperty("--ty", (e.clientY - r.top - r.height / 2) * 0.35 + "px");
      });
      b.addEventListener("pointerleave", () => { b.style.setProperty("--tx", "0px"); b.style.setProperty("--ty", "0px"); });
    });
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      io.unobserve(e.target);
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (el.closest(".hero") ? i * 90 : 0) + "ms"; io.observe(el); });

  /* ---------- nav: hide on scroll down, highlight current section ---------- */
  const nav = $("#nav");
  let lastY = scrollY;
  const sections = ["work", "experience", "skills", "about", "contact"].map((id) => document.getElementById(id));
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 20);
    nav.classList.toggle("hidden", y > lastY && y > 400 && $("#palette").hidden);
    lastY = y;
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id;
    $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
    timelineProgress();
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- command palette ---------- */
  const pal = $("#palette"), palIn = $("#palette-input"), palList = $("#palette-list");
  const items = [
    ...["work", "experience", "skills", "about", "contact"].map((id) => ({ label: id[0].toUpperCase() + id.slice(1), kind: "section", run: () => document.getElementById(id).scrollIntoView({ behavior: reduce ? "auto" : "smooth" }) })),
    ...D.projects.map((p) => ({ label: p.title, kind: kindLabel[p.kind], run: () => openProject(p.id) })),
    { label: "Copy email address", kind: "action", run: () => $("#copy-email").click() },
    { label: "Toggle light / dark theme", kind: "action", run: () => $("#theme-toggle").click() },
    { label: "Open GitHub", kind: "link", run: () => open("https://github.com/Paradox2405", "_blank", "noopener") },
  ];
  let palSel = 0, palItems = items, lastFocus;
  function palRender() {
    const q = palIn.value.trim().toLowerCase();
    palItems = items.filter((i) => i.label.toLowerCase().includes(q) || i.kind.toLowerCase().includes(q));
    palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
    palList.innerHTML = palItems.map((i, n) => `<li role="option" data-i="${n}" aria-selected="${n === palSel}"><span>${esc(i.label)}</span><small>${esc(i.kind)}</small></li>`).join("") || `<li>No results</li>`;
  }
  function palOpen() { lastFocus = document.activeElement; pal.hidden = false; palIn.value = ""; palSel = 0; palRender(); palIn.focus(); }
  function palClose() { pal.hidden = true; lastFocus && lastFocus.focus && lastFocus.focus(); }
  function palRun(i) { const it = palItems[i]; if (!it) return; palClose(); setTimeout(it.run, 30); }
  $("#open-palette").addEventListener("click", palOpen);
  palIn.addEventListener("input", () => { palSel = 0; palRender(); });
  palList.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) palRun(+li.dataset.i); });
  pal.addEventListener("click", (e) => { if (e.target === pal) palClose(); });
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? palOpen() : palClose(); return; }
    if (e.key === "/" && pal.hidden && !/input|textarea/i.test(document.activeElement.tagName) && !modal.open) { e.preventDefault(); palOpen(); return; }
    if (pal.hidden) return;
    if (e.key === "Escape") palClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); palSel = (palSel + 1) % Math.max(1, palItems.length); palRender(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); palSel = (palSel - 1 + palItems.length) % Math.max(1, palItems.length); palRender(); }
    else if (e.key === "Enter") { e.preventDefault(); palRun(palSel); }
  });
  if (/Mac|iPhone|iPad/.test(navigator.platform)) $("#open-palette kbd").textContent = "⌘K";

  /* deep link: #project-<id> */
  const m = location.hash.match(/^#project-(.+)$/);
  if (m) setTimeout(() => openProject(m[1]), 300);
})();
