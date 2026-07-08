function weatherLabel(key) {
  const labels = {
    compound_pressure: "presaum de compozisaum",
    wildness_index: "indise de seuvajeria",
    prefix_pressure: "presaum prefiqisau",
    suffix_turbulence: "turbulensia sufiqisau",
    semantic_humidity: "umidade semantica",
    category_instability: "instabilidade categoriau",
    orthographic_visibility: "vizibilidade orrtografica",
    lexical_pressure: "presaum leqisicau"
  };
  return labels[key] || key.replaceAll("_", " ");
}

async function initTranssignDay() {
  const status = TSG.$("#daily-status");
  try {
    const base = TSG_CONFIG.transsignDay.basePath;
    const manifest = await TSG.fetchJSON(`${base}/manifest.json`);
    const archive = await TSG.fetchJSON(`${base}/archive_index.json`);
    const totalDays = Number(manifest.total_days || archive.length || 1);
    const day = TSG.calculateDay(totalDays);

    if (day === 0) {
      TSG.setFormText("#daily-form", "em imcubasaum");
      TSG.setText("#daily-status", TSG.buildStatusMessage(day));
      return;
    }

    const entry = TSG.findArchiveEntry(archive, day);
    const file = entry?.file || `days/day_${TSG.padDay(day)}.json`;
    const data = await TSG.fetchJSON(`${base}/${file}`);

    TSG.setFormText("#daily-form", data.form || "—");
    TSG.setText("#daily-classification", `${data.classification || "—"}${data.classification_score ? ` (${data.classification_score}%)` : ""}`);
    TSG.setText("#daily-explanation", data.explanation || "");

    const weather = TSG.$("#daily-weather");
    TSG.clearElement(weather);
    Object.entries(data.weather || {}).forEach(([key, value]) => {
      const item = TSG.createEl("div", "weather-item");
      item.appendChild(TSG.createEl("span", "", weatherLabel(key)));
      item.appendChild(TSG.createEl("strong", "", String(value)));
      weather.appendChild(item);
    });

    const forecast = TSG.$("#daily-forecast");
    TSG.clearElement(forecast);
    (data.forecast_lines || []).forEach(line => forecast.appendChild(TSG.createEl("li", "", line)));

    const events = TSG.$("#daily-events");
    TSG.clearElement(events);
    (data.event_lines || []).forEach(line => events.appendChild(TSG.createEl("li", "", line)));

    if (status) status.textContent = TSG.buildStatusMessage(day, entry);
  } catch (error) {
    console.error(error);
    TSG.setFormText("#daily-form", "falia no clima");
    if (status) status.textContent = error.message;
  }
}
