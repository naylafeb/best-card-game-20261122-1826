// Cinder Court: the game's constants — board size, colours, life and ember rules,
// and the seven card types. Every card is original: own names, own icons, own art.
export const VIEW = { width: 1280, height: 720 };

export const RULES = {
  startLife: 20,
  maxLife: 30,
  maxEmber: 10,
  startHand: 3,
  maxHand: 7,
  deckSize: 30,
  fatigue: 1,
};

// A card's kind decides how it plays: a creature stays on the table and attacks,
// a spell resolves at once and is discarded. Colour and icon tell types apart.
export const CARD_TYPES = {
  sprite: {
    name: 'Ember Sprite', cost: 1, attack: 1, health: 1, kind: 'creature',
    color: '#ffb347', dark: '#8a5a12', icon: 'flame',
    text: 'A flicker with teeth.',
  },
  hound: {
    name: 'Ash Hound', cost: 2, attack: 2, health: 2, kind: 'creature',
    color: '#ff8c42', dark: '#8a3c0d', icon: 'paw',
    text: 'It hunts through smoke.',
  },
  knight: {
    name: 'Cinder Knight', cost: 3, attack: 3, health: 3, kind: 'creature',
    color: '#e4572e', dark: '#7a2410', icon: 'sword',
    text: 'Sworn to the last ember.',
  },
  drake: {
    name: 'Flame Drake', cost: 5, attack: 5, health: 5, kind: 'creature',
    color: '#d62828', dark: '#6e0f0f', icon: 'wing',
    text: 'The court bows to fire.',
  },
  bolt: {
    name: 'Spark Bolt', cost: 2, attack: 3, health: 0, kind: 'spell',
    color: '#ffd60a', dark: '#7a6200', icon: 'bolt',
    text: 'Deal 3 damage.',
  },
  mend: {
    name: 'Ember Mend', cost: 2, attack: 0, health: 5, kind: 'spell',
    color: '#80ed99', dark: '#1d5c2e', icon: 'leaf',
    text: 'Restore 5 life.',
  },
  insight: {
    name: 'Cinder Insight', cost: 1, attack: 0, health: 0, kind: 'spell',
    color: '#90e0ef', dark: '#155e75', icon: 'eye',
    text: 'Draw 2 cards.',
  },
};

// How many of each type go into a 30-card deck.
export const DECK_LIST = [
  ['sprite', 6], ['hound', 4], ['knight', 3], ['drake', 2],
  ['bolt', 7], ['mend', 4], ['insight', 4],
];

export const ENEMY_NAME = 'Ashwick, the Cinder Warden';
export const PLAYER_NAME = 'You, the Ember Thief';
