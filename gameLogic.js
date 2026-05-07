/* ═══════════════════════════════════════════
   TOWER OF RELICS — Shared Game Engine
   game.js — load this on every page
═══════════════════════════════════════════ */

'use strict';

// ─── ITEM DATABASE ──────────────────────────────────────────────
const ITEMS = [
  { id:'dagger',   name:'Кинжал',         emoji:'🗡️', cost:3, rarity:'common', dmg:9,  armor:0, heal:0, tag:'вор',     size:[1,1], desc:'Мгновенный удар.',          stat:'⚔ 9 урона'           },
  { id:'sword',    name:'Меч',            emoji:'⚔️', cost:3, rarity:'common', dmg:15, armor:0, heal:0, tag:'воин',    size:[1,2], desc:'Надёжный клинок.',          stat:'⚔ 15 урона'          },
  { id:'bow',      name:'Лук',            emoji:'🏹', cost:3, rarity:'common', dmg:12, armor:0, heal:0, tag:'вор',     size:[2,1], desc:'Дальний урон.',             stat:'⚔ 12 урона'          },
  { id:'shield',   name:'Щит',            emoji:'🛡️', cost:3, rarity:'common', dmg:0,  armor:12,heal:0, tag:'воин',    size:[2,2], desc:'Блокирует урон.',           stat:'🛡 12 брони'         },
  { id:'staff',    name:'Посох Мага',     emoji:'🪄', cost:3, rarity:'rare',   dmg:22, armor:0, heal:0, tag:'маг',     size:[1,3], desc:'Канал тёмной силы.',        stat:'⚔ 22 урона'          },
  { id:'tome',     name:'Фолиант',        emoji:'📖', cost:3, rarity:'rare',   dmg:16, armor:0, heal:0, tag:'маг',     size:[2,1], desc:'Запрещённые знания.',       stat:'⚔ 16 урона'          },
  { id:'potion',   name:'Зелье Жизни',   emoji:'🧪', cost:3, rarity:'rare',   dmg:0,  armor:0, heal:28,tag:'алхимик', size:[1,1], desc:'Лечит на 3-м ходу.',        stat:'💊 +28 HP'            },
  { id:'fireball', name:'Огненный Шар',  emoji:'🔥', cost:3, rarity:'rare',   dmg:28, armor:0, heal:0, tag:'маг',     size:[2,2], desc:'АОЕ-уничтожение.',          stat:'⚔ 28 урона'          },
  { id:'dragon',   name:'Коготь Дракона',emoji:'🐉', cost:3, rarity:'epic',   dmg:40, armor:0, heal:0, tag:'дракон',  size:[2,3], desc:'Ярость древних.',           stat:'⚔ 40 урона'          },
  { id:'amulet',   name:'Амулет Удачи',  emoji:'🔮', cost:3, rarity:'epic',   dmg:0,  armor:0, heal:0, tag:'алхимик', size:[1,1], desc:'Все атаки +6 урона.',       stat:'✨ +6 всем'           },
  { id:'crown',    name:'Корона',         emoji:'👑', cost:3, rarity:'epic',   dmg:0,  armor:6, heal:0, tag:'воин',    size:[2,1], desc:'Воины +8 урона.',           stat:'👑 броня +6, воины +8'},
  { id:'crystal',  name:'Кристалл Льда', emoji:'🔷', cost:3, rarity:'rare',   dmg:14, armor:4, heal:0, tag:'маг',     size:[1,2], desc:'Атака и защита.',           stat:'⚔ 14 · 🛡 4'        },
  { id:'axe',      name:'Боевой Топор',  emoji:'🪓', cost:3, rarity:'rare',   dmg:20, armor:0, heal:0, tag:'воин',    size:[2,2], desc:'Грубая сила.',              stat:'⚔ 20 урона'          },
  { id:'scroll',   name:'Свиток Огня',   emoji:'📜', cost:3, rarity:'common', dmg:10, armor:0, heal:0, tag:'маг',     size:[1,1], desc:'Одноразовая магия.',        stat:'⚔ 10 урона'          },
  { id:'lantern',  name:'Фонарь Духов',  emoji:'🏮', cost:3, rarity:'epic',   dmg:0,  armor:8, heal:15,tag:'алхимик', size:[1,2], desc:'Лечит и защищает.',         stat:'🛡 8 · 💊 15'        },
];

