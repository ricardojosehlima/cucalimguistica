const BYOT_STATE = {
  assets: null,
  trays: {
    prefixes: [],
    words: [],
    suffixes: []
  },
  selected: [],
  sequence: []
};

function normalizePiece(item, category) {
  return {
    id: item.id,
    form: item.form,
    type: item.type || category,
    category,
    pos: item.pos || "",
    hint: item.semantic_hint || (Array.isArray(item.semantic_tags) ? item.semantic_tags.join(", ") : "")
  };
}

function isSamePiece(a, b) {
  return a.id === b.id && a.category === b.category;
}

function renderTray(containerId, pieces) {
  const container = TSG.$(containerId);
  TSG.clearElement(container);
  pieces.forEach(piece => {
    const button = TSG.createEl("button", "piece-button", piece.form);
    button.type = "button";
    button.title = piece.hint || piece.pos || piece.type;
    if (BYOT_STATE.selected.some(selected => isSamePiece(selected, piece))) {
      button.classList.add("selected");
    }
    button.addEventListener("click", () => togglePiece(piece));
    container.appendChild(button);
  });
}

function renderTrays() {
  renderTray("#prefix-tray", BYOT_STATE.trays.prefixes);
  renderTray("#word-tray", BYOT_STATE.trays.words);
  renderTray("#suffix-tray", BYOT_STATE.trays.suffixes);
}

function togglePiece(piece) {
  const index = BYOT_STATE.selected.findIndex(selected => isSamePiece(selected, piece));
  if (index >= 0) {
    const removed = BYOT_STATE.selected.splice(index, 1)[0];
    BYOT_STATE.sequence = BYOT_STATE.sequence.filter(seqPiece => !isSamePiece(seqPiece, removed));
  } else {
    BYOT_STATE.selected.push(piece);
  }
  renderBYOT();
}

function drawTrays() {
  const traySize = TSG_CONFIG.byot.traySize || 8;
  const { prefixes, words, suffixes } = BYOT_STATE.assets;
  BYOT_STATE.trays.prefixes = TSG.weightedSample(prefixes, traySize).map(item => normalizePiece(item, "prefix"));
  BYOT_STATE.trays.words = TSG.weightedSample(words, traySize).map(item => normalizePiece(item, "word"));
  BYOT_STATE.trays.suffixes = TSG.weightedSample(suffixes, traySize).map(item => normalizePiece(item, "suffix"));
  BYOT_STATE.selected = [];
  BYOT_STATE.sequence = [];
  renderBYOT();
}

function renderSelectedPieces() {
  const container = TSG.$("#selected-pieces");
  TSG.clearElement(container);

  if (!BYOT_STATE.selected.length) {
    container.appendChild(TSG.createEl("p", "small-note", "neniuma pesa selesionada ainda"));
    return;
  }

  BYOT_STATE.selected.forEach((piece, index) => {
    const button = TSG.createEl("button", "number-button");
    button.type = "button";
    const badge = TSG.createEl("span", "number-badge", String(index + 1));
    const form = TSG.createEl("span", "", piece.form);
    button.appendChild(badge);
    button.appendChild(form);
    button.title = "adisionar a sequensia";
    button.addEventListener("click", () => {
      BYOT_STATE.sequence.push(piece);
      renderBYOT();
    });
    container.appendChild(button);
  });
}

function renderSequence() {
  const container = TSG.$("#sequence-pieces");
  TSG.clearElement(container);

  if (!BYOT_STATE.sequence.length) {
    container.appendChild(TSG.createEl("p", "small-note", "a sequensia ainda esta vazia."));
    return;
  }

  BYOT_STATE.sequence.forEach(piece => {
    container.appendChild(TSG.createEl("span", "sequence-chip", piece.form));
  });
}

function validateBYOT() {
  const wordCount = BYOT_STATE.selected.filter(piece => piece.category === "word").length;
  if (BYOT_STATE.selected.length < 2) return "selesione pelo menos duas pesas";
  if (wordCount === 0) return "selesione ezatamente uma palavra";
  if (wordCount > 1) return "tem palavra demais: selesione ezatamente uma";
  if (!BYOT_STATE.sequence.length) return "agora cliqe nos numeros para montar a sequensia";

  const sequenceWordCount = BYOT_STATE.sequence.filter(piece => piece.category === "word").length;
  if (sequenceWordCount === 0) return "a sequensia presiza conter a palavra escolida";
  return "";
}

function buildOutput() {
  const joinMode = TSG.$("#byot-join-mode")?.value || "glued";
  const separator = joinMode === "hyphenated" ? "-" : "";
  return BYOT_STATE.sequence.map(piece => piece.form).join(separator);
}

function renderOutput() {
  const status = validateBYOT();
  const outputEl = TSG.$("#byot-output");
  if (!outputEl) return;

  if (status) {
    outputEl.classList.add("empty-output");
    TSG.setText("#byot-output", "monte a sequensia e jere seu transigino.");
    TSG.setText("#byot-status", status);
    return;
  }

  outputEl.classList.remove("empty-output");
  TSG.setFormText("#byot-output", buildOutput());
  TSG.setText("#byot-status", "transigino jerado sem pedir lisensa.");
}

function renderBYOT() {
  renderTrays();
  renderSelectedPieces();
  renderSequence();
  renderOutput();
}

async function initBYOT() {
  const status = TSG.$("#byot-status");
  try {
    const base = TSG_CONFIG.byot.basePath;
    const [prefixes, suffixes, words] = await Promise.all([
      TSG.fetchJSON(`${base}/prefixes.json`),
      TSG.fetchJSON(`${base}/suffixes.json`),
      TSG.fetchJSON(`${base}/words.json`)
    ]);

    BYOT_STATE.assets = { prefixes, suffixes, words };

    TSG.$("#byot-redraw")?.addEventListener("click", drawTrays);
    TSG.$("#byot-clear")?.addEventListener("click", () => {
      BYOT_STATE.selected = [];
      BYOT_STATE.sequence = [];
      renderBYOT();
    });
    TSG.$("#byot-backspace")?.addEventListener("click", () => {
      BYOT_STATE.sequence.pop();
      renderBYOT();
    });
    TSG.$("#byot-join-mode")?.addEventListener("change", renderOutput);

    drawTrays();
  } catch (error) {
    console.error(error);
    if (status) status.textContent = error.message;
  }
}
