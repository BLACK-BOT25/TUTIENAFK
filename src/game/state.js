import { REALMS } from './data.js';

const STORAGE_KEY = 'tu-tien-van-dao-save-v1';

export function createInitialState() {
  return {
    version: 1,
    player: {
      name: 'Vô Danh',
      realm: 0,
      hp: 100,
      maxHp: 100,
      qi: 50,
      maxQi: 50,
      cultivation: 0,
      attack: 10,
      defense: 4,
      spirit: 8,
      spiritStone: 12,
      herb: 3,
      pill: 0,
      wins: 0,
    },
    combat: null,
    logs: [
      'Ngươi tỉnh lại trong một động phủ vô danh.',
      'Ngoài cửa động, mây trôi qua tiên sơn. Con đường trường sinh bắt đầu.',
    ],
  };
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    if (!parsed?.player || parsed.version !== 1) return createInitialState();
    return parsed;
  } catch {
    return createInitialState();
  }
}

export function clearState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

export function currentRealm(state) {
  return REALMS[Math.min(state.player.realm, REALMS.length - 1)];
}

export function nextRealm(state) {
  return REALMS[Math.min(state.player.realm + 1, REALMS.length - 1)];
}

export function recalculateStats(state) {
  const realm = currentRealm(state);
  const m = realm.stat;
  state.player.maxHp = Math.round(100 * m);
  state.player.maxQi = Math.round(50 * m);
  state.player.attack = Math.round(10 * m);
  state.player.defense = Math.round(4 * m);
  state.player.spirit = Math.round(8 * m);
  state.player.hp = Math.min(state.player.hp, state.player.maxHp);
  state.player.qi = Math.min(state.player.qi, state.player.maxQi);
}
