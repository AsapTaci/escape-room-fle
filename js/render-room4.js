import { ARCHIVE_FUNDS, isArchiveMatchComplete } from './room4.mjs';
import { collectLetter, saveState } from './state.mjs';
import { renderLetterTray } from './ui.mjs';

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function renderRoom4(container, state, onSolved) {
  container.innerHTML = '';

  const funds = Object.keys(ARCHIVE_FUNDS);
  const shuffledDescriptions = shuffle(funds);
  const pairs = {};
  let selectedFund = null;

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-5.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'Archivio Storico';
  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'I fondi della Fondazione';

  const fundsRow = document.createElement('div');
  fundsRow.style.display = 'flex';
  fundsRow.style.gap = '16px';
  fundsRow.style.flexWrap = 'wrap';
  fundsRow.style.justifyContent = 'center';

  const descCol = document.createElement('div');
  descCol.style.display = 'flex';
  descCol.style.flexDirection = 'column';
  descCol.style.gap = '12px';
  descCol.style.marginTop = '24px';
  descCol.style.maxWidth = '640px';

  const error = document.createElement('div');
  error.className = 'lock-widget__error';

  const fundCards = {};

  funds.forEach((fund) => {
    const card = document.createElement('div');
    card.className = 'btn';
    card.style.cursor = 'pointer';
    card.textContent = fund;

    card.addEventListener('click', () => {
      selectedFund = fund;
      Object.values(fundCards).forEach((c) => (c.style.outline = ''));
      card.style.outline = '3px solid var(--navy)';
    });

    fundCards[fund] = card;
    fundsRow.appendChild(card);
  });

  shuffledDescriptions.forEach((descOwner) => {
    const descCard = document.createElement('div');
    descCard.className = 'modal';
    descCard.style.cursor = 'pointer';
    descCard.style.padding = '12px 16px';
    descCard.textContent = ARCHIVE_FUNDS[descOwner];

    descCard.addEventListener('click', () => {
      if (!selectedFund) return;
      pairs[selectedFund] = descOwner;
      descCard.style.border = '2px solid var(--giallo)';
      fundCards[selectedFund].style.outline = '';
      selectedFund = null;
    });

    descCol.appendChild(descCard);
  });

  const verifyBtn = document.createElement('button');
  verifyBtn.className = 'btn';
  verifyBtn.textContent = 'Verifica';
  verifyBtn.addEventListener('click', () => {
    if (isArchiveMatchComplete(pairs)) {
      error.textContent = '';
      const newState = collectLetter(state, 'archivio', 'I');
      saveState(newState, localStorage);
      renderLetterTray(newState.lettersCollected, trayEl);
      onSolved(newState);
    } else {
      error.textContent = 'Qualche abbinamento non è giusto…';
    }
  });

  const trayEl = document.createElement('div');

  scene.appendChild(title);
  scene.appendChild(subtitle);
  scene.appendChild(fundsRow);
  scene.appendChild(descCol);
  scene.appendChild(verifyBtn);
  scene.appendChild(error);
  container.appendChild(scene);
  container.appendChild(trayEl);

  renderLetterTray(state.lettersCollected, trayEl);
}
