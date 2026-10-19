import { renderRoom1 } from './render-room1.js';
import { renderRoom2 } from './render-room2.js';
import { renderRoom3 } from './render-room3.js';
import { renderRoom4 } from './render-room4.js';
import { renderRoom5 } from './render-room5.js';
import { renderRoom6 } from './render-room6.js';
import { renderFinale } from './render-finale.js';
import { loadState, saveState } from './state.mjs';

const ROOM_SEQUENCE = ['ingresso', 'scuola', 'presidenti', 'archivio', 'biblioteca', 'mappa', 'finale'];

const ROOM_RENDERERS = {
  ingresso: renderRoom1,
  scuola: renderRoom2,
  presidenti: renderRoom3,
  archivio: renderRoom4,
  biblioteca: renderRoom5,
  mappa: renderRoom6,
  finale: renderFinale,
};

function nextRoomAfter(roomId) {
  return ROOM_SEQUENCE[ROOM_SEQUENCE.indexOf(roomId) + 1];
}

function renderCurrentRoom(container, state) {
  const renderer = ROOM_RENDERERS[state.currentRoom];
  const isFinale = state.currentRoom === 'finale';

  renderer(container, state, (newState) => {
    if (isFinale) {
      // renderFinale already shows the victory screen itself.
      saveState(newState, localStorage);
      return;
    }
    const advancedState = { ...newState, currentRoom: nextRoomAfter(state.currentRoom) };
    saveState(advancedState, localStorage);
    renderCurrentRoom(container, advancedState);
  });
}

function renderIntro(container, state) {
  container.innerHTML = '';

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-1.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'Escape Room';

  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'Fondazione Luigi Einaudi';

  const startBtn = document.createElement('button');
  startBtn.className = 'btn';
  startBtn.textContent = 'Comincia';
  startBtn.addEventListener('click', () => {
    renderCurrentRoom(container, state);
  });

  const logo = document.createElement('img');
  logo.className = 'logo-fe';
  logo.src = 'assets/logo.png';
  logo.alt = 'Fondazione Luigi Einaudi';

  scene.appendChild(title);
  scene.appendChild(subtitle);
  scene.appendChild(startBtn);
  scene.appendChild(logo);
  container.appendChild(scene);
}

const app = document.getElementById('app');
const initialState = loadState(localStorage);

if (initialState.currentRoom === 'ingresso') {
  renderIntro(app, initialState);
} else {
  renderCurrentRoom(app, initialState);
}
