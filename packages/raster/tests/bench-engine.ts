/* @layer tests @kind helper */
import { artworkCreate, counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type { CommandStep, DocumentState, Engine, SpriteId, TransactionRequest } from '@bxel/document';
import { rasterCommands } from '@bxel/raster';
import type { Point } from '@bxel/raster';

const BANK_COLORS = ['#140b26', '#4b1fa0', '#7b3fe4', '#b02a9c'].map((rgb) => ({ rgb }));

const benchState = (side: number): DocumentState => {
  const created = artworkCreate({
    options: {
      name: 'Bench',
      bank: { name: 'Bench bank', cap: 8, transparent: true, colors: BANK_COLORS },
      sprite: { name: 'big', width: side, height: side },
    },
    ids: counterIdSource(),
  });
  if (!created.ok) throw new Error(created.error.message);
  return created.state;
};

const benchEngine = (state: DocumentState): Engine =>
  createEngine({ state, ids: counterIdSource(1000), commands: [...documentCommands, ...rasterCommands] });

const spriteOf = (state: DocumentState): SpriteId => {
  const sprite = state.artwork.sprites[0];
  if (!sprite) throw new Error('the bench artwork has no sprite');
  return sprite.id;
};

const strokeStep = (spriteId: SpriteId, points: readonly Point[], size: number): CommandStep => ({
  name: 'pixels.paint',
  targets: { sprites: [spriteId], layers: { by: 'all' }, frames: { by: 'all' } },
  options: { index: 2, points, brush: { shape: 'circle', size } },
});

const requestOf = (state: DocumentState, step: CommandStep, mode: TransactionRequest['mode']): TransactionRequest => ({
  documentId: state.documentId,
  baseRevision: state.revision,
  mode,
  origin: 'ui',
  label: 'Bench stroke',
  steps: [step],
  previewPixels: mode === 'preview' ? 2048 * 2048 : 0,
});

export { benchEngine, benchState, requestOf, spriteOf, strokeStep };
