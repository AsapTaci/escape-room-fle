import { SPEAKER_QUOTES, isQuoteMatchComplete } from './room2.mjs';
import { collectLetter, saveState, getSafeStorage } from './state.mjs';
import { renderLetterTray } from './ui.mjs';

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase();
}

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function renderRoom2(container, state, onSolved) {
  container.innerHTML = '';

  const speakers = Object.keys(SPEAKER_QUOTES);
  const shuffledQuotes = shuffle(speakers);
  const guesses = {}; // quoteOwner (the quote's real speaker) -> speaker name picked in that quote's dropdown

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-3.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'Liberale è';
  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'Sala della Scuola di Liberalismo';

  const instructions = document.createElement('p');
  instructions.style.maxWidth = '560px';
  instructions.style.textAlign = 'center';
  instructions.style.fontSize = '15px';
  instructions.textContent = 'Per ogni citazione, scegli dal menu chi pensi l’abbia detta.';

  const speakersRow = document.createElement('div');
  speakersRow.style.display = 'flex';
  speakersRow.style.gap = '20px';
  speakersRow.style.flexWrap = 'wrap';
  speakersRow.style.justifyContent = 'center';

  const quotesCol = document.createElement('div');
  quotesCol.style.display = 'flex';
  quotesCol.style.flexDirection = 'column';
  quotesCol.style.gap = '12px';
  quotesCol.style.marginTop = '24px';
  quotesCol.style.maxWidth = '640px';

  const error = document.createElement('div');
  error.className = 'lock-widget__error';

  speakers.forEach((speaker) => {
    const card = document.createElement('div');
    card.style.textAlign = 'center';

    const avatar = document.createElement('div');
    avatar.className = 'avatar-circle';
    avatar.textContent = initials(speaker);

    const nameEl = document.createElement('div');
    nameEl.className = 'person-name';
    const parts = speaker.split(' ');
    const surname = parts.pop();
    nameEl.innerHTML = `<span class="firstname">${parts.join(' ')}</span> <span class="surname">${surname}</span>`;

    card.appendChild(avatar);
    card.appendChild(nameEl);
    speakersRow.appendChild(card);
  });

  const quoteBorders = {};

  shuffledQuotes.forEach((quoteOwner) => {
    const quoteCard = document.createElement('div');
    quoteCard.className = 'modal';
    quoteCard.style.padding = '12px 16px';

    const text = document.createElement('p');
    text.style.margin = '0 0 10px';
    text.textContent = `"${SPEAKER_QUOTES[quoteOwner]}"`;

    const select = document.createElement('select');
    select.className = 'lock-widget__input';
    select.style.width = '100%';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Chi l’ha detta?';
    select.appendChild(placeholder);

    speakers.forEach((speaker) => {
      const option = document.createElement('option');
      option.value = speaker;
      option.textContent = speaker;
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      guesses[quoteOwner] = select.value;
      quoteCard.style.border = '';
    });

    quoteBorders[quoteOwner] = quoteCard;
    quoteCard.appendChild(text);
    quoteCard.appendChild(select);
    quotesCol.appendChild(quoteCard);
  });

  const verifyBtn = document.createElement('button');
  verifyBtn.className = 'btn';
  verifyBtn.textContent = 'Verifica';
  verifyBtn.addEventListener('click', () => {
    if (isQuoteMatchComplete(guesses)) {
      error.textContent = '';
      Object.values(quoteBorders).forEach((card) => { card.style.border = ''; });
      const newState = collectLetter(state, 'scuola', 'L');
      saveState(newState, getSafeStorage());
      renderLetterTray(newState.lettersCollected, trayEl);
      onSolved(newState);
    } else {
      error.textContent = 'Qualche abbinamento non è giusto…';
      Object.entries(quoteBorders).forEach(([quoteOwner, card]) => {
        const isCorrect = guesses[quoteOwner] === quoteOwner;
        card.style.border = isCorrect ? '2px solid var(--giallo)' : '2px solid #D64550';
      });
    }
  });

  const trayEl = document.createElement('div');

  scene.appendChild(title);
  scene.appendChild(subtitle);
  scene.appendChild(instructions);
  scene.appendChild(speakersRow);
  scene.appendChild(quotesCol);
  scene.appendChild(verifyBtn);
  scene.appendChild(error);
  container.appendChild(scene);
  container.appendChild(trayEl);

  renderLetterTray(state.lettersCollected, trayEl);
}
