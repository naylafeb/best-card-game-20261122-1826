// Mouse and keyboard for Cinder Court: click a hand card to select it (click again
// to play it), click End Turn, keys 1–7 pick a hand card, Enter starts or ends.
import { PHASE_PLAY, PHASE_TITLE, endPlayerTurn, playCard, startTurn } from './state.js';
import { endTurnRect, handRects } from './render.js';

/** The hand card under a point, or -1 when the point is on no card. */
export function cardAt(game, x, y) {
  const rects = handRects(game);
  for (let index = rects.length - 1; index >= 0; index -= 1) {
    const rect = rects[index];
    const lift = rect.index === game.selected ? 18 : 0;
    if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y - lift && y <= rect.y + rect.h) {
      return rect.index;
    }
  }
  return -1;
}

/** Handle a click at canvas coordinates (already scaled to the 1280x720 board). */
export function handleClick(game, x, y) {
  if (game.phase === PHASE_TITLE) {
    game.phase = PHASE_PLAY;
    startTurn(game, game.player);
    game.message = 'Your turn — play a card, then end your turn.';
    return;
  }
  if (game.phase !== PHASE_PLAY || game.active !== 'player') return;
  const rect = endTurnRect();
  if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
    endPlayerTurn(game);
    return;
  }
  const index = cardAt(game, x, y);
  if (index < 0) {
    game.selected = null;
    return;
  }
  if (game.selected === index) {
    if (playCard(game, game.player, index, game.enemy)) game.selected = null;
  } else {
    game.selected = index;
  }
}

/** Handle a key: Enter starts, ends the turn or restarts; digits pick a card. */
export function handleKey(game, key) {
  if (key === 'Enter' || key === ' ') {
    if (game.phase === PHASE_TITLE) {
      game.phase = PHASE_PLAY;
      startTurn(game, game.player);
      game.message = 'Your turn — play a card, then end your turn.';
      return;
    }
    if (game.phase === 'win' || game.phase === 'loss') {
      game.restart();
      return;
    }
    if (game.phase === PHASE_PLAY && game.active === 'player') endPlayerTurn(game);
    return;
  }
  if (key === 'Escape') {
    game.selected = null;
    return;
  }
  const digit = Number.parseInt(key, 10);
  if (game.phase === PHASE_PLAY && game.active === 'player' && digit >= 1 && digit <= game.player.hand.length) {
    const index = digit - 1;
    if (game.selected === index) {
      if (playCard(game, game.player, index, game.enemy)) game.selected = null;
    } else {
      game.selected = index;
    }
  }
}
