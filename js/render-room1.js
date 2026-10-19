import { INGRESSO_CODE } from './room1.mjs';
import { renderLockWidget, renderModal } from './ui.mjs';

export function renderRoom1(container, onSolved) {
  container.innerHTML = '';

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-2.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'Ingresso';

  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'Via della Conciliazione, 10 — Roma';

  const plaque = document.createElement('button');
  plaque.className = 'btn';
  plaque.textContent = 'Osserva la targa';
  plaque.addEventListener('click', () => {
    renderModal({
      title: 'Targa commemorativa',
      body: 'È stata costituita nel 1962 da Giovanni Malagodi.',
      container: document.body,
    });
  });

  const lockContainer = document.createElement('div');

  const logo = document.createElement('img');
  logo.className = 'logo-fe';
  logo.src = 'assets/logo.png';
  logo.alt = 'Fondazione Luigi Einaudi';

  scene.appendChild(title);
  scene.appendChild(subtitle);
  scene.appendChild(plaque);
  scene.appendChild(lockContainer);
  scene.appendChild(logo);
  container.appendChild(scene);

  renderLockWidget({ code: INGRESSO_CODE, onSuccess: onSolved, container: lockContainer });
}
