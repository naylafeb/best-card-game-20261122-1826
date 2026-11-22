// Cinder Court's rules: turns, ember, drawing, playing cards, attacks, and the
// win and loss conditions. Nothing here touches the screen; render.js draws it.
import { RULES } from './config.js';
import { buildDeck, drawCard } from './deck.js';
import { makeRng } from './random.js';

export const PHASE_TITLE = 'title';
export const PHASE_PLAY = 'play';
export const PHASE_WIN = 'win';
export const PHASE_LOSS = 'loss';

/** A fresh side of the table: life, ember, hand, table, deck and discard pile. */
function makeSide(rng) {
  return {
    life: RULES.startLife,
    ember: 0,
    maxEmber: 0,
    fatigue: 0,
    hand: [],
    table: [],
    deck: buildDeck(rng),
    discard: [],
  };
}

/** A fresh game: the player moves first, both sides draw their opening hands. */
export function createGame(seed) {
  const rng = makeRng(seed);
  const game = {
    seed,
    rng,
    phase: PHASE_TITLE,
    turn: 1,
    active: 'player',
    player: makeSide(rng),
    enemy: makeSide(rng),
    selected: null,
    message: 'Welcome to the Cinder Court.',
    log: [],
    cardsPlayed: 0,
    damageDealt: 0,
  };
  for (let index = 0; index < RULES.startHand; index += 1) {
    dealCard(game, game.player);
    dealCard(game, game.enemy);
  }
  return game;
}

/** Draw one card for a side; an empty deck costs fatigue damage instead. */
export function dealCard(game, side) {
  const card = drawCard(side.deck);
  if (card === null) {
    side.fatigue += 1;
    hurt(game, side, RULES.fatigue * side.fatigue, 'fatigue');
    return null;
  }
  if (side.hand.length >= RULES.maxHand) {
    side.discard.push(card);
    return card;
  }
  side.hand.push(card);
  return card;
}

/** Start a side's turn: a fresh ember crystal, a full refill, and one draw. */
export function startTurn(game, side) {
  side.maxEmber = Math.min(RULES.maxEmber, side.maxEmber + 1);
  side.ember = side.maxEmber;
  for (const creature of side.table) creature.summoned = false;
  dealCard(game, side);
}

/** Deal damage to a side and end the game when a life total reaches zero. */
export function hurt(game, side, amount, source) {
  if (amount <= 0 || game.phase === PHASE_WIN || game.phase === PHASE_LOSS) return;
  side.life -= amount;
  if (side.life <= 0) {
    side.life = 0;
    game.phase = side === game.enemy ? PHASE_WIN : PHASE_LOSS;
    game.message = side === game.enemy
      ? 'The Warden falls. The court is yours.'
      : 'Your embers gutter out. The Warden keeps the court.';
  }
}

/** Heal a side, never above the life cap. */
export function heal(game, side, amount) {
  side.life = Math.min(RULES.maxLife, side.life + amount);
}

/** Play the card at `handIndex` from a side's hand; creatures land on the table. */
export function playCard(game, side, handIndex, target) {
  const card = side.hand[handIndex];
  if (!card || side.ember < card.cost) return false;
  side.ember -= card.cost;
  side.hand.splice(handIndex, 1);
  game.cardsPlayed += 1;
  if (card.kind === 'creature') {
    card.summoned = true;
    side.table.push(card);
    game.message = `${card.name} takes the table.`;
    return true;
  }
  side.discard.push(card);
  if (card.type === 'bolt') {
    hurt(game, target, card.attack, 'bolt');
    if (side === game.player) game.damageDealt += card.attack;
    game.message = `Spark Bolt strikes for ${card.attack}.`;
  } else if (card.type === 'mend') {
    heal(game, side, card.health);
    game.message = `Ember Mend restores ${card.health} life.`;
  } else if (card.type === 'insight') {
    dealCard(game, side);
    dealCard(game, side);
    game.message = 'Cinder Insight draws two cards.';
  }
  return true;
}

/** Every ready creature on a side's table strikes the opposing life total. */
export function attackPhase(game, side, target) {
  let total = 0;
  for (const creature of side.table) {
    if (!creature.summoned) total += creature.attack;
  }
  if (total > 0) {
    if (side === game.player) game.damageDealt += total;
    hurt(game, target, total, 'attack');
    if (game.phase === PHASE_PLAY) {
      game.message = `${side === game.player ? 'Your' : 'The Warden\u2019s'} creatures strike for ${total}.`;
    }
  }
}

/** End the player's turn: creatures strike, then the enemy takes its turn. */
export function endPlayerTurn(game) {
  if (game.phase !== PHASE_PLAY || game.active !== 'player') return;
  attackPhase(game, game.player, game.enemy);
  if (game.phase !== PHASE_PLAY) return;
  game.active = 'enemy';
  startTurn(game, game.enemy);
}

/** Run the enemy's whole turn, then hand the table back to the player. */
export function endEnemyTurn(game) {
  if (game.phase !== PHASE_PLAY || game.active !== 'enemy') return;
  attackPhase(game, game.enemy, game.player);
  if (game.phase !== PHASE_PLAY) return;
  game.active = 'player';
  game.turn += 1;
  startTurn(game, game.player);
}
