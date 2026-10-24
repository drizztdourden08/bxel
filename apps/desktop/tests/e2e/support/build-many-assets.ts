/* @layer renderer-app @kind logic */
import { artworkCreate, COMMAND_NAME, counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { ANIMATION_COLORS } from './animation.constants';
import { runStep } from './run-step';
import { MANY } from './many.constants';

const pad = (number: number): string => String(number).padStart(MANY.padding, '0');

const buildManyAssets = (): Artwork => {
  const ids = counterIdSource();
  const created = artworkCreate({
    options: { name: MANY.name, bank: { name: MANY.palette, cap: 16, transparent: true, colors: ANIMATION_COLORS }, sprite: { name: `s${pad(1)}`, ...MANY.size } },
    ids,
  });
  if (!created.ok) throw new Error(created.error.message);
  const engine = createEngine({ state: created.state, ids, commands: documentCommands });
  for (let index = 2; index <= MANY.sprites; index += 1) runStep(engine, COMMAND_NAME.spriteCreate, { name: `s${pad(index)}`, ...MANY.size });
  const spriteIds = engine.state().artwork.sprites.map((sprite) => sprite.id);
  for (let index = 1; index <= MANY.sheets; index += 1) {
    runStep(engine, COMMAND_NAME.sheetCreate, { name: `sh${pad(index)}` });
    const sheet = engine.state().artwork.sheets.find((each) => each.name === `sh${pad(index)}`);
    const members = spriteIds.slice(index - 1, index + 1);
    runStep(engine, COMMAND_NAME.sheetAdd, { sheet: sheet?.id }, { sprites: members, layers: { by: 'all' }, frames: { by: 'all' } });
  }
  return engine.state().artwork;
};

export { buildManyAssets };
