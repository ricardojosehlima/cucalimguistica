const TSG_CONFIG = {
  mode: "preview", // "preview" or "live"
  launchDate: "2026-08-22",
  timeZone: "America/Sao_Paulo",

  preview: {
    fixedDay: 1,
    fixedSlot: null,
    label: "estamos ao vivo — a contajem ofisiau comesou em 22 de agosto!"
  },

  wordFlood: {
    basePath: "website_words",
    secondsPerEntry: 3
  },

  lexical: {
    basePath: "lexical_website",
    secondsPerEntry: 60
  },

  byot: {
    basePath: "byot_assets",
    traySize: 8
  },

  transsignDay: {
    basePath: "transsign_day"
  }
};
