import { ARCHIVE_FUNDS, isArchiveMatchComplete } from './room4.mjs';
import { collectLetter, saveState, getSafeStorage } from './state.mjs';
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
  const guesses = {}; // descOwner (fund the description really belongs to) -> fund name picked in its dropdown

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-5.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'Archivio Storico';
  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'I fondi della Fondazione';

  const instructions = document.createElement('p');
  instructions.style.maxWidth = '560px';
  instructions.style.textAlign = 'center';
  instructions.style.fontSize = '15px';
  instructions.textContent = 'Per ogni descrizione, scegli dal menu a quale fondo appartiene.';

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

  funds.forEach((fund) => {
    const card = document.createElement('div');
    card.className = 'btn';
    card.textContent = fund;
    fundsRow.appendChild(card);
  });

  const descCards = {};

  shuffledDescriptions.forEach((descOwner) => {
    const descCard = document.createElement('div');
    descCard.className = 'modal';
    descCard.style.padding = '12px 16px';

    const text = document.createElement('p');
    text.style.margin = '0 0 10px';
    text.textContent = ARCHIVE_FUNDS[descOwner];

    const select = document.createElement('select');
    select.className = 'lock-widget__input';
    select.style.width = '100%';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Di quale fondo si tratta?';
    select.appendChild(placeholder);

    funds.forEach((fund) => {
      const option = document.createElement('option');
      option.value = fund;
      option.textContent = fund;
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      guesses[descOwner] = select.value;
      descCard.style.border = '';
    });

    descCards[descOwner] = descCard;
    descCard.appendChild(text);
    descCard.appendChild(select);
    descCol.appendChild(descCard);
  });

  const verifyBtn = document.createElement('button');
  verifyBtn.className = 'btn';
  verifyBtn.textContent = 'Verifica';
  verifyBtn.addEventListener('click', () => {
    if (isArchiveMatchComplete(guesses)) {
      error.textContent = '';
      Object.values(descCards).forEach((card) => { card.style.border = ''; });
      const newState = collectLetter(state, 'archivio', 'I');
      saveState(newState, getSafeStorage());
      renderLetterTray(newState.lettersCollected, trayEl);
      onSolved(newState);
    } else {
      error.textContent = 'Qualche abbinamento non è giusto…';
      Object.entries(descCards).forEach(([descOwner, card]) => {
        const isCorrect = guesses[descOwner] === descOwner;
        card.style.border = isCorrect ? '2px solid var(--giallo)' : '2px solid #D64550';
      });
    }
  });

  const trayEl = document.createElement('div');

  scene.appendChild(title);
  scene.appendChild(subtitle);
  scene.appendChild(instructions);
  scene.appendChild(fundsRow);
  scene.appendChild(descCol);
  scene.appendChild(verifyBtn);
  scene.appendChild(error);
  container.appendChild(scene);
  container.appendChild(trayEl);

  renderLetterTray(state.lettersCollected, trayEl);
}
