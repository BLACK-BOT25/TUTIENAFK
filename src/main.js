import { alchemy, attackEnemy, breakthrough, cultivate, explore, flee, meditate } from './game/actions.js';
import { clearState, loadState, saveState } from './game/state.js';
import { flashSave, render, toast } from './ui/render.js';

let state = loadState();

const bind = (id, action) => {
  document.getElementById(id).addEventListener('click', () => {
    const result = action(state);
    if (result?.message) toast(result.message);
    persistAndRender();
  });
};

function persistAndRender() {
  flashSave(saveState(state));
  render(state);
}

bind('meditateBtn', meditate);
bind('cultivateBtn', cultivate);
bind('exploreBtn', explore);
bind('alchemyBtn', alchemy);
bind('breakthroughBtn', breakthrough);
bind('attackBtn', attackEnemy);
bind('fleeBtn', flee);

document.querySelectorAll('[data-mobile-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.mobileTab;
    document.querySelectorAll('[data-mobile-tab]').forEach((item) => {
      item.classList.toggle('active', item === button);
    });
    document.querySelectorAll('[data-mobile-panel]').forEach((panel) => {
      panel.classList.toggle('mobile-active', panel.dataset.mobilePanel === target);
      if (panel.dataset.mobilePanel === target) panel.scrollTop = 0;
    });
  });
});

document.getElementById('resetGame').addEventListener('click', () => {
  const confirmed = window.confirm('Xóa toàn bộ tiến độ và bắt đầu lại tiên lộ?');
  if (!confirmed) return;
  clearState();
  state = loadState();
  persistAndRender();
  toast('Tiên lộ đã được làm mới.');
});

render(state);
