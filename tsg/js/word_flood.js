async function initWordFlood() {
  const status = TSG.$("#word-flood-status");
  try {
    const base = TSG_CONFIG.wordFlood.basePath;
    const manifest = await TSG.fetchJSON(`${base}/manifest.json`);
    const archive = await TSG.fetchJSON(`${base}/archive_index.json`);
    const totalDays = Number(manifest.total_days || archive.length || 1);
    const day = TSG.calculateDay(totalDays);

    if (day === 0) {
      TSG.setFormText("#word-flood-form", "em imcubasaum");
      TSG.setText("#word-flood-status", TSG.buildStatusMessage(day));
      return;
    }

    const entry = TSG.findArchiveEntry(archive, day);
    const file = entry?.file || `words/day_${TSG.padDay(day)}.txt`;
    const text = await TSG.fetchText(`${base}/${file}`);
    const forms = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const count = forms.length;

    function render() {
      const slot = TSG.calculateSlot(count, TSG_CONFIG.wordFlood.secondsPerEntry);
      const form = forms[slot] || forms[0] || "—";
      TSG.setFormText("#word-flood-form", form);
      TSG.setText("#word-flood-day", `dia ${day}`);
      const progress = TSG.$("#word-flood-progress");
      if (progress) progress.style.width = `${((slot + 1) / count) * 100}%`;
      if (status) status.textContent = TSG.buildStatusMessage(day, entry);
    }

    render();
    setInterval(render, 1000);
  } catch (error) {
    console.error(error);
    TSG.setFormText("#word-flood-form", "falia na enxente");
    if (status) status.textContent = error.message;
  }
}
