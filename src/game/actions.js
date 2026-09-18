import { ENEMIES, EVENTS, REALMS } from './data.js';
import { currentRealm, recalculateStats } from './state.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function addLog(state, text) {
  state.logs.unshift(text);
  state.logs = state.logs.slice(0, 24);
}

export function meditate(state) {
  if (state.combat) return { ok: false, message: 'Đang giao chiến, không thể nhập định.' };
  const p = state.player;
  const qiGain = randomInt(Math.max(7, Math.round(p.maxQi * 0.16)), Math.max(12, Math.round(p.maxQi * 0.27)));
  const cvGain = randomInt(5, 10) + Math.floor(p.spirit / 5);
  p.qi = clamp(p.qi + qiGain, 0, p.maxQi);
  p.cultivation += cvGain;
  p.hp = clamp(p.hp + Math.max(3, Math.round(p.maxHp * 0.05)), 0, p.maxHp);
  addLog(state, `Thổ nạp một chu thiên: +${qiGain} linh khí, +${cvGain} tu vi.`);
  return { ok: true };
}

export function cultivate(state) {
  if (state.combat) return { ok: false, message: 'Kiếm khí chưa tan, chưa thể vận công.' };
  const p = state.player;
  const cost = Math.max(10, Math.round(p.maxQi * 0.22));
  if (p.qi < cost) return { ok: false, message: `Cần ít nhất ${cost} linh khí.` };
  const gain = randomInt(18, 28) + Math.floor(p.spirit * 0.8);
  p.qi -= cost;
  p.cultivation += gain;
  addLog(state, `Vận chuyển công pháp, tiêu ${cost} linh khí và tăng ${gain} tu vi.`);
  return { ok: true };
}

export function alchemy(state) {
  if (state.combat) return { ok: false, message: 'Không thể khai lò khi đang chiến đấu.' };
  const p = state.player;
  if (p.herb < 5 || p.spiritStone < 8) {
    return { ok: false, message: 'Luyện đan cần 5 linh thảo và 8 linh thạch.' };
  }
  p.herb -= 5;
  p.spiritStone -= 8;
  const bonus = Math.random() < Math.min(0.35, p.spirit / 100) ? 2 : 1;
  p.pill += bonus;
  addLog(state, bonus === 2
    ? 'Đan lô khai quang! Một lò song đan: +2 phá cảnh đan.'
    : 'Đan hương lan tỏa: luyện thành 1 phá cảnh đan.');
  return { ok: true };
}

export function explore(state) {
  if (state.combat) return { ok: false, message: 'Hãy kết thúc trận chiến hiện tại.' };
  const roll = Math.random();
  const p = state.player;

  if (roll < 0.52) {
    return startEncounter(state);
  }

  if (roll < 0.72) {
    const amount = randomInt(4, 10) + p.realm;
    p.herb += amount;
    addLog(state, `Men theo linh khí, ngươi hái được ${amount} linh thảo.`);
    return { ok: true };
  }

  if (roll < 0.91) {
    const amount = randomInt(7, 18) + p.realm * 2;
    p.spiritStone += amount;
    addLog(state, `Trong khe núi có một tiểu khoáng mạch: +${amount} linh thạch.`);
    return { ok: true };
  }

  const amount = randomInt(18, 35) + p.spirit;
  p.cultivation += amount;
  addLog(state, `${EVENTS[randomInt(0, EVENTS.length - 1)]} Ngươi lĩnh ngộ được +${amount} tu vi.`);
  return { ok: true };
}

function startEncounter(state) {
  const eligible = ENEMIES.filter((enemy) => enemy.minRealm <= state.player.realm);
  const base = eligible[randomInt(Math.max(0, eligible.length - 3), eligible.length - 1)] ?? eligible[0];
  const realmScale = 1 + Math.max(0, state.player.realm - base.minRealm) * 0.05;
  state.combat = {
    ...structuredClone(base),
    maxHp: Math.round(base.hp * realmScale),
    hp: Math.round(base.hp * realmScale),
    attack: Math.round(base.attack * realmScale),
    defense: Math.round(base.defense * realmScale),
  };
  addLog(state, `Yêu khí nổi lên! ${base.name} chặn đường.`);
  return { ok: true, combat: true };
}

