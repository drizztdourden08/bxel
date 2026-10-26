/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, CommandStep } from '@bxel/document';
import { startEngine } from './start-engine';
import { TIDE } from './tide.constants';

const step = (name: string, options: unknown, ref?: string): CommandStep => ({ name, targets: null, options, ...(ref ? { ref } : {}) });

const paint = (sprite: string, value: number): CommandStep => ({
  name: COMMAND_NAME.pixelsPatch,
  targets: { sprites: [{ ref: sprite }], layers: { by: 'all' }, frames: { by: 'all' } },
  options: { rect: { x: 0, y: 0, width: TIDE.side, height: TIDE.side }, pixels: new Uint8Array(TIDE.side * TIDE.side).fill(value), skipZero: false },
});

const frame = (index: number): CommandStep =>
  step(COMMAND_NAME.animationFrameOwn, { animation: { ref: 'water' }, frame: { by: 'index', index } }, `frame${index}`);

const buildTideArtwork = (): Artwork => {
  const engine = startEngine({ name: TIDE.project, palette: 'Main', sprite: { name: 'hero', width: TIDE.side, height: TIDE.side } });
  const [first, second] = TIDE.indexes;
  const done = engine.execute({
    documentId: engine.documentId,
    baseRevision: engine.state().revision,
    mode: 'commit',
    origin: 'ui',
    label: 'Build the tide',
    previewPixels: 0,
    steps: [
      step(COMMAND_NAME.animationCreate, { name: TIDE.animation, source: { kind: 'blank', width: TIDE.side, height: TIDE.side, frames: 2, durationMs: TIDE.frameMs } }, 'water'),
      frame(0),
      frame(1),
      paint('frame0', first),
      paint('frame1', second),
      step(COMMAND_NAME.tilesetCreate, { name: TIDE.tileset, tileWidth: TIDE.side, tileHeight: TIDE.side }, 'ground'),
      step(COMMAND_NAME.tileAdd, { tileset: { ref: 'ground' } }),
      step(COMMAND_NAME.tileAnimation, { tileset: { ref: 'ground' }, key: 1, change: { kind: 'set', animation: { ref: 'water' }, start: 'together' } }),
      step(COMMAND_NAME.tilemapCreate, { name: TIDE.map, tileset: { ref: 'ground' }, columns: TIDE.columns, rows: TIDE.rows }, 'sea'),
      step(COMMAND_NAME.mapWrite, {
        tilemap: { ref: 'sea' },
        layer: { by: 'name', name: 'Layer 1' },
        rect: { x: 0, y: 0, width: TIDE.columns, height: TIDE.rows },
        keys: new Array<number>(TIDE.columns * TIDE.rows).fill(1),
      }),
    ],
  });
  if (!done.ok) throw new Error(done.error.message);
  return engine.state().artwork;
};

export { buildTideArtwork };
