// Cinder Court's painter: every pixel of the table, the hands, the cards and the
// title, win and loss screens, drawn on one canvas with plain 2D shapes.
import { VIEW } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_WIN = 'win';
export const SCREEN_LOSS = 'loss';

const HAND_W = 112;
const HAND_H = 152;
const TABLE_W = 96;
const TABLE_H = 128;
const BACK_W = 56;
const BACK_H = 76;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** The icon each card type wears: a small canvas glyph, drawn, never an image. */
export function drawIcon(ctx, icon, cx, cy, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, size * 0.08);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const s = size / 2;
  if (icon === 'flame') {
    ctx.beginPath();
    ctx.moveTo(cx, cy - s);
    ctx.bezierCurveTo(cx + s * 0.9, cy - s * 0.2, cx + s * 0.7, cy + s * 0.7, cx, cy + s * 0.8);
    ctx.bezierCurveTo(cx - s * 0.7, cy + s * 0.7, cx - s * 0.9, cy - s * 0.2, cx, cy - s);
    ctx.fill();
    ctx.fillStyle = '#fff3d6';
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.1);
    ctx.bezierCurveTo(cx + s * 0.4, cy + s * 0.3, cx + s * 0.3, cy + s * 0.6, cx, cy + s * 0.6);
    ctx.bezierCurveTo(cx - s * 0.3, cy + s * 0.6, cx - s * 0.4, cy + s * 0.3, cx, cy - s * 0.1);
    ctx.fill();
  } else if (icon === 'paw') {
    ctx.beginPath();
    ctx.ellipse(cx, cy + s * 0.35, s * 0.55, s * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    for (const [dx, dy] of [[-0.55, -0.35], [0, -0.55], [0.55, -0.35]]) {
      ctx.beginPath();
      ctx.arc(cx + dx * s, cy + dy * s, s * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (icon === 'sword') {
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.15, cy + s * 0.75);
    ctx.lineTo(cx + s * 0.55, cy - s * 0.55);
    ctx.lineTo(cx + s * 0.75, cy - s * 0.35);
    ctx.lineTo(cx + s * 0.05, cy + s * 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.5, cy + s * 0.35);
    ctx.lineTo(cx + s * 0.35, cy - s * 0.5);
    ctx.lineWidth = s * 0.22;
    ctx.stroke();
  } else if (icon === 'wing') {
    ctx.beginPath();
    ctx.moveTo(cx - s, cy + s * 0.5);
    ctx.quadraticCurveTo(cx - s * 0.2, cy - s, cx + s, cy - s * 0.7);
    ctx.quadraticCurveTo(cx + s * 0.2, cy - s * 0.1, cx - s * 0.1, cy + s * 0.3);
    ctx.quadraticCurveTo(cx - s * 0.5, cy + s * 0.1, cx - s, cy + s * 0.5);
    ctx.fill();
  } else if (icon === 'bolt') {
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.2, cy - s);
    ctx.lineTo(cx - s * 0.5, cy + s * 0.1);
    ctx.lineTo(cx - s * 0.05, cy + s * 0.1);
    ctx.lineTo(cx - s * 0.2, cy + s);
    ctx.lineTo(cx + s * 0.5, cy - s * 0.1);
    ctx.lineTo(cx + s * 0.05, cy - s * 0.1);
    ctx.closePath();
    ctx.fill();
  } else if (icon === 'leaf') {
    ctx.beginPath();
    ctx.moveTo(cx, cy - s);
    ctx.quadraticCurveTo(cx + s, cy - s * 0.2, cx, cy + s);
    ctx.quadraticCurveTo(cx - s, cy - s * 0.2, cx, cy - s);
    ctx.fill();
    ctx.strokeStyle = '#fff3d6';
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.6);
    ctx.lineTo(cx, cy + s * 0.7);
    ctx.stroke();
  } else if (icon === 'eye') {
    ctx.beginPath();
    ctx.ellipse(cx, cy, s, s * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1210';
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** One face-up card at (x, y) with the given size; `lift` raises it when hovered. */
export function drawCard(ctx, card, x, y, w, h, lift, selected) {
  const top = y - (lift ? 18 : 0);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, x, top, w, h, 10);
  ctx.fillStyle = '#f7ead2';
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = selected ? 4 : 2;
  ctx.strokeStyle = selected ? '#ffd60a' : card.dark;
  ctx.stroke();
  // Cost gem, top left.
  ctx.beginPath();
  ctx.arc(x + 16, top + 16, 13, 0, Math.PI * 2);
  ctx.fillStyle = '#3a6ea5';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#dbeafe';
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(card.cost), x + 16, top + 17);
  // Name banner.
  ctx.fillStyle = card.color;
  roundRect(ctx, x + 6, top + 34, w - 12, 20, 5);
  ctx.fill();
  ctx.fillStyle = '#1a1210';
  ctx.font = 'bold 12px Georgia, serif';
  ctx.fillText(card.name, x + w / 2, top + 45);
  // Art box with the type icon.
  ctx.fillStyle = '#2b1a12';
  roundRect(ctx, x + 8, top + 58, w - 16, h - 96, 6);
  ctx.fill();
  drawIcon(ctx, card.icon, x + w / 2, top + 58 + (h - 96) / 2, Math.min(w - 32, h - 110), card.color);
  // Rules text, squeezed to fit between the art box and the pips.
  ctx.fillStyle = '#3d2b1f';
  ctx.font = 'italic 10px Georgia, serif';
  ctx.fillText(card.text, x + w / 2, top + h - 32, w - 16);
  // Attack and health pips for creatures.
  if (card.kind === 'creature') {
    ctx.fillStyle = '#d62828';
    ctx.beginPath();
    ctx.arc(x + 16, top + h - 16, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillText(String(card.attack), x + 16, top + h - 15);
    ctx.fillStyle = '#2a9d3f';
    ctx.beginPath();
    ctx.arc(x + w - 16, top + h - 16, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(card.health), x + w - 16, top + h - 15);
  }
  ctx.restore();
}

/** One face-down card back. */
export function drawCardBack(ctx, x, y, w, h) {
  roundRect(ctx, x, y, w, h, 8);
  ctx.fillStyle = '#5c1a1a';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#d4a017';
  ctx.stroke();
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#d4a017';
  const s = Math.min(w, h) * 0.22;
  ctx.fillRect(-s / 2, -s / 2, s, s);
  ctx.restore();
}

/** A life total: a big number and a bar, labelled for the side that owns it. */
function drawLife(ctx, x, y, label, life, maxLife) {
  ctx.fillStyle = '#f7ead2';
  ctx.font = 'bold 13px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, x, y);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px Georgia, serif';
  ctx.fillText(String(life), x, y + 44);
  ctx.fillStyle = '#3a2a1e';
  roundRect(ctx, x + 62, y + 14, 130, 14, 7);
  ctx.fill();
  ctx.fillStyle = life <= 5 ? '#d62828' : '#2a9d3f';
  const width = Math.max(0, Math.min(1, life / maxLife)) * 130;
  if (width > 0) {
    roundRect(ctx, x + 62, y + 14, width, 14, 7);
    ctx.fill();
  }
}

/** Ember crystals: filled pips for the ember a side can spend this turn. */
function drawEmber(ctx, x, y, ember, maxEmber) {
  ctx.fillStyle = '#f7ead2';
  ctx.font = 'bold 13px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('EMBER', x, y);
  for (let index = 0; index < maxEmber; index += 1) {
    const cx = x + 8 + index * 20;
    ctx.beginPath();
    ctx.moveTo(cx, y + 10);
    ctx.lineTo(cx + 7, y + 18);
    ctx.lineTo(cx, y + 26);
    ctx.lineTo(cx - 7, y + 18);
    ctx.closePath();
    ctx.fillStyle = index < ember ? '#3a9bdc' : '#4a3a2c';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#9fc7e8';
    ctx.stroke();
  }
}

/** The table: dark wood, a felt centre, and a faint ember glow. */
function drawTable(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW.height);
  gradient.addColorStop(0, '#241610');
  gradient.addColorStop(0.5, '#3a1f14');
  gradient.addColorStop(1, '#241610');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  ctx.fillStyle = '#1d4d2b';
  roundRect(ctx, 60, 150, VIEW.width - 120, 330, 24);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#d4a017';
  ctx.stroke();
  ctx.strokeStyle = 'rgba(212,160,23,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(640, 170);
  ctx.lineTo(640, 460);
  ctx.stroke();
}

/** The end-turn button, bottom right of the felt. */
export function endTurnRect() {
  return { x: 1130, y: 360, w: 120, h: 52 };
}

function drawEndTurn(ctx, active) {
  const rect = endTurnRect();
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 10);
  ctx.fillStyle = active ? '#d4a017' : '#6b5a44';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#f7ead2';
  ctx.stroke();
  ctx.fillStyle = '#1a1210';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('END TURN', rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
}

/** A row of table creatures, centred on the given y. */
function drawTableRow(ctx, creatures, y) {
  const total = creatures.length * (TABLE_W + 12) - 12;
  let x = (VIEW.width - total) / 2;
  for (const creature of creatures) {
    drawCard(ctx, creature, x, y, TABLE_W, TABLE_H, false, false);
    x += TABLE_W + 12;
  }
}

/** A fanned hand of face-up cards along the bottom, hovered card raised. */
export function handRects(game) {
  const hand = game.player.hand;
  const rects = [];
  const overlap = hand.length > 1 ? Math.min(HAND_W - 8, (HAND_W * hand.length - 900) / Math.max(1, hand.length - 1)) : 0;
  const step = HAND_W - Math.max(0, overlap);
  const total = hand.length * HAND_W - (hand.length - 1) * Math.max(0, overlap);
  let x = (VIEW.width - total) / 2;
  for (let index = 0; index < hand.length; index += 1) {
    rects.push({ x, y: VIEW.height - HAND_H - 8, w: HAND_W, h: HAND_H, index });
    x += step;
  }
  return rects;
}

function drawHand(ctx, game, ui) {
  const rects = handRects(game);
  for (const rect of rects) {
    const card = game.player.hand[rect.index];
    const hovered = ui.hover === rect.index;
    const selected = game.selected === rect.index;
    const affordable = card.cost <= game.player.ember && game.active === 'player';
    if (!affordable) {
      ctx.save();
      ctx.globalAlpha = 0.75;
      drawCard(ctx, card, rect.x, rect.y, rect.w, rect.h, hovered, selected);
      ctx.restore();
    } else {
      drawCard(ctx, card, rect.x, rect.y, rect.w, rect.h, hovered, selected);
    }
  }
}

/** The whole play screen: both sides, both tables, the hand and the message. */
function drawPlay(ctx, game, ui) {
  drawTable(ctx);
  // Enemy side, top.
  drawLife(ctx, 40, 26, 'ASHWICK, THE CINDER WARDEN', game.enemy.life, 30);
  drawEmber(ctx, 40, 78, game.enemy.ember, game.enemy.maxEmber);
  ctx.fillStyle = '#f7ead2';
  ctx.font = '13px Georgia, serif';
  ctx.textAlign = 'right';
  ctx.fillText(`Deck ${game.enemy.deck.length}  ·  Turn ${game.turn}`, VIEW.width - 40, 30);
  // Enemy hand, face down, fanned across the top centre.
  const backs = game.enemy.hand.length;
  const backStep = 62;
  const backTotal = backs * BACK_W - (backs - 1) * (BACK_W - backStep + 6);
  let bx = (VIEW.width - Math.max(BACK_W, backTotal)) / 2;
  for (let index = 0; index < backs; index += 1) {
    drawCardBack(ctx, bx, 14, BACK_W, BACK_H);
    bx += backStep;
  }
  drawTableRow(ctx, game.enemy.table, 176);
  drawTableRow(ctx, game.player.table, 336);
  // Player side, bottom.
  drawLife(ctx, 40, 516, 'YOU, THE EMBER THIEF', game.player.life, 30);
  drawEmber(ctx, 40, 568, game.player.ember, game.player.maxEmber);
  ctx.fillStyle = '#f7ead2';
  ctx.font = '13px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Deck ${game.player.deck.length}  ·  Cards played ${game.cardsPlayed}`, 40, 616);
  drawHand(ctx, game, ui);
  drawEndTurn(ctx, game.active === 'player' && game.phase === 'play');
  // Turn banner and the last message.
  ctx.fillStyle = game.active === 'player' ? '#ffd60a' : '#ff8c42';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(game.active === 'player' ? 'YOUR TURN — play a card, then end your turn' : 'THE WARDEN IS THINKING…', VIEW.width / 2, 498);
  ctx.fillStyle = '#f7ead2';
  ctx.font = 'italic 14px Georgia, serif';
  ctx.fillText(game.message, VIEW.width / 2, 522);
}

/** The title screen: name, promise, and how to play. */
function drawTitle(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW.height);
  gradient.addColorStop(0, '#1c0f08');
  gradient.addColorStop(0.55, '#3a1f14');
  gradient.addColorStop(1, '#1c0f08');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  drawIcon(ctx, 'flame', 640, 130, 90, '#ff8c42');
  ctx.fillStyle = '#ffd60a';
  ctx.font = 'bold 84px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('CINDER COURT', 640, 260);
  ctx.fillStyle = '#f7ead2';
  ctx.font = 'italic 26px Georgia, serif';
  ctx.fillText('An ember duel of cards', 640, 306);
  ctx.font = '17px Georgia, serif';
  const lines = [
    'You and the Warden start at 20 life. Each turn you gain an ember crystal and draw a card.',
    'Creatures take the table and strike at the end of your turn. Spells hit at once.',
    'Reduce Ashwick to 0 life before your own embers gutter out.',
  ];
  lines.forEach((line, index) => ctx.fillText(line, 640, 380 + index * 30));
  ctx.fillStyle = '#ffd60a';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText('Click or press Enter to play', 640, 520);
  ctx.fillStyle = '#c9b8a3';
  ctx.font = '14px Georgia, serif';
  ctx.fillText('Mouse or keys 1–7 to pick a card · Enter ends the turn · a complete original game', 640, 560);
}