export function attackEnemy(state) {
  if (!state.combat) return { ok: false, message: 'Không có kẻ địch.' };
  const p = state.player;
  const e = state.combat;

  const critChance = Math.min(0.35, 0.08 + p.spirit / 250);
  const crit = Math.random() < critChance;
  const variance = randomInt(-2, 4);
  let damage = Math.max(1, p.attack + variance - e.defense);
  if (crit) damage = Math.round(damage * 1.75);
  e.hp = Math.max(0, e.hp - damage);
  addLog(state, `${crit ? 'Kiếm quang đại thịnh! ' : ''}Ngươi gây ${damage} sát thương lên ${e.name}.`);

  if (e.hp <= 0) {
    const stones = randomInt(...e.stones);
    const herbs = randomInt(...e.herbs);
    p.spiritStone += stones;
    p.herb += herbs;
    p.cultivation += e.cultivation;
    p.wins += 1;
    addLog(state, `Trảm sát ${e.name}: +${stones} linh thạch, +${herbs} linh thảo, +${e.cultivation} tu vi.`);
    state.combat = null;
    return { ok: true, victory: true };
  }

  const incoming = Math.max(1, e.attack + randomInt(-2, 3) - p.defense);
  p.hp = Math.max(0, p.hp - incoming);
  addLog(state, `${e.name} phản kích, ngươi mất ${incoming} khí huyết.`);

  if (p.hp <= 0) {
    const loss = Math.min(p.spiritStone, Math.ceil(p.spiritStone * 0.18));
    p.spiritStone -= loss;
    p.hp = Math.max(1, Math.round(p.maxHp * 0.42));
    p.qi = Math.round(p.maxQi * 0.25);
    state.combat = null;
    addLog(state, `Đạo cơ chấn động! Ngươi trọng thương trở về động phủ, tổn thất ${loss} linh thạch.`);
    return { ok: true, defeated: true };
  }

  return { ok: true };
}

export function flee(state) {
  if (!state.combat) return { ok: false, message: 'Không có trận chiến để rút lui.' };
  if (Math.random() < 0.78) {
    addLog(state, 'Ngự kiếm thoát khỏi chiến trường. Hữu kinh vô hiểm.');
    state.combat = null;
    return { ok: true };
  }

  const e = state.combat;
  const damage = Math.max(1, e.attack - state.player.defense);
  state.player.hp = Math.max(1, state.player.hp - damage);
  addLog(state, `Thoát thân thất bại, bị ${e.name} đánh trúng: -${damage} khí huyết.`);
  return { ok: true };
}

export function breakthrough(state) {
  if (state.combat) return { ok: false, message: 'Đang giao chiến, không thể phá cảnh.' };
  const p = state.player;
  const realm = currentRealm(state);
  if (p.realm >= REALMS.length - 1) return { ok: false, message: 'Prototype hiện đã chạm cảnh giới tối đa.' };
  if (p.cultivation < realm.need) return { ok: false, message: `Tu vi chưa đủ: cần ${realm.need}.` };

  const usePill = p.pill > 0;
  const pillBonus = usePill ? 0.20 : 0;
  if (usePill) p.pill -= 1;
  const chance = Math.min(0.98, realm.chance + pillBonus + Math.min(0.08, p.spirit / 500));

  if (Math.random() <= chance) {
    p.cultivation -= realm.need;
    p.realm += 1;
    recalculateStats(state);
    p.hp = p.maxHp;
    p.qi = p.maxQi;
    addLog(state, `Thiên địa linh khí hội tụ — đột phá thành công! Hiện tại: ${REALMS[p.realm].name}.`);
    return { ok: true, success: true };
  }

  const lost = Math.round(realm.need * 0.16);
  p.cultivation = Math.max(0, p.cultivation - lost);
  p.hp = Math.max(1, Math.round(p.hp * 0.65));
  addLog(state, `Phá cảnh thất bại. Kinh mạch nghịch hành, tổn thất ${lost} tu vi.`);
  return { ok: true, success: false };
}
