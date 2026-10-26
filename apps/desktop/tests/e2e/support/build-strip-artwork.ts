/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, TargetScope } from '@bxel/document';
import { runStep } from './run-step';
import { spriteNamed } from './sprite-named';
import { startEngine } from './start-engine';
import { STRIP } from './strip-project.constants';

const buildStripArtwork = (): Artwork => {
  const width = STRIP.side * STRIP.cells;
  const engine = startEngine({ name: STRIP.project, palette: STRIP.palette, sprite: { name: STRIP.strip, width, height: STRIP.side } });
  const strip = spriteNamed(engine, STRIP.strip);
  const targets: TargetScope = { sprites: [strip.id], layers: { by: 'all' }, frames: { by: 'all' } };
  for (let cell = 0; cell < STRIP.cells; cell += 1) {
    const rect = { x: cell * STRIP.side + 1 + cell, y: 1 + cell, width: 2, height: 2 };
    runStep(engine, COMMAND_NAME.pixelsPatch, { rect, pixels: new Uint8Array(4).fill(cell + 2), skipZero: false }, targets);
  }
  runStep(engine, COMMAND_NAME.animationCreate, { name: STRIP.animation, source: { kind: 'blank', width: STRIP.side, height: STRIP.side, frames: 1 } });
  return engine.state().artwork;
};

export { buildStripArtwork };
