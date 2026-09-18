import { REALMS } from '../game/data.js';
import { currentRealm, nextRealm } from '../game/state.js';

const byId = (id) => document.getElementById(id);
const pct = (value, max) => `${Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100))}%`;

export function render(state) {
  const p = state.player;
  const realm = currentRealm(state);
  const next = nextRealm(state);

  byId('realmTitle').textContent = realm.name;
  byId('realmQuote').textContent = realm.quote;
  byId('realmBadge').textContent = realm.short;
  byId('playerName').textContent = p.name;
  byId('combatPlayerName').textContent = p.name;

  byId('spiritStone').textContent = p.spiritStone.toLocaleString('vi-VN');
  byId('herb').textContent = p.herb.toLocaleString('vi-VN');
  byId('pill').textContent = p.pill.toLocaleString('vi-VN');

  byId('hpText').textContent = `${p.hp} / ${p.maxHp}`;
  byId('qiText').textContent = `${p.qi} / ${p.maxQi}`;
  byId('cultivationText').textContent = `${p.cultivation.toLocaleString('vi-VN')} / ${realm.need.toLocaleString('vi-VN')}`;
  byId('hpBar').style.width = pct(p.hp, p.maxHp);
  byId('qiBar').style.width = pct(p.qi, p.maxQi);
  byId('cultivationBar').style.width = pct(p.cultivation, realm.need);

  byId('attackStat').textContent = p.attack;
  byId('defenseStat').textContent = p.defense;
  byId('spiritStat').textContent = p.spirit;
  byId('winsStat').textContent = p.wins;

  if (p.realm >= REALMS.length - 1) {
    byId('nextRealm').textContent = 'Đã chạm giới hạn prototype';
    byId('breakthroughHint').textContent = 'Các cảnh giới cao hơn sẽ được mở rộng ở bản tiếp theo.';
    byId('breakthroughBtn').disabled = true;
  } else {
    byId('nextRealm').textContent = next.name;
    const pillText = p.pill > 0 ? ' Sẽ tự dùng 1 phá cảnh đan.' : ' Có thể luyện phá cảnh đan để tăng xác suất.';
    byId('breakthroughHint').textContent = `Cần ${realm.need.toLocaleString('vi-VN')} tu vi.${pillText}`;
    byId('breakthroughBtn').disabled = p.cultivation < realm.need || Boolean(state.combat);
  }

  renderCombat(state);
  renderLog(state);
}

function renderCombat(state) {
  const panel = byId('combatPanel');
  if (!state.combat) {
    panel.classList.add('hidden');
    return;
  }

  const e = state.combat;
  panel.classList.remove('hidden');
  byId('enemyName').textContent = e.name;
  byId('enemyImage').src = e.image;
  byId('enemyImage').alt = e.name;
  byId('enemyHp').style.width = pct(e.hp, e.maxHp);
  byId('combatPlayerHp').style.width = pct(state.player.hp, state.player.maxHp);
}

function renderLog(state) {
  const log = byId('gameLog');
  log.innerHTML = '';
  state.logs.forEach((entry, index) => {
    const row = document.createElement('p');
    row.className = index === 0 ? 'log-entry newest' : 'log-entry';
    row.textContent = entry;
    log.appendChild(row);
  });
}

export function flashSave(ok) {
  const el = byId('saveState');
  el.textContent = ok ? 'Đã lưu' : 'Không thể lưu';
  el.classList.add('pulse');
  window.setTimeout(() => el.classList.remove('pulse'), 350);
}

export function toast(message) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => el.classList.remove('show'), 1800);
}
