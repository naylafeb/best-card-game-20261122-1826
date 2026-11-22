// Cinder Court's entry point: the canvas, the loop, the wiring between input, the
// rules and the painter. ?shot=title|play|win|loss stages one screenshot scene
// instead of the title screen; window.__shotReady tells the shot script it is drawn.
import { VIEW } from './config.js';
import { playEnemyTurn } from './ai.js';
import { handleClick, handleKey } from './input.js';
import { drawGame, handRects } from './render.js';
import { stageShot } from './shots.js';
import { soundAttack, soundDamage, soundLoss, soundPlayCard, soundWin, unlockSound } from './sound.js';
import {
  PHASE_LOSS, PHASE_PLAY, PHASE_TITLE, PHASE_WIN,
  createGame, endEnemyTurn, startTurn,
} from './state.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = VIEW.width;
canvas.height = VIEW.height;

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const seed = Number.parseInt(params.get('seed') ?? '7', 10) || 7;

let game = shotName ? stageShot(shotName, seed) : createGame(seed);
let enemyTimer = 0;
let lastPhase = game.phase;

game.restart = () => {
  game = createGame(seed + 1);
  game.phase = PHASE_PLAY;
  startTurn(game, game.player);
  lastPhase = game.phase;
};

function toBoard(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (VIEW.width / rect.width),
    y: (event.clientY - rect.top) * (VIEW.height / rect.height),
  };
}

canvas.addEventListener('mousemove', (event) => {
  const point = toBoard(event);
  const index = game.phase === PHASE_PLAY ? hoverIndex(point.x, point.y) : -1;
  game.hover = index;
});

canvas.addEventListener('click', (event) => {
  unlockSound();
  const point = toBoard(event);
  const before = game.cardsPlayed;
  handleClick(game, point.x, point.y);
  if (game.cardsPlayed > before) soundPlayCard();
});

window.addEventListener('keydown', (event) => {
  if (['Enter', ' ', 'ArrowLeft', 'ArrowRight'].includes(event.key)) event.preventDefault();
  unlockSound();
  const before = game.cardsPlayed;
  handleKey(game, event.key);
  if (game.cardsPlayed > before) soundPlayCard();
});

/** The hand card under a point, for the hover lift. */
function hoverIndex(x, y) {
  const rects = handRects(game);
  for (let index = rects.length - 1; index >= 0; index -= 1) {
    const rect = rects[index];
    if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
      return index;
    }
  }
  return -1;
}

function frame(time) {
  // The enemy thinks briefly, then plays: a pause the player can see.
  if (game.phase === PHASE_PLAY && game.active === 'enemy') {
    if (enemyTimer === 0) enemyTimer = time;
    if (time - enemyTimer > 800) {
      enemyTimer = 0;
      const beforeLife = game.player.life;
      playEnemyTurn(game);
      endEnemyTurn(game);
      if (game.player.life < beforeLife) soundDamage();
      else soundAttack();
    }
  } else {
    enemyTimer = 0;
  }
  if (game.phase === PHASE_WIN && lastPhase !== PHASE_WIN) soundWin();
  if (game.phase === PHASE_LOSS && lastPhase !== PHASE_LOSS) soundLoss();
  lastPhase = game.phase;
  drawGame(ctx, game, { hover: game.hover ?? -1 });
  if (!window.__shotReady) window.__shotReady = true;
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
