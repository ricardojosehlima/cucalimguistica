async function initLexicalDisplay() {
  const status = TSG.$("#lexical-status");
  try {
    const base = TSG_CONFIG.lexical.basePath;
    const manifest = await TSG.fetchJSON(`${base}/manifest.json`);
    const archive = await TSG.fetchJSON(`${base}/archive_index.json`);
    const totalDays = Number(manifest.total_days || archive.length || 1);
    const day = TSG.calculateDay(totalDays);

    if (day === 0) {
      TSG.setFormText("#lexical-form", "em imcubasaum");
      TSG.setText("#lexical-status", TSG.buildStatusMessage(day));
      return;
    }

    const entry = TSG.findArchiveEntry(archive, day);
    const file = entry?.file || `days/day_${TSG.padDay(day)}.jsonl`;
    const text = await TSG.fetchText(`${base}/${file}`);
    const entries = TSG.parseJSONL(text);
    const count = Number(entry?.count || entries.length || 1);

    function render() {
      const slot = TSG.calculateSlot(count, TSG_CONFIG.lexical.secondsPerEntry);
      const lexical = entries[slot] || entries[0] || {};
      TSG.setFormText("#lexical-form", lexical.forma || "—");
      TSG.setText("#lexical-class", lexical.classe_resultante ? `classe ${lexical.classe_resultante}` : "clase —");
      TSG.setText("#lexical-definition", lexical.definicao || "");
      TSG.setText("#lexical-example", lexical.frase || "");
      TSG.setText("#lexical-day", `dia ${day}`);
      if (status) status.textContent = TSG.buildStatusMessage(day, entry);
    }

    render();
    setInterval(render, 1000);
  } catch (error) {
    console.error(error);
    TSG.setFormText("#lexical-form", "falia leqisicau");
    if (status) status.textContent = error.message;
  }
}
