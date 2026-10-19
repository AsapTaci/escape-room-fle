import { PRESIDENT_ORDER, isPresidentOrderCorrect } from './room3.mjs';
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

export function renderRoom3(container, state, onSolved) {
  container.innerHTML = '';

  let order = shuffle(PRESIDENT_ORDER);

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.style.backgroundImage = "url('assets/sede-4.jpg')";

  const title = document.createElement('h1');
  title.className = 'poster-title';
  title.textContent = 'Galleria dei Presidenti';
  const subtitle = document.createElement('p');
  subtitle.className = 'poster-subtitle';
  subtitle.textContent = 'Dal 1962 a oggi';

  const list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '8px';
  list.style.maxWidth = '480px';
  list.style.width = '100%';

  const error = document.createElement('div');
  error.className = 'lock-widget__error';

  function renderList() {
    list.innerHTML = '';
    order.forEach((name, index) => {
      const row = document.createElement('div');
      row.className = 'modal';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.padding = '10px 16px';

      const nameEl = document.createElement('span');
      nameEl.textContent = name;

      const btns = document.createElement('div');
      const up = document.createElement('button');
      up.className = 'btn';
      up.textContent = '↑';
      up.style.padding = '6px 14px';
      up.disabled = index === 0;
      up.addEventListener('click', () => {
        [order[index - 1], order[index]] = [order[index], order[index - 1]];
        renderList();
      });

      const down = document.createElement('button');
      down.className = 'btn';
      down.textContent = '↓';
      down.style.padding = '6px 14px';
      down.style.marginLeft = '8px';
      down.disabled = index === order.length - 1;
      down.addEventListener('click', () => {
        [order[index], order[index + 1]] = [order[index + 1], order[index]];
        renderList();
      });

      btns.appendChild(up);
      btns.appendChild(down);
      row.appendChild(nameEl);
      row.appendChild(btns);
      list.appendChild(row);
    });
  }
  renderList();

  const verifyBtn = document.createElement('button');
  verifyBtn.className = 'btn';
  verifyBtn.textContent = 'Verifica ordine';
  verifyBtn.addEventListener('click', () => {
    if (isPresidentOrderCorrect(order)) {
      error.textContent = '';
      const newState = collectLetter(state, 'presidenti', 'U');
      saveState(newState, getSafeStorage());
      renderLetterTray(newState.lettersCollected, trayEl);
      onSolved(newState);
    } else {
      error.textContent = "L'ordine non è ancora giusto…";
    }
  });

  const trayEl = document.createElement('div');

  scene.appendChild(title);
  scene.appendChild(subtitle);
  scene.appendChild(list);
  scene.appendChild(verifyBtn);
  scene.appendChild(error);
  container.appendChild(scene);
  container.appendChild(trayEl);

  renderLetterTray(state.lettersCollected, trayEl);
}
