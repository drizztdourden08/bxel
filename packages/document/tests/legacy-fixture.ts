/* @layer core @kind test */
import type { Artwork } from '@bxel/document';
import { makeBank, makePreset, makeSheet, makeSprite } from './legacy-parts';
import { applySteps, buildWorld, onGround, step } from './tile-engine';

const paintedWorld = (): Artwork => {
  const world = buildWorld();
  const cells = [{ x: 0, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 2 }];
  applySteps(world.engine, [step('map.paint', onGround(world, { tile: 2, flags: { flipX: true }, cells }))]);
  return world.engine.state().artwork;
};

const legacyArtwork = (): Artwork => {
  const base = paintedWorld();
  const [first] = base.banks;
  if (!first) throw new Error('The world has a bank.');
  const warm = makeBank(first, 900, 'Warm');
  const cool = makeBank(first, 920, 'Cool');
  const hero = makeSprite(930, 'Hero', warm.id);
  const lower = makeSprite(940, 'hero', warm.id);
  const odd = makeSprite(950, 'a/b:c', cool.id);
  const tree = makeSprite(960, 'Tree', cool.id, { platformId: 'game-boy', platformStrict: true });
  const crowd = makeSheet(970, 'Characters', [hero, lower, tree]);
  return {
    ...base,
    platformId: 'game-boy',
    banks: [...base.banks, warm, cool],
    sprites: [...base.sprites, hero, lower, odd, tree],
    sheets: [...base.sheets, crowd],
    presets: [
      ...base.presets,
      makePreset(980, 'Tree alone', [tree], null),
      makePreset(981, 'Characters sheet', [hero], crowd.id),
    ],
  };
};

export { legacyArtwork };