/** The win and loss screens: the verdict and the run's numbers. */
function drawEnd(ctx, game, won) {
  drawTable(ctx);
  ctx.fillStyle = 'rgba(10,6,4,0.72)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  ctx.fillStyle = won ? '#ffd60a' : '#e4572e';
  ctx.font = 'bold 92px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(won ? 'VICTORY' : 'DEFEAT', 640, 280);
  ctx.fillStyle = '#f7ead2';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText(game.message, 640, 330);
  ctx.font = '19px Georgia, serif';
  const stats = `Turns ${game.turn}  ·  Cards played ${game.cardsPlayed}  ·  Damage dealt ${game.damageDealt}  ·  Your life ${game.player.life}  ·  Warden's life ${game.enemy.life}`;
  ctx.fillText(stats, 640, 390);
  ctx.fillStyle = '#ffd60a';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillText('Press Enter to play again', 640, 460);
}

/** Draw the game for its current phase. */
export function drawGame(ctx, game, ui) {
  ctx.clearRect(0, 0, VIEW.width, VIEW.height);
  if (game.phase === 'title') drawTitle(ctx);
  else if (game.phase === 'win') drawEnd(ctx, game, true);
  else if (game.phase === 'loss') drawEnd(ctx, game, false);
  else drawPlay(ctx, game, ui);
}