const SYNERGIES = [
  { tag:'маг',     need:2, label:'Маг ×2',     bonus:'Заклинания +35% урон'   },
  { tag:'воин',    need:2, label:'Воин ×2',    bonus:'Броня ×2'               },
  { tag:'вор',     need:2, label:'Вор ×2',     bonus:'Атака ×1.5'             },
  { tag:'алхимик', need:2, label:'Алхимик ×2', bonus:'Зелья ×2 лечение'      },
  { tag:'дракон',  need:1, label:'Дракон',     bonus:'Дракон +15 урона'       },
];

const ENEMIES = [
  { name:'Тёмный Маг',      title:'Повелитель теней',  items:['staff','tome','scroll'],          hp:90  },
  { name:'Рыцарь Бездны',   title:'Страж проклятий',   items:['sword','shield','axe'],           hp:100 },
  { name:'Призрак Теней',   title:'Невидимый убийца',  items:['dagger','bow','dagger'],          hp:80  },
  { name:'Некромант',       title:'Говорящий с мёртвыми', items:['fireball','tome','potion','staff'], hp:110 },
  { name:'Гоблин-алхимик',  title:'Мастер зелий',      items:['potion','crystal','lantern','bow'], hp:95 },
  { name:'Драконий Страж',  title:'Хранитель пламени', items:['dragon','shield','crown'],        hp:120 },
  { name:'Архимаг',         title:'Исчадие знаний',    items:['fireball','staff','tome','crystal','scroll'], hp:130 },
];

// ─── GRID CONSTANTS ─────────────────────────────────────────────
const GRID_COLS = 6, GRID_ROWS = 6;

// ─── SAVE / LOAD ─────────────────────────────────────────────────
const SAVE_KEY = 'tor_save_v2';

function getDefaultState() {
  return {
    gold: 6,
    round: 1,
    wins: 0,
    losses: 0,
    totalDmgDealt: 0,
    totalDmgTaken: 0,
    totalHealed: 0,
    pHP: 100, pMaxHP: 100,
    eHP: 100, eMaxHP: 100,
    playerTower: [],   // [{itemId, col, row, count, isTriple}]
    shop: [],          // [{itemId, sold}]
    frozen: false,
    phase: 'menu',     // 'menu' | 'battle' | 'shop'
  };
}

