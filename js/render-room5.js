import { LIBRARY_FACTS, isLibraryMatchComplete } from './room5.mjs';
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

export function renderRoom5(container, state, onSolved) {
  container.innerHTML = '';

  const labels = Object.keys(LIBRARY_FACTS);
  const shuffledValues = shuffle(labels);
  const guesses = {}; // valueOwner (label the value really belongs to) -> label picked in its dropdown

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-6.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'Biblioteca';
  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'Via della Traspontina, 15 — Roma';

  const note = document.createElement('p');
  note.style.maxWidth = '560px';
  note.style.textAlign = 'center';
  note.style.fontSize = '15px';
  note.textContent = 'Hai lasciato la sede principale: la Biblioteca della Fondazione si trova in un altro palazzo, poco distante.';

  const instructions = document.createElement('p');
  instructions.style.maxWidth = '560px';
  instructions.style.textAlign = 'center';
  instructions.style.fontSize = '15px';
  instructions.textContent = 'Per ogni numero, scegli dal menu a cosa si riferisce.';

  const labelsRow = document.createElement('div');
  labelsRow.style.display = 'flex';
  labelsRow.style.gap = '16px';
  labelsRow.style.flexWrap = 'wrap';
  labelsRow.style.justifyContent = 'center';
  labelsRow.style.maxWidth = '680px';

  const valuesRow = document.createElement('div');
  valuesRow.style.display = 'flex';
  valuesRow.style.gap = '12px';
  valuesRow.style.marginTop = '24px';

  const error = document.createElement('div');
  error.className = 'lock-widget__error';

  labels.forEach((label) => {
    const card = document.createElement('div');
    card.className = 'btn';
    card.textContent = label;
    labelsRow.appendChild(card);
  });

  const valueCards = {};

  shuffledValues.forEach((valueOwner) => {
    const valueCard = document.createElement('div');
    valueCard.className = 'modal';
    valueCard.style.padding = '14px 22px';
    valueCard.style.textAlign = 'center';

    const text = document.createElement('p');
    text.style.margin = '0 0 10px';
    text.style.fontWeight = '700';
    text.style.fontSize = '20px';
    text.textContent = LIBRARY_FACTS[valueOwner];

    const select = document.createElement('select');
    select.className = 'lock-widget__input';
    select.style.width = '100%';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'A quale dato si riferisce?';
    select.appendChild(placeholder);

    labels.forEach((label) => {
      const option = document.createElement('option');
      option.value = label;
      option.textContent = label;
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      guesses[valueOwner] = select.value;
      valueCard.style.border = '';
    });

    valueCards[valueOwner] = valueCard;
    valueCard.appendChild(text);
    valueCard.appendChild(select);
    valuesRow.appendChild(valueCard);
  });

  const verifyBtn = document.createElement('button');
  verifyBtn.className = 'btn';
  verifyBtn.textContent = 'Verifica';
  verifyBtn.addEventListener('click', () => {
    const valueMapping = Object.fromEntries(
      Object.entries(guesses)
        .filter(([, label]) => label)
        .map(([valueOwner, label]) => [label, LIBRARY_FACTS[valueOwner]])
    );
    if (isLibraryMatchComplete(valueMapping)) {
      error.textContent = '';
      Object.values(valueCards).forEach((card) => { card.style.border = ''; });
      const newState = collectLetter(state, 'biblioteca', 'G');
      saveState(newState, getSafeStorage());
      renderLetterTray(newState.lettersCollected, trayEl);
      onSolved(newState);
    } else {
      error.textContent = 'Qualche abbinamento non è giusto…';
      Object.entries(valueCards).forEach(([valueOwner, card]) => {
        const isCorrect = guesses[valueOwner] === valueOwner;
        card.style.border = isCorrect ? '2px solid var(--giallo)' : '2px solid #D64550';
      });
    }
  });

  const trayEl = document.createElement('div');

  scene.appendChild(title);
  scene.appendChild(subtitle);
  scene.appendChild(note);
  scene.appendChild(instructions);
  scene.appendChild(labelsRow);
  scene.appendChild(valuesRow);
  scene.appendChild(verifyBtn);
  scene.appendChild(error);
  container.appendChild(scene);
  container.appendChild(trayEl);

  renderLetterTray(state.lettersCollected, trayEl);
}
