const TSG_CONFIG = {
  mode: "preview", // "preview" or "live"
  launchDate: "2027-01-01",
  timeZone: "America/Sao_Paulo",

  preview: {
    fixedDay: 1,
    fixedSlot: null,
    label: "modo previu — a contajem ofisiau ainda naum comesou"
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