function saveState(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch(e) { console.warn('Save failed', e); }
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch(e) { return null; }
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

// Hydrate: convert saved {itemId} refs back to full item objects
function hydrateTower(saved) {
  return (saved || []).map(p => {
    const item = ITEMS.find(x => x.id === p.itemId);
    if (!item) return null;
    return {
      item: p.isTriple ? { ...item, dmg: Math.round(item.dmg * 1.9), armor: Math.round(item.armor * 2), heal: Math.round(item.heal * 1.5), stat: item.stat + ' ✦', _tripleBase: true } : { ...item },
      col: p.col, row: p.row,
      count: p.count,
      isTriple: p.isTriple,
    };
  }).filter(Boolean);
}

function dehydrateTower(tower) {
  return tower.map(p => ({
    itemId: p.item.id,
    col: p.col, row: p.row,
    count: p.count,
    isTriple: p.isTriple,
  }));
}

function hydrateShop(saved) {
  return (saved || []).map(s => {
    const item = ITEMS.find(x => x.id === s.itemId);
    if (!item) return null;
    return { ...item, sold: s.sold };
  }).filter(Boolean);
}

function dehydrateShop(shop) {
  return shop.map(s => ({ itemId: s.id, sold: s.sold || false }));
}

// ─── GRID HELPERS ───────────────────────────────────────────────
function gridOccupied(tower, skipIdx = -1) {
  const occ = new Set();
  tower.forEach((p, i) => {
    if (i === skipIdx) return;
    const [sc, sr] = p.item.size;
    for (let c = p.col; c < p.col + sc; c++)
      for (let r = p.row; r < p.row + sr; r++)
        occ.add(`${c},${r}`);
  });
  return occ;
}

function findFreeSlot(tower, size, skipIdx = -1) {
  const [sc, sr] = size;
  const occ = gridOccupied(tower, skipIdx);
  for (let r = 0; r <= GRID_ROWS - sr; r++) {
    for (let c = 0; c <= GRID_COLS - sc; c++) {
      let fits = true;
      outer: for (let dc = 0; dc < sc; dc++)
        for (let dr = 0; dr < sr; dr++)
          if (occ.has(`${c + dc},${r + dr}`)) { fits = false; break outer; }
      if (fits) return [c, r];
    }
  }
  return null;
}

function usedSlots(tower) {
  return tower.reduce((s, p) => s + p.item.size[0] * p.item.size[1], 0);
}

// ─── SYNERGY CALC ───────────────────────────────────────────────
function getSynergies(tower) {
  const tags = {};
  tower.forEach(p => { tags[p.item.tag] = (tags[p.item.tag] || 0) + 1; });
  return SYNERGIES.map(s => ({ ...s, count: tags[s.tag] || 0, active: (tags[s.tag] || 0) >= s.need }));
}

function applyBonuses(tower) {
  let items = tower.map(p => ({
    ...p.item,
    _dmg:   p.item.dmg,
    _armor: p.item.armor,
    _heal:  p.item.heal,
    isTriple: p.isTriple,
  }));
  const tags = {};
  tower.forEach(p => tags[p.item.tag] = (tags[p.item.tag] || 0) + 1);

  if ((tags['маг']     || 0) >= 2) items.filter(i => i.tag === 'маг').forEach(i => i._dmg = Math.round(i._dmg * 1.35));
  if ((tags['воин']    || 0) >= 2) items.filter(i => i._armor > 0).forEach(i => i._armor *= 2);
  if ((tags['вор']     || 0) >= 2) items.filter(i => i.tag === 'вор').forEach(i => i._dmg = Math.round(i._dmg * 1.5));
  if ((tags['дракон']  || 0) >= 1) items.filter(i => i.tag === 'дракон').forEach(i => i._dmg += 15);
  if ((tags['алхимик'] || 0) >= 2) items.filter(i => i._heal > 0).forEach(i => i._heal *= 2);
  if (items.find(i => i.id === 'amulet'))  items.forEach(i => { if (i._dmg > 0) i._dmg += 6; });
  if (items.find(i => i.id === 'crown'))   items.filter(i => i.tag === 'воин' && i._dmg > 0).forEach(i => i._dmg += 8);

  return items;
}

// ─── DPS CALCULATOR ─────────────────────────────────────────────
/**
 * Returns { dps, totalDmg, totalArmor, totalHeal, avgPerHit }
 * Based on 12 ticks per battle, one attack burst per tick
 */
function calcDPS(tower) {
  const items = applyBonuses(tower);
  const totalDmg   = items.reduce((s, i) => s + i._dmg,   0);
  const totalArmor = items.reduce((s, i) => s + i._armor,  0);
  const totalHeal  = items.reduce((s, i) => s + i._heal,   0);
  // Average hits per tick (variance: ±4)
  const avgPerHit  = totalDmg;
  // DPS = average dmg per tick (1 tick ≈ 0.6s)
  const dps        = +(totalDmg / 0.6).toFixed(1);
  return { dps, totalDmg, totalArmor, totalHeal, avgPerHit };
}

// ─── GRID RENDERER ──────────────────────────────────────────────
/**
 * Renders an inventory grid into a container element.
 * interactive: if true, right-click sells (calls onSell(idx))
 */
function renderInvGrid(container, tower, interactive, onSell) {
  container.innerHTML = '';
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${GRID_ROWS}, 1fr)`;
  container.style.gap = '3px';

  // Background slot cells
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'inv-cell';
      cell.style.gridColumn = `${c + 1}`;
      cell.style.gridRow    = `${r + 1}`;
      container.appendChild(cell);
    }
  }

  // Items on top
  tower.forEach((p, idx) => {
    const [sc, sr] = p.item.size;
    const el = document.createElement('div');
    el.className = [
      'inv-item',
      `size-${sc}x${sr}`,
      p.isTriple ? 'triple' : '',
      p.item.rarity === 'rare' ? 'rare' : '',
      p.item.rarity === 'epic' ? 'epic' : '',
    ].filter(Boolean).join(' ');

    el.style.gridColumn = `${p.col + 1} / span ${sc}`;
    el.style.gridRow    = `${p.row + 1} / span ${sr}`;
    el.style.zIndex = '2';

    const statStr = p.item.dmg > 0 ? `⚔ ${p.item.dmg}` : p.item.armor > 0 ? `🛡 ${p.item.armor}` : p.item.heal > 0 ? `💊 ${p.item.heal}` : '';
    el.innerHTML = `
      <div class="ii-emoji">${p.item.emoji}</div>
      <div class="ii-name">${p.item.name}${p.isTriple ? ' ✦' : ''}</div>
      ${statStr ? `<div class="ii-stat">${statStr}</div>` : ''}
    `;

    if (interactive && onSell) {
      el.style.cursor = 'pointer';
      el.oncontextmenu = e => { e.preventDefault(); onSell(idx); };
    }

    // Tooltip
    el.onmouseenter = e => showTooltip(e, p.item.name,
      `${p.item.stat}${p.isTriple ? ' ✦ Легенда' : ''}  ·  ${p.item.desc}` +
      `\nТэг: ${p.item.tag}` +
      (interactive ? '\n[ПКМ — продать за 1 🪙]' : '')
    );
    el.onmouseleave = hideTooltip;

    container.appendChild(el);
  });
}

// ─── SYNERGY RENDERER ───────────────────────────────────────────
function renderSynRow(container, tower) {
  const syns = getSynergies(tower);
  container.innerHTML = syns.map(s =>
    `<span class="syn-tag${s.active ? ' active' : ''}" title="${s.bonus}">
      ${s.label}${s.active ? ' ✓' : ` ${s.count}/${s.need}`}
    </span>`
  ).join('');
}

// ─── SHOP ROLL ──────────────────────────────────────────────────
function rollShopItems(existingShop, frozen) {
  if (frozen && existingShop.length) return existingShop.map(i => ({ ...i, sold: false }));
  const pool = [...ITEMS];
  const result = [];
  for (let i = 0; i < 5; i++) {
    if (!pool.length) break;
    const idx = Math.floor(Math.random() * pool.length);
    result.push({ ...pool[idx], sold: false });
    pool.splice(idx, 1);
  }
  return result;
}

// ─── TOOLTIP ────────────────────────────────────────────────────
function showTooltip(e, title, body) {
  let tip = document.getElementById('tooltip');
  if (!tip) { tip = document.createElement('div'); tip.id = 'tooltip'; document.body.appendChild(tip); }
  tip.innerHTML = `<strong>${title}</strong><br>${(body || '').replace(/\n/g, '<br>')}`;
  tip.style.display = 'block';
  tip.style.left = (e.clientX + 14) + 'px';
  tip.style.top  = Math.min(e.clientY - 10, window.innerHeight - 120) + 'px';
}

function hideTooltip() {
  const tip = document.getElementById('tooltip');
  if (tip) tip.style.display = 'none';
}

// ─── NAV HELPERS ────────────────────────────────────────────────
function navigate(page) {
  window.location.href = page;
}

// ─── RNG ────────────────────────────────────────────────────────
function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function delay(ms)  { return new Promise(r => setTimeout(r, ms)); }

// ─── DPS STRIP RENDER ───────────────────────────────────────────
function renderDPSStrip(container, tower) {
  const { dps, totalDmg, totalArmor, totalHeal } = calcDPS(tower);
  container.innerHTML = `
    <div class="dps-item">⚔ ДПС <span class="dps-val">${dps}</span></div>
    <div class="dps-item">💥 Урон/тик <span class="dps-val">${totalDmg}</span></div>
    <div class="dps-item">🛡 Броня <span class="dps-val${totalArmor > 0 ? ' green' : ''}">${totalArmor}</span></div>
    <div class="dps-item">💊 Лечение <span class="dps-val${totalHeal > 0 ? ' green' : ''}">${totalHeal}</span></div>
  `;
}
