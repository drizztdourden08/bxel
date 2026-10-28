/* @layer renderer-app @kind logic */
import { artworkCreate, COMMAND_NAME, counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type { Artwork, TargetScope } from '@bxel/document';
import { ANIMATION_COLORS } from './animation.constants';
import { FOLDER_ANIMATION, FOLDER_SPRITES, FOLDER_SHEET, FOLDER_STRAY } from './folder-artwork.constants';
import { runStep } from './run-step';

const buildFolderArtwork = (withAnimation = false): Artwork => {
  const ids = counterIdSource();
  const [first, ...rest] = FOLDER_SPRITES;
  const created = artworkCreate({
    options: { name: 'Folders', bank: { name: 'Main', cap: 16, transparent: true, colors: ANIMATION_COLORS }, sprite: { name: first.name, width: 16, height: 16 } },
    ids,
  });
  if (!created.ok) throw new Error(created.error.message);
  const engine = createEngine({ state: created.state, ids, commands: documentCommands });
  for (const sprite of rest) runStep(engine, COMMAND_NAME.spriteCreate, { name: sprite.name, width: sprite.width, height: 16 });
  const all = (): TargetScope => ({ sprites: engine.state().artwork.sprites.map((sprite) => sprite.id), layers: { by: 'all' }, frames: { by: 'all' } });
  runStep(engine, COMMAND_NAME.sheetCreate, { name: FOLDER_SHEET });
  const made = engine.state().artwork.sheets.find((each) => each.name === FOLDER_SHEET);
  runStep(engine, COMMAND_NAME.sheetAdd, { sheet: made?.id }, all());
  runStep(engine, COMMAND_NAME.spriteCreate, { name: FOLDER_STRAY, width: 16, height: 16 });
  if (withAnimation) {
    const pair = engine.state().artwork.sprites.filter((sprite) => sprite.name === 'hero' || sprite.name === 'slime').map((sprite) => sprite.id);
    runStep(engine, COMMAND_NAME.animationCreate, { name: FOLDER_ANIMATION, source: { kind: 'sprites', sprites: pair, mode: 'reference' } });
    const animation = engine.state().artwork.animations.find((each) => each.name === FOLDER_ANIMATION);
    runStep(engine, COMMAND_NAME.sheetAnimationAdd, { sheet: made?.id, animation: animation?.id });
  }
  return engine.state().artwork;
};

export { buildFolderArtwork };
