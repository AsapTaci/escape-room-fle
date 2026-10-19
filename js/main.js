import { renderRoom1 } from './render-room1.js';
import { createInitialState } from './state.mjs';

function renderIntro(container) {
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
    renderRoom1(container, createInitialState(), (s) => console.log('ingresso solved', s));
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
renderIntro(app);
