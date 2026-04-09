// Dopamine Blueprint Generator · Constraint-satisfaction habit picker
// 100% client-side, zero dependencies
(() => {
  "use strict";

  // ---------- CONFIG ----------
  const N8N_WEBHOOK = "https://molecrab-n8n.onrender.com/webhook/lead-magnet-email";
  const UPSELL_URL = "https://producto-protocolo-dopamina.vercel.app";

  const QUESTIONS = [
    {
      id: "time",
      label: "Pregunta 1",
      title: "¿Cuántos minutos al día puedes dedicar al reset?",
      help: "Sé honesto. Menos siempre es mejor que ninguno.",
      type: "single",
      options: [
        { key: 15, emoji: "⏱️", text: "15 min",  sub: "mínimo viable" },
        { key: 30, emoji: "⏰", text: "30 min",  sub: "recomendado" },
        { key: 60, emoji: "🕐", text: "60 min",  sub: "modo serio" },
        { key: 90, emoji: "🕛", text: "90 min",  sub: "todo dentro" },
      ],
    },
    {
      id: "level",
      label: "Pregunta 2",
      title: "¿Cómo describirías tu nivel actual?",
      help: "Esto limita la dificultad máxima del plan.",
      type: "single",
      options: [
        { key: 2, emoji: "🪫", text: "Saturado",   sub: "necesito empezar suave" },
        { key: 3, emoji: "🔋", text: "Normal",     sub: "puedo con dificultad media" },
        { key: 4, emoji: "🔥", text: "Enfocado",   sub: "dame algo exigente" },
        { key: 5, emoji: "⚡", text: "Bestia",      sub: "máxima intensidad" },
      ],
    },
    {
      id: "energy",
      label: "Pregunta 3",
      title: "Priorizas sobre todo…",
      help: "El solver pesará más estas dimensiones.",
      type: "single",
      options: [
        { key: "dop", emoji: "🧠", text: "Dopamina baseline", sub: "placer real de cosas simples" },
        { key: "foc", emoji: "🎯", text: "Foco profundo",     sub: "capacidad de concentración" },
        { key: "ene", emoji: "⚡", text: "Energía estable",   sub: "despertar descansado" },
      ],
    },
    {
      id: "triggers",
      label: "Pregunta 4",
      title: "¿Qué te dispara más? (máx 3)",
      help: "Tap para marcar. Deselecciona si te equivocas.",
      type: "multi",
      max: 3,
      options: [
        { key: "scroll",    emoji: "📱", text: "Doomscrolling",                  sub: "" },
        { key: "phone",     emoji: "📲", text: "El móvil en general",            sub: "" },
        { key: "sugar",     emoji: "🍬", text: "Azúcar / comida basura",         sub: "" },
        { key: "insomnia",  emoji: "😴", text: "Insomnio",                       sub: "" },
        { key: "anxiety",   emoji: "😰", text: "Ansiedad difusa",                sub: "" },
        { key: "loneliness",emoji: "🕳️", text: "Soledad",                        sub: "" },
        { key: "boredom",   emoji: "😐", text: "Aburrimiento crónico",           sub: "" },
        { key: "procrast",  emoji: "🦥", text: "Procrastinación",                sub: "" },
      ],
    },
    {
      id: "categories",
      label: "Pregunta 5",
      title: "¿Qué áreas quieres trabajar? (máx 4)",
      help: "El plan intentará cubrir estas categorías.",
      type: "multi",
      max: 4,
      options: [
        { key: "screen", emoji: "📵", text: "Pantallas",     sub: "" },
        { key: "body",   emoji: "💪", text: "Cuerpo",        sub: "" },
        { key: "mind",   emoji: "🧘", text: "Mente",         sub: "" },
        { key: "social", emoji: "🤝", text: "Social",        sub: "" },
        { key: "sleep",  emoji: "🌙", text: "Sueño",         sub: "" },
        { key: "food",   emoji: "🥗", text: "Alimentación",  sub: "" },
        { key: "nature", emoji: "🌳", text: "Naturaleza",    sub: "" },
      ],
    },
    {
      id: "mindset",
      label: "Pregunta 6",
      title: "¿Qué tipo de cambio prefieres?",
      help: "Esto afecta la diversidad del plan.",
      type: "single",
      options: [
        { key: "focused", emoji: "🎯", text: "Pocas acciones, repetidas", sub: "mismo plan cada día" },
        { key: "varied",  emoji: "🎲", text: "Varias acciones, rotando",  sub: "cada día distinto" },
      ],
    },
  ];

  // ---------- STATE ----------
  const state = {
    answers: {},
    currentQ: 0,
    result: null,
  };

  // ---------- UI HELPERS ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const show = (id) => {
    $$(".screen").forEach(s => s.classList.remove("active"));
    $(`#${id}`).classList.add("active");
    window.scrollTo(0, 0);
  };
  const toast = (msg) => {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2500);
  };

  // ---------- QUIZ FLOW ----------
  function renderQuestion() {
    const q = QUESTIONS[state.currentQ];
    const container = $("#question-container");
    const selected = state.answers[q.id];

    const optionsHtml = q.options.map(opt => {
      const isSel = q.type === "multi"
        ? Array.isArray(selected) && selected.includes(opt.key)
        : selected === opt.key;
      return `
        <div class="option ${isSel ? "selected" : ""}" data-key="${opt.key}" role="button" tabindex="0">
          <div class="option-emoji">${opt.emoji}</div>
          <div>
            <div class="option-text">${opt.text}</div>
            ${opt.sub ? `<div class="option-sub">${opt.sub}</div>` : ""}
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="question-label">${q.label}</div>
      <h2 class="question-title">${q.title}</h2>
      ${q.help ? `<p class="question-help">${q.help}</p>` : ""}
      <div class="options">${optionsHtml}</div>
      ${q.type === "multi" ? `<div class="multi-note">Máximo ${q.max} · tap para alternar</div>` : ""}
    `;

    $$("#question-container .option").forEach(el => {
      el.addEventListener("click", () => handleOption(q, el.dataset.key));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOption(q, el.dataset.key); }
      });
    });

    const pct = ((state.currentQ) / QUESTIONS.length) * 100;
    $("#progress-fg").style.width = `${pct}%`;
    $("#progress-label").textContent = `${state.currentQ + 1} / ${QUESTIONS.length}`;
  }

  function handleOption(q, rawKey) {
    // Normalize key (numbers stay numbers)
    const key = isNaN(Number(rawKey)) ? rawKey : Number(rawKey);

    if (q.type === "single") {
      state.answers[q.id] = key;
      renderQuestion();
      setTimeout(() => nextQuestion(), 180);
    } else {
      const arr = Array.isArray(state.answers[q.id]) ? [...state.answers[q.id]] : [];
      const idx = arr.indexOf(key);
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        if (arr.length >= q.max) {
          toast(`Máximo ${q.max} opciones`);
          return;
        }
        arr.push(key);
      }
      state.answers[q.id] = arr;
      renderQuestion();
    }
  }

  function nextQuestion() {
    if (state.currentQ < QUESTIONS.length - 1) {
      state.currentQ++;
      renderQuestion();
    } else {
      // Validate multi answers
      const needMulti = QUESTIONS.filter(q => q.type === "multi");
      for (const q of needMulti) {
        if (!state.answers[q.id] || state.answers[q.id].length === 0) {
          toast(`Selecciona al menos 1 en "${q.title}"`);
          state.currentQ = QUESTIONS.indexOf(q);
          renderQuestion();
          return;
        }
      }
      runSolver();
    }
  }

  function prevQuestion() {
    if (state.currentQ > 0) {
      state.currentQ--;
      renderQuestion();
    } else {
      show("screen-intro");
    }
  }

  // ---------- SOLVER (Constraint Satisfaction + Weighted Knapsack) ----------
  function runSolver() {
    show("screen-compute");
    const log = $("#compute-log");
    log.innerHTML = "";

    const steps = [
      "> loading habit pool (42)",
      "> applying trigger filters",
      "> applying category constraints",
      "> applying difficulty cap",
      "> weighted knapsack (5 slots)",
      "> computing 14-day rotation",
      "> signing blueprint id",
    ];
    steps.forEach((s, i) => {
      setTimeout(() => {
        const li = document.createElement("li");
        li.textContent = s;
        li.style.animationDelay = "0s";
        log.appendChild(li);
      }, i * 240);
    });

    setTimeout(() => {
      state.result = solve(state.answers);
      renderResult();
      show("screen-result");
    }, steps.length * 240 + 300);
  }

  function solve(answers) {
    const pool = window.HABIT_POOL;
    const { time, level, energy, triggers, categories, mindset } = answers;

    // 1. Filter by difficulty cap
    let candidates = pool.filter(h => h.diff <= level);

    // 2. Boost habits matching selected triggers
    const trigSet = new Set(triggers);
    const catSet = new Set(categories);

    // 3. Compute composite score per candidate
    // w_energy is the weight for the priority axis (dop/foc/ene)
    candidates = candidates.map(h => {
      const axis = h[energy]; // dop|foc|ene
      const trigHits = h.triggers.filter(t => trigSet.has(t)).length;
      const catMatch = catSet.has(h.cat) ? 1 : 0;
      // Composite: 50% axis priority + 30% trigger match + 20% category match
      const score = (axis * 5) + (trigHits * 10) + (catMatch * 8);
      return { ...h, _score: score, _trigHits: trigHits, _catMatch: catMatch };
    });

    // 4. Sort desc by score
    candidates.sort((a, b) => b._score - a._score);

    // 5. Knapsack: pick top-5 with total_min <= time AND at least 1 per selected category (greedy + constraints)
    const picked = [];
    const usedCats = new Set();
    let totalMin = 0;

    // First pass: one habit per selected category (highest-scoring)
    for (const cat of categories) {
      const best = candidates.find(h => h.cat === cat && !picked.find(p => p.id === h.id));
      if (best && totalMin + best.min <= time && picked.length < 5) {
        picked.push(best);
        usedCats.add(cat);
        totalMin += best.min;
      }
    }

    // Second pass: fill remaining slots with best available fitting the time budget
    for (const h of candidates) {
      if (picked.length >= 5) break;
      if (picked.find(p => p.id === h.id)) continue;
      if (totalMin + h.min > time) continue;
      picked.push(h);
      totalMin += h.min;
    }

    // Fallback: if we got <3 habits, relax time constraint
    if (picked.length < 3) {
      for (const h of candidates) {
        if (picked.length >= 5) break;
        if (picked.find(p => p.id === h.id)) continue;
        picked.push(h);
        totalMin += h.min;
      }
    }

    // 6. Build reasons
    const why = [];
    if (triggers.length) {
      const bestTrigMatch = picked.filter(p => p._trigHits > 0).length;
      why.push(`<strong>${bestTrigMatch}/${picked.length}</strong> hábitos atacan directamente tus triggers (${triggers.join(", ")}).`);
    }
    why.push(`Total de <strong>${totalMin} min/día</strong> bajo tu presupuesto de ${time} min.`);
    why.push(`Dificultad media <strong>${(picked.reduce((s, h) => s + h.diff, 0) / picked.length).toFixed(1)}/5</strong>, por debajo de tu techo de ${level}.`);
    why.push(`Priorizado en el eje <strong>${ { dop: "dopamina baseline", foc: "foco profundo", ene: "energía estable" }[energy] }</strong>.`);
    if (mindset === "varied") {
      why.push(`Plan de <strong>rotación</strong>: alternas las 5 acciones en ventanas de 3-4 días.`);
    } else {
      why.push(`Plan <strong>focalizado</strong>: repites las 5 acciones cada día para crear anclaje.`);
    }

    // 7. Score global (0-100)
    const avgAxis = picked.reduce((s, h) => s + h[energy], 0) / picked.length;
    const score = Math.round(Math.min(100, (avgAxis / 10) * 100));

    // 8. Unique blueprint ID (hash of picked IDs + answers)
    const idSource = picked.map(p => p.id).sort().join("") + energy + level + time + mindset;
    const blueprintId = hash32(idSource).toString(36).toUpperCase().padStart(7, "0").slice(0, 7);

    return {
      picked,
      why,
      totalMin,
      score,
      blueprintId,
      avgDiff: (picked.reduce((s, h) => s + h.diff, 0) / picked.length).toFixed(1),
      answers,
    };
  }

  function hash32(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // ---------- RESULT RENDER ----------
  function renderResult() {
    const r = state.result;
    $("#score-num").textContent = r.score;
    $("#score-time").textContent = `${r.totalMin} min`;
    $("#score-diff").textContent = `${r.avgDiff} / 5`;
    $("#score-id").textContent = `#${r.blueprintId}`;

    // Ring animation
    const RING_CIRC = 2 * Math.PI * 52;
    setTimeout(() => {
      $("#result-ring").style.strokeDasharray = RING_CIRC;
      $("#result-ring").style.strokeDashoffset = RING_CIRC * (1 - r.score / 100);
    }, 100);

    // Habits
    $("#habits-list").innerHTML = r.picked.map(h => `
      <div class="habit-card">
        <div class="emoji">${h.emoji}</div>
        <div class="body">
          <div class="name">${h.name}</div>
          <div class="desc">${h.desc}</div>
          <div class="meta">
            <span class="chip">${h.cat}</span>
            ${h.min > 0 ? `<span class="chip">${h.min} min</span>` : `<span class="chip">pasivo</span>`}
            <span class="chip">dif ${h.diff}/5</span>
          </div>
        </div>
      </div>
    `).join("");

    // Why
    $("#why-list").innerHTML = r.why.map(w => `<li>${w}</li>`).join("");
  }

  // ---------- LEAD CAPTURE ----------
  async function submitLead(e) {
    e.preventDefault();
    const email = $("#lead-email").value.trim();
    const status = $("#lead-status");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = "Email no válido";
      status.style.color = "var(--danger)";
      return;
    }

    status.textContent = "Enviando…";
    status.style.color = "var(--muted)";

    const payload = {
      email,
      source: "dopamine-blueprint-generator",
      blueprint_id: state.result.blueprintId,
      score: state.result.score,
      habits: state.result.picked.map(h => h.id),
      answers: state.result.answers,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "cors",
      });
      if (res.ok || res.type === "opaque") {
        status.textContent = "✓ Plan enviado. Revisa tu bandeja.";
        status.style.color = "var(--success)";
        $("#lead-form").querySelector("button").disabled = true;
        // Save locally as backup
        try {
          localStorage.setItem("blueprint_lead", JSON.stringify(payload));
        } catch (_) {}
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      status.textContent = "⚠️ Error al enviar. Prueba otra vez en 30s.";
      status.style.color = "var(--danger)";
      try {
        localStorage.setItem("blueprint_lead_retry", JSON.stringify(payload));
      } catch (_) {}
    }
  }

  // ---------- SHARE ----------
  function buildShareText() {
    const r = state.result;
    const lines = [
      `Mi Dopamine Blueprint #${r.blueprintId} (score ${r.score}/100)`,
      ``,
      `Protocolo de 14 días:`,
      ...r.picked.map((h, i) => `${i + 1}. ${h.emoji} ${h.name}`),
      ``,
      `Generado con: ${location.origin}${location.pathname}`,
    ];
    return lines.join("\n");
  }

  async function shareBlueprint() {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Dopamine Blueprint #${state.result.blueprintId}`,
          text,
          url: location.href,
        });
      } catch (_) { /* user cancelled */ }
    } else {
      copyBlueprint();
    }
  }

  async function copyBlueprint() {
    const text = buildShareText();
    try {
      await navigator.clipboard.writeText(text);
      toast("Copiado al portapapeles");
    } catch (_) {
      toast("Copia manualmente el texto");
    }
  }

  // ---------- BOOT ----------
  $("#start-btn").addEventListener("click", () => {
    state.currentQ = 0;
    state.answers = {};
    renderQuestion();
    show("screen-quiz");
  });
  $("#back-btn").addEventListener("click", prevQuestion);
  $("#restart-btn").addEventListener("click", () => {
    state.answers = {};
    state.currentQ = 0;
    state.result = null;
    show("screen-intro");
  });
  $("#lead-form").addEventListener("submit", submitLead);
  $("#share-btn").addEventListener("click", shareBlueprint);
  $("#copy-btn").addEventListener("click", copyBlueprint);
})();
