/* @layer tests @kind helper */
import { artworkCreate, counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type { BankId, CommandStep, Engine, SpriteId, TransactionResult } from '@bxel/document';
import { paletteCommands } from '@bxel/palette';

const COLORS = ['#140b26', '#4b1fa0', '#7b3fe4', '#b02a9c', '#e0568a', '#f5a35c', '#f7e38c'].map((rgb) => ({ rgb }));
const HASH_MULTIPLIER = 2654435761;
const PATCH_LIMIT = 65536;

type NoiseRig = { readonly engine: Engine; readonly spriteId: SpriteId; readonly bankId: BankId; readonly slots: readonly string[] };

const succeed = (result: TransactionResult): TransactionResult => {
  if (!result.ok) throw new Error(result.error.message);
  return result;
};

const noisePixels = (side: number): Uint8Array => {
  const pixels = new Uint8Array(side * side);
  for (let at = 0; at < pixels.length; at += 1) pixels[at] = (at * HASH_MULTIPLIER) % (COLORS.length + 1);
  return pixels;
};

const seedSteps = (spriteId: SpriteId, side: number): CommandStep[] => {
  const pixels = noisePixels(side);
  const rows = Math.max(1, Math.floor(PATCH_LIMIT / side));
  const steps: CommandStep[] = [];
  for (let y = 0; y < side; y += rows) {
    const height = Math.min(rows, side - y);
    steps.push({
      name: 'pixels.patch',
      targets: { sprites: [spriteId], layers: { by: 'all' }, frames: { by: 'all' } },
      options: { rect: { x: 0, y, width: side, height }, pixels: pixels.subarray(y * side, (y + height) * side) },
    });
  }
  return steps;
};

const noiseRig = (side: number): NoiseRig => {
  const created = artworkCreate({
    options: {
      name: 'Bench',
      bank: { name: 'Bench bank', cap: 16, transparent: true, colors: COLORS },
      sprite: { name: 'big', width: side, height: side },
    },
    ids: counterIdSource(),
  });
  if (!created.ok) throw new Error(created.error.message);
  const sprite = created.state.artwork.sprites[0];
  const bank = created.state.artwork.banks[0];
  if (!sprite || !bank) throw new Error('the noise artwork is incomplete');
  const engine = createEngine({
    state: created.state,
    ids: counterIdSource(1000),
    commands: [...documentCommands, ...paletteCommands],
  });
  succeed(
    engine.execute({
      documentId: engine.documentId,
      baseRevision: engine.state().revision,
      mode: 'commit',
      origin: 'ui',
      label: 'Seed',
      steps: seedSteps(sprite.id, side),
      previewPixels: 0,
    }),
  );
  return { engine, spriteId: sprite.id, bankId: bank.id, slots: (engine.state().artwork.banks[0]?.slots ?? []).map((slot) => String(slot.id)) };
};

export { noiseRig };
export type { NoiseRig };
