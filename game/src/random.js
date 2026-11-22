// A tiny seeded random source (mulberry32) so a staged game always plays the same
// way: the same seed gives the same shuffle, the same draws, the same screenshots.
export function makeRng(seed) {
  let state = seed >>> 0;
  return function next() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** A whole-number roll in [0, count) from the given rng. */
export function roll(rng, count) {
  return Math.floor(rng() * count);
}
