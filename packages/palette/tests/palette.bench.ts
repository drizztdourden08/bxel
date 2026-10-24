/* @layer tests @kind bench */
import { artworkCreate, counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type { DocumentState, Engine } from '@bxel/document';
import { paletteCommands } from '@bxel/palette';
import { bench, describe } from 'vitest';

const SIDE = 2048;
const HEAVY = { iterations: 5, time: 0, warmupIterations: 2, warmupTime: 0 };
const COLORS = ['#140b26', '#4b1fa0', '#7b3fe4', '#b02a9c', '#e0568a', '#f5a35c', '#f7e38c'].map((rgb) => ({ rgb }));

const created = artworkCreate({
  options: {
    name: 'Bench',
    bank: { name: 'Bench bank', cap: 16, transparent: true, colors: COLORS },
    sprite: { name: 'big', width: SIDE, height: SIDE },
  },
  ids: counterIdSource(),
});
if (!created.ok) throw new Error(created.error.message);
const state: DocumentState = created.state;
const first = state.artwork.sprites[0];
const firstBank = state.artwork.banks[0];
if (!first || !firstBank) throw new Error('the bench artwork is incomplete');
const engine: Engine = createEngine({ state, ids: counterIdSource(1000), commands: [...documentCommands, ...paletteCommands] });
const target = { sprites: [first.id], layers: { by: 'all' }, frames: { by: 'all' } } as const;

const seedCel = (): void => {
  const seed = engine.execute({
    documentId: engine.documentId,
    baseRevision: engine.state().revision,
    mode: 'commit',
    origin: 'ui',
    label: 'Seed',
    steps: [{ name: 'pixels.patch', targets: target, options: { rect: { x: 0, y: 0, width: 1, height: 1 }, pixels: Uint8Array.of(1) } }],
    previewPixels: 0,
  });
  if (!seed.ok) throw new Error(seed.error.message);
  const cel = Object.values(engine.state().artwork.sprites[0]?.cels ?? {})[0];
  if (!cel) throw new Error('the seed made no cel');
  for (let at = 0; at < cel.pixels.length; at += 1) cel.pixels[at] = (at * 2654435761) % (COLORS.length + 1);
};

seedCel();
const slots = (engine.state().artwork.banks[0]?.slots ?? []).map((slot) => String(slot.id));
const bankId = firstBank.id;
const reversed = [slots[0] ?? '', ...slots.slice(1).reverse()];
let flip = false;

describe('palette engine, 2048 sprite', () => {
  bench('palette.reorder remap, 2048 by 2048 (target 60 ms)', () => {
    flip = !flip;
    const result = engine.execute({
      documentId: engine.documentId,
      baseRevision: engine.state().revision,
      mode: 'commit',
      origin: 'ui',
      label: 'Reorder',
      steps: [{ name: 'palette.reorder', targets: null, options: { bankId, order: flip ? reversed : slots } }],
      previewPixels: 0,
    });
    if (!result.ok) throw new Error(result.error.message);
  }, HEAVY);
});
