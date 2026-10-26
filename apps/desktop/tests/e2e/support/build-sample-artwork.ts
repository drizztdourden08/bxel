/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, TargetScope } from '@bxel/document';
import { runStep } from './run-step';
import { SAMPLE } from './sample.constants';
import { startEngine } from './start-engine';

const buildSampleArtwork = (): Artwork => {
  const engine = startEngine({ name: SAMPLE.name, palette: SAMPLE.palette, sprite: { name: SAMPLE.sprites[0], ...SAMPLE.size } });
  runStep(engine, COMMAND_NAME.spriteCreate, { name: SAMPLE.sprites[1], ...SAMPLE.size });
  const all = (): TargetScope => ({ sprites: engine.state().artwork.sprites.map((sprite) => sprite.id), layers: { by: 'all' }, frames: { by: 'all' } });
  for (const sheet of SAMPLE.sheets) {
    runStep(engine, COMMAND_NAME.sheetCreate, { name: sheet });
    const made = engine.state().artwork.sheets.find((each) => each.name === sheet);
    runStep(engine, COMMAND_NAME.sheetAdd, { sheet: made?.id }, all());
  }
  return engine.state().artwork;
};

export { buildSampleArtwork };
