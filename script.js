const mottoVersions = [
  [
    'Pela a língua da gente.',
    'Contra a norma padrão.',
    'Com biscoito E bolacha.'
  ],
  [
    'pela a limgua da jente',
    'contra a norrma <span style="text-decoration: underline;">do</span> pa<span style="text-decoration: underline;">t</span>raum.',
    'com biscoito e bolaxa'
  ]
];

let currentMotto = 0;

const mottoLines = [
  document.getElementById('motto-line-1'),
  document.getElementById('motto-line-2'),
  document.getElementById('motto-line-3')
];

function renderMotto() {
  mottoLines.forEach((line, index) => {
    line.innerHTML = mottoVersions[currentMotto][index];
  });
}

renderMotto();

window.setInterval(() => {
  currentMotto = (currentMotto + 1) % mottoVersions.length;
  renderMotto();
}, 6000);

function renderFakeCounter() {
  const counter = document.getElementById('fake-counter');

  if (!counter) {
    return;
  }

  const min = 1_000_000_000;
  const max = 8_200_000_000;
  const value = Math.floor(Math.random() * (max - min + 1)) + min;

  counter.textContent = value.toLocaleString('pt-BR');
}

renderFakeCounter();
