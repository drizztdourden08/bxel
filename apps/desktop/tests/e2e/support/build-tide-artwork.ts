/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { step, waterSteps } from '../../water-steps';
import { startEngine } from './start-engine';
import { TIDE } from './tide.constants';

const buildTideArtwork = (): Artwork => {
  const engine = startEngine({ name: TIDE.project, palette: 'Main', sprite: { name: 'hero', width: TIDE.side, height: TIDE.side } });
  const done = engine.execute({
    documentId: engine.documentId,
    baseRevision: engine.state().revision,
    mode: 'commit',
    origin: 'ui',
    label: 'Build the tide',
    previewPixels: 0,
    steps: [
      ...waterSteps({ side: TIDE.side, frameMs: TIDE.frameMs, indexes: TIDE.indexes, columns: TIDE.columns, rows: TIDE.rows }),
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
