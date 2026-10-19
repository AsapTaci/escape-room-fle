import { FINAL_CODE } from './finale.mjs';
import { renderLockWidget, renderLetterTray } from './ui.mjs';
import { getSafeStorage } from './state.mjs';

const VISION_TEXT =
  'Si impegna perché ogni cittadino sia in condizione di vivere, di crescere, di rapportarsi con gli altri e di prosperare in pace, attraverso il riconoscimento delle diversità, la difesa delle libertà individuali e della dignità umana, la promozione del confronto libero e costruttivo sui fatti e le idee.';

export function renderVictory(container) {
  container.innerHTML = '';

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-1.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'Sei libero';

  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'Fondazione Luigi Einaudi';

  const vision = document.createElement('p');
  vision.style.maxWidth = '640px';
  vision.style.textAlign = 'center';
  vision.style.fontSize = '17px';
  vision.style.lineHeight = '1.6';
  vision.textContent = VISION_TEXT;

  const restartBtn = document.createElement('button');
  restartBtn.className = 'btn';
  restartBtn.textContent = 'Ricomincia';
  restartBtn.style.marginTop = '8px';
  restartBtn.addEventListener('click', () => {
    try {
      getSafeStorage().removeItem('fle-escape-room-state');
    } catch {
      // ignore: worst case the next load just resumes from here
    }
    location.reload();
  });

  const logo = document.createElement('img');
  logo.className = 'logo-fe';
  logo.src = 'assets/logo.png';
  logo.alt = 'Fondazione Luigi Einaudi';

  scene.appendChild(title);
  scene.appendChild(subtitle);
  scene.appendChild(vision);
  scene.appendChild(restartBtn);
  scene.appendChild(logo);
  container.appendChild(scene);
}

export function renderFinale(container, state, onSolved) {
  container.innerHTML = '';

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-1.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'La porta d’uscita';
  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'Componi il codice con le lettere raccolte';

  const lockContainer = document.createElement('div');

  const logo = document.createElement('img');
  logo.className = 'logo-fe';
  logo.src = 'assets/logo.png';
  logo.alt = 'Fondazione Luigi Einaudi';

  const trayEl = document.createElement('div');

  scene.appendChild(title);
  scene.appendChild(subtitle);
  scene.appendChild(lockContainer);
  scene.appendChild(logo);
  container.appendChild(scene);
  container.appendChild(trayEl);

  renderLetterTray(state.lettersCollected, trayEl);

  renderLockWidget({
    code: FINAL_CODE,
    onSuccess: () => {
      onSolved({ ...state, completed: true });
      renderVictory(container);
    },
    container: lockContainer,
  });
}
