// The deck: build a fresh 30-card deck from the list, shuffle it with the seeded
// rng, and draw from the top. A card on the table is an instance with its own id.
import { CARD_TYPES, DECK_LIST } from './config.js';
import { roll } from './random.js';

let nextId = 1;

/** A fresh card instance of the named type. */
export function makeCard(type) {
  const def = CARD_TYPES[type];
  return {
    id: nextId, type, name: def.name, cost: def.cost,
    attack: def.attack, health: def.health, maxHealth: def.health,
    kind: def.kind, color: def.color, dark: def.dark, icon: def.icon, text: def.text,
    summoned: false,
  };
}

/** Build and shuffle a new deck; the rng decides the order. */
export function buildDeck(rng) {
  const deck = [];
  for (const [type, count] of DECK_LIST) {
    for (let index = 0; index < count; index += 1) deck.push(makeCard(type));
  }
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const other = roll(rng, index + 1);
    const held = deck[index];
    deck[index] = deck[other];
    deck[other] = held;
  }
  return deck;
}

/** Take the top card of the deck, or null when it is empty. */
export function drawCard(deck) {
  return deck.length === 0 ? null : deck.pop();
}
