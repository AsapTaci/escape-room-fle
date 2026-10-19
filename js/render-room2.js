import { SPEAKER_QUOTES, isQuoteMatchComplete } from './room2.mjs';
import { collectLetter, saveState } from './state.mjs';
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
  const pairs = {}; // speaker -> chosen quote-owner
  let selectedSpeaker = null;

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-3.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'Liberale è';
  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'Sala della Scuola di Liberalismo';

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

  const speakerCards = {};
  const quoteCards = {};

  speakers.forEach((speaker) => {
    const card = document.createElement('div');
    card.style.textAlign = 'center';
    card.style.cursor = 'pointer';

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
    card.addEventListener('click', () => {
      selectedSpeaker = speaker;
      Object.values(speakerCards).forEach((c) => (c.style.outline = ''));
      card.style.outline = `3px solid var(--giallo)`;
    });

    speakerCards[speaker] = card;
    speakersRow.appendChild(card);
  });

  shuffledQuotes.forEach((quoteOwner) => {
    const quoteCard = document.createElement('div');
    quoteCard.className = 'modal';
    quoteCard.style.cursor = 'pointer';
    quoteCard.style.padding = '12px 16px';
    quoteCard.textContent = `"${SPEAKER_QUOTES[quoteOwner]}"`;

    quoteCard.addEventListener('click', () => {
      if (!selectedSpeaker) return;
      pairs[selectedSpeaker] = quoteOwner;
      quoteCard.style.border = '2px solid var(--giallo)';
      speakerCards[selectedSpeaker].style.outline = '';
      selectedSpeaker = null;
    });

    quoteCards[quoteOwner] = quoteCard;
    quotesCol.appendChild(quoteCard);
  });

  const verifyBtn = document.createElement('button');
  verifyBtn.className = 'btn';
  verifyBtn.textContent = 'Verifica';
  verifyBtn.addEventListener('click', () => {
    if (isQuoteMatchComplete(pairs)) {
      error.textContent = '';
      const newState = collectLetter(state, 'scuola', 'L');
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
  scene.appendChild(speakersRow);
  scene.appendChild(quotesCol);
  scene.appendChild(verifyBtn);
  scene.appendChild(error);
  container.appendChild(scene);
  container.appendChild(trayEl);

  renderLetterTray(state.lettersCollected, trayEl);
}
