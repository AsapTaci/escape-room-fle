import { CORRECT_PINS, DECOY_PINS, PIN_ADDRESSES, isMapComplete } from './room6.mjs';
import { collectLetter, saveState } from './state.mjs';
import { renderLetterTray } from './ui.mjs';

// Approximate relative positions (percent of map width/height) for a
// stylized, not geographically precise, outline of Italy.
const PIN_POSITIONS = {
  milano: { x: 38, y: 22, label: 'Milano' },
  trieste: { x: 66, y: 26, label: 'Trieste' },
  firenze: { x: 46, y: 46, label: 'Firenze' },
  napoli: { x: 58, y: 70, label: 'Napoli' },
  'capo-dorlando': { x: 50, y: 92, label: "Capo d'Orlando" },
  torino: { x: 24, y: 20, label: 'Torino' },
  bologna: { x: 48, y: 36, label: 'Bologna' },
  genova: { x: 30, y: 32, label: 'Genova' },
};

export function renderRoom6(container, state, onSolved) {
  container.innerHTML = '';

  const found = new Set();

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-7.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'Mappa delle Sedi';
  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'Le sedi regionali della Fondazione';

  const map = document.createElement('div');
  map.style.position = 'relative';
  map.style.width = 'min(90vw, 420px)';
  map.style.height = 'min(90vw, 420px)';
  map.style.background = 'rgba(12,36,84,0.55)';
  map.style.border = '1px solid var(--azzurro)';
  map.style.borderRadius = '12px';
  map.style.margin = '16px 0';

  const info = document.createElement('div');
  info.style.minHeight = '24px';
  info.style.maxWidth = '480px';
  info.style.textAlign = 'center';
  info.className = 'lock-widget__error';

  const allPins = [...CORRECT_PINS, ...DECOY_PINS];

  allPins.forEach((pinId) => {
    const pos = PIN_POSITIONS[pinId];
    const pin = document.createElement('button');
    pin.style.position = 'absolute';
    pin.style.left = `${pos.x}%`;
    pin.style.top = `${pos.y}%`;
    pin.style.transform = 'translate(-50%, -50%)';
    pin.style.width = '18px';
    pin.style.height = '18px';
    pin.style.borderRadius = '50%';
    pin.style.border = '2px solid var(--bianco)';
    pin.style.background = 'var(--azzurro)';
    pin.style.cursor = 'pointer';
    pin.title = pos.label;

    pin.addEventListener('click', () => {
      if (CORRECT_PINS.includes(pinId)) {
        found.add(pinId);
        pin.style.background = 'var(--giallo)';
        pin.disabled = true;
        info.style.color = '';
        info.textContent = `${pos.label}: ${PIN_ADDRESSES[pinId]}`;

        if (isMapComplete(found)) {
          const newState = collectLetter(state, 'mappa', 'I');
          saveState(newState, localStorage);
          renderLetterTray(newState.lettersCollected, trayEl);
          onSolved(newState);
        }
      } else {
        info.textContent = 'Non è qui…';
      }
    });

    map.appendChild(pin);
  });

  const trayEl = document.createElement('div');

  scene.appendChild(title);
  scene.appendChild(subtitle);
  scene.appendChild(map);
  scene.appendChild(info);
  container.appendChild(scene);
  container.appendChild(trayEl);

  renderLetterTray(state.lettersCollected, trayEl);
}
