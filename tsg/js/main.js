function initModeBadge() {
  const badge = document.getElementById("mode-badge");
  if (!badge) return;

  if (TSG_CONFIG.mode === "preview") {
    badge.textContent = TSG_CONFIG.preview.label || "modo previu";
    return;
  }

  badge.textContent = `modo live — comeso em ${TSG_CONFIG.launchDate}`;
}

window.addEventListener("DOMContentLoaded", () => {
  initModeBadge();
  initWordFlood();
  initLexicalDisplay();
  initTranssignDay();
  initBYOT();
});
