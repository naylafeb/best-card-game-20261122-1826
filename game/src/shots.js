// The screenshot scenes behind ?shot=title|play|win|loss. Each one plays the real
// rules forward from a fresh game with a fixed seed, steered by a simple autopilot
// (play the best affordable card, then end the turn), so the frame is what a real
// game looks like and the same seed always gives the same frame.
import { makeCard } from './deck.js';
import { playEnemyTurn } from './ai.js';
import {
  PHASE_LOSS, PHASE_PLAY, PHASE_TITLE, PHASE_WIN,
  attackPhase, createGame, endEnemyTurn, endPlayerTurn, playCard, startTurn,
} from './state.js';

/** The player's autopilot: creatures by attack, bolts to finish, mends when hurt. */
function autopilotPlay(game) {
  for (let guard = 0; guard < 20; guard += 1) {
    const hand = game.player.hand;
    let best = -1;
    let bestValue = -1;
    for (let index = 0; index < hand.length; index += 1) {
      const card = hand[index];
      if (card.cost > game.player.ember) continue;
      let value = card.kind === 'creature' ? card.attack / card.cost : 0;
      if (card.type === 'bolt') value = game.enemy.life <= card.attack ? 99 : 1.2;
      if (card.type === 'mend') value = game.player.life <= 12 ? 3 : 0.1;
      if (card.type === 'insight') value = hand.length <= 3 ? 2 : 0.3;
      if (value > bestValue) {
        bestValue = value;
        best = index;
      }
    }
    if (best < 0 || bestValue <= 0) break;
    playCard(game, game.player, best, game.enemy);
    if (game.phase !== PHASE_PLAY) return;
  }
}

/** Play one full round (player then enemy) with the autopilot driving both sides. */
function playRound(game) {
  autopilotPlay(game);
  endPlayerTurn(game);
  if (game.phase !== PHASE_PLAY) return;
  playEnemyTurn(game);
  endEnemyTurn(game);
}

/** A fresh game in play, driven forward until the given turn (or its end). */
function driveToTurn(seed, turnTarget) {
  const game = createGame(seed);
  game.phase = PHASE_PLAY;
  startTurn(game, game.player);
  while (game.phase === PHASE_PLAY && game.turn < turnTarget) playRound(game);
  return game;
}

/** Force the ending the simulation did not reach: a ready creature lands the blow. */
function forceEnding(game, winner) {
  const attacker = winner === 'player' ? game.player : game.enemy;
  const victim = winner === 'player' ? game.enemy : game.player;
  victim.life = 2;
  const finisher = makeCard('drake');
  finisher.summoned = false;
  attacker.table.push(finisher);
  attackPhase(game, attacker, victim);
  return game;
}

/**
 * Set `game` to the named scene and return the screen to draw. The play scene is a
 * mid-game table; win and loss are real endings, forced only if no seed wins fast.
 */
export function stageShot(name, seed) {
  if (name === 'win' || name === 'loss') {
    const wanted = name === 'win' ? PHASE_WIN : PHASE_LOSS;
    for (let trySeed = 1; trySeed <= 12; trySeed += 1) {
      const game = driveToTurn(seed + trySeed, 30);
      if (game.phase === wanted) return game;
      if (game.phase === PHASE_PLAY) {
        forceEnding(game, name);
        if (game.phase === wanted) return game;
      }
    }
    const game = driveToTurn(seed + 1, 6);
    if (game.phase === PHASE_PLAY) forceEnding(game, name);
    else {
      // The drive ended the other way; build the ending from a fresh table.
      const fresh = createGame(seed + 1);
      fresh.phase = PHASE_PLAY;
      startTurn(fresh, fresh.player);
      forceEnding(fresh, name);
      return fresh;
    }
    return game;
  }
  if (name === 'play') {
    for (let trySeed = 1; trySeed <= 20; trySeed += 1) {
      const game = driveToTurn(seed + trySeed, 6);
      if (game.phase === PHASE_PLAY && game.player.table.length > 0 && game.enemy.table.length > 0) {
        return game;
      }
    }
    return driveToTurn(seed + 1, 6);
  }
  const game = createGame(seed);
  game.phase = PHASE_TITLE;
  return game;
}

export { PHASE_LOSS, PHASE_PLAY, PHASE_TITLE, PHASE_WIN };
