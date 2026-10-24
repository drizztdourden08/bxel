/* @layer renderer-app @kind logic */
import { artworkCreate, COMMAND_NAME, counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type { Artwork, TargetScope } from '@bxel/document';
import { ANIMATION_COLORS } from './animation.constants';
import { runStep } from './run-step';
import { SAMPLE } from './sample.constants';

const buildSampleArtwork = (): Artwork => {
  const ids = counterIdSource();
  const created = artworkCreate({
    options: { name: SAMPLE.name, bank: { name: SAMPLE.palette, cap: 16, transparent: true, colors: ANIMATION_COLORS }, sprite: { name: SAMPLE.sprites[0], ...SAMPLE.size } },
    ids,
  });
  if (!created.ok) throw new Error(created.error.message);
  const engine = createEngine({ state: created.state, ids, commands: documentCommands });
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
