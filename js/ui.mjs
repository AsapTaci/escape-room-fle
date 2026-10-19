import { isCodeMatch } from './state.mjs';

export function renderLockWidget({ code, onSuccess, container }) {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'lock-widget';

  const row = document.createElement('div');
  row.className = 'lock-widget__row';

  const input = document.createElement('input');
  input.className = 'lock-widget__input';
  input.type = 'text';
  input.placeholder = 'Inserisci il codice';

  const button = document.createElement('button');
  button.className = 'btn';
  button.textContent = 'Apri';

  const error = document.createElement('div');
  error.className = 'lock-widget__error';

  function attempt() {
    if (isCodeMatch(input.value, code)) {
      error.textContent = '';
      onSuccess();
    } else {
      error.textContent = 'Non è questo…';
    }
  }

  button.addEventListener('click', attempt);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attempt();
  });

  row.appendChild(input);
  row.appendChild(button);
  wrapper.appendChild(row);
  wrapper.appendChild(error);
  container.appendChild(wrapper);
}

export function renderLetterTray(lettersCollected, container) {
  container.innerHTML = '';
  container.className = 'letter-tray';

  const letters = Object.values(lettersCollected);
  const slotCount = Math.max(letters.length, 5);

  for (let i = 0; i < slotCount; i++) {
    const slot = document.createElement('div');
    const letter = letters[i];
    slot.className = letter ? 'letter-tray__slot letter-tray__slot--filled' : 'letter-tray__slot';
    slot.textContent = letter || '';
    container.appendChild(slot);
  }
}

export function renderModal({ title, body, container }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'modal';

  const h3 = document.createElement('h3');
  h3.textContent = title;

  const p = document.createElement('p');
  p.textContent = body;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn';
  closeBtn.textContent = 'Chiudi';
  closeBtn.addEventListener('click', () => backdrop.remove());

  modal.appendChild(h3);
  modal.appendChild(p);
  modal.appendChild(closeBtn);
  backdrop.appendChild(modal);
  container.appendChild(backdrop);
}
