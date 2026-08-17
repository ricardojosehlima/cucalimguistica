const TSG = (() => {
  const cache = new Map();

  async function fetchText(path) {
    if (cache.has(path)) return cache.get(path);
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`naum consegi carregar ${path} (${response.status})`);
    }
    const text = await response.text();
    cache.set(path, text);
    return text;
  }

  async function fetchJSON(path) {
    const text = await fetchText(path);
    return JSON.parse(text);
  }

  function parseJSONL(text) {
    return text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => JSON.parse(line));
  }

  function padDay(day) {
    return String(day).padStart(3, "0");
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value ?? "";
  }

  function fitFormElement(el) {
    if (!el || el.classList.contains("empty-output")) return;

    const container = el.parentElement;
    if (!container) return;

    el.classList.remove("form-wrap");
    el.style.fontSize = "";
    el.style.whiteSpace = "nowrap";

    const available = Math.max(120, container.clientWidth - 10);
    let size = parseFloat(window.getComputedStyle(el).fontSize);
    const minSize = window.matchMedia("(max-width: 700px)").matches ? 26 : 34;

    let guard = 0;
    while (el.scrollWidth > available && size > minSize && guard < 60) {
      size -= 2;
      el.style.fontSize = `${size}px`;
      guard += 1;
    }

    if (el.scrollWidth > available) {
      el.classList.add("form-wrap");
      el.style.fontSize = "";
    }
  }

  function setFormText(selector, value) {
    const el = $(selector);
    if (!el) return;

    const text = String(value ?? "");
    el.textContent = text;
    el.classList.remove("form-wrap");
    el.style.fontSize = "";
    el.style.whiteSpace = "nowrap";

    requestAnimationFrame(() => fitFormElement(el));
  }

  window.addEventListener("resize", () => {
    document.querySelectorAll(".big-form").forEach(fitFormElement);
  });

  function clearElement(el) {
    while (el && el.firstChild) el.removeChild(el.firstChild);
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function weightedSample(array, count, weightKey = "selection_weight") {
    const available = [...array];
    const picked = [];
    while (picked.length < count && available.length) {
      const total = available.reduce((sum, item) => sum + Number(item[weightKey] || 1), 0);
      let target = Math.random() * total;
      let chosenIndex = 0;
      for (let i = 0; i < available.length; i++) {
        target -= Number(available[i][weightKey] || 1);
        if (target <= 0) {
          chosenIndex = i;
          break;
        }
      }
      picked.push(available.splice(chosenIndex, 1)[0]);
    }
    return picked;
  }

  function getZonedParts(date = new Date(), timeZone = TSG_CONFIG.timeZone) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    const parts = Object.fromEntries(formatter.formatToParts(date).map(p => [p.type, p.value]));
    return {
      year: Number(parts.year),
      month: Number(parts.month),
      day: Number(parts.day),
      hour: Number(parts.hour),
      minute: Number(parts.minute),
      second: Number(parts.second)
    };
  }

  function ymdToUTCDate(ymd) {
    const [year, month, day] = ymd.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  }

  function currentYMDInZone() {
    const p = getZonedParts();
    return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
  }

  function secondsSinceMidnight() {
    const p = getZonedParts();
    return p.hour * 3600 + p.minute * 60 + p.second;
  }

  function calculateDay(totalDays = Infinity) {
    if (TSG_CONFIG.mode === "preview") {
      return Math.min(TSG_CONFIG.preview.fixedDay || 1, totalDays);
    }

    const today = ymdToUTCDate(currentYMDInZone());
    const launch = ymdToUTCDate(TSG_CONFIG.launchDate);
    const diff = Math.floor((today - launch) / 86400000) + 1;

    if (diff < 1) return 0;
    if (Number.isFinite(totalDays)) return Math.min(diff, totalDays);
    return diff;
  }

  function calculateSlot(count, secondsPerEntry) {
    if (TSG_CONFIG.mode === "preview" && Number.isInteger(TSG_CONFIG.preview.fixedSlot)) {
      return Math.min(TSG_CONFIG.preview.fixedSlot, Math.max(0, count - 1));
    }
    const slot = Math.floor(secondsSinceMidnight() / secondsPerEntry);
    return slot % Math.max(1, count);
  }

  function findArchiveEntry(archiveIndex, day) {
    return archiveIndex.find(item => Number(item.day) === Number(day)) || archiveIndex[0];
  }

  function buildStatusMessage(day, entry) {
    if (TSG_CONFIG.mode === "preview") {
      return `modo de teste · dia ${day}.`;
    }
    if (day === 0) {
      return `o jerador ainda esta em imcubasaum. a contajem comesa em ${TSG_CONFIG.launchDate}.`;
    }
    return `dia ${day}${entry?.date ? ` — ${entry.date}` : ""}.`;
  }

  return {
    fetchText,
    fetchJSON,
    parseJSONL,
    padDay,
    $,
    setText,
    setFormText,
    fitFormElement,
    clearElement,
    createEl,
    shuffle,
    weightedSample,
    calculateDay,
    calculateSlot,
    findArchiveEntry,
    buildStatusMessage
  };
})();
