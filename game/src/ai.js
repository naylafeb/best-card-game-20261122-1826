// The Warden's brain: a greedy opponent that plays what it can afford, in an
// order a player can read and counter — big creatures first, bolts to finish,
// mends when hurt, insight when its hand runs dry.
import { playCard } from './state.js';

/** The value of a card to the enemy: damage per ember, with spells ranked by need. */
function cardValue(game, card) {
  if (card.kind === 'creature') return card.attack / card.cost;
  if (card.type === 'bolt') {
    if (game.player.life <= card.attack) return 99;
    return 1.5;
  }
  if (card.type === 'mend') {
    return game.enemy.life <= 12 ? 4 : 0.2;
  }
  if (card.type === 'insight') {
    return game.enemy.hand.length <= 3 ? 3 : 0.5;
  }
  return 0;
}

/** Play the enemy's turn: keep playing its best affordable card until none is. */
export function playEnemyTurn(game) {
  const enemy = game.enemy;
  for (let guard = 0; guard < 20; guard += 1) {
    let best = -1;
    let bestValue = -1;
    for (let index = 0; index < enemy.hand.length; index += 1) {
      const card = enemy.hand[index];
      if (card.cost > enemy.ember) continue;
      const value = cardValue(game, card);
      if (value > bestValue) {
        bestValue = value;
        best = index;
      }
    }
    if (best < 0 || bestValue <= 0) break;
    playCard(game, enemy, best, game.player);
    if (game.phase !== 'play') return;
  }
}
