/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, Engine, Sprite, TargetScope } from '@bxel/document';
import { ANIMATED } from './animated-project.constants';
import { runStep } from './run-step';
import { spriteNamed } from './sprite-named';
import { startEngine } from './start-engine';

const mark = (engine: Engine, sprite: Sprite, frameAt: number, at: { x: number; y: number; index: number }): void => {
  const frame = sprite.frames[frameAt];
  if (!frame) throw new Error(`no frame ${frameAt}`);
  const targets: TargetScope = { sprites: [sprite.id], layers: { by: 'all' }, frames: { by: 'ids', ids: [frame.id] } };
  runStep(engine, COMMAND_NAME.pixelsPatch, { rect: { x: at.x, y: at.y, width: 1, height: 1 }, pixels: new Uint8Array([at.index]), skipZero: false }, targets);
};

const buildAnimatedArtwork = (): Artwork => {
  const engine = startEngine({ name: ANIMATED.project, palette: ANIMATED.palette, sprite: { name: ANIMATED.hero, width: ANIMATED.side, height: ANIMATED.side } });
  const hero = spriteNamed(engine, ANIMATED.hero);
  const heroScope: TargetScope = { sprites: [hero.id], layers: { by: 'all' }, frames: { by: 'all' } };
  runStep(engine, COMMAND_NAME.frameAdd, {}, heroScope);
  runStep(engine, COMMAND_NAME.frameAdd, {}, heroScope);
  ANIMATED.marks.forEach((at, frameAt) => mark(engine, spriteNamed(engine, ANIMATED.hero), frameAt, at));
  runStep(engine, COMMAND_NAME.tagAdd, { name: ANIMATED.tag, from: { by: 'index', index: 0 }, to: { by: 'index', index: 2 }, direction: 'pingpong' }, heroScope);
  runStep(engine, COMMAND_NAME.spriteCreate, { name: ANIMATED.tree, width: ANIMATED.side, height: ANIMATED.side });
  runStep(engine, COMMAND_NAME.spriteCreate, { name: ANIMATED.gem, width: ANIMATED.side, height: ANIMATED.side });
  mark(engine, spriteNamed(engine, ANIMATED.tree), 0, ANIMATED.treeMark);
  mark(engine, spriteNamed(engine, ANIMATED.gem), 0, ANIMATED.gemMark);
  runStep(engine, COMMAND_NAME.sheetCreate, { name: ANIMATED.sheet });
  const sheet = engine.state().artwork.sheets.find((each) => each.name === ANIMATED.sheet);
  runStep(engine, COMMAND_NAME.sheetAdd, { sheet: sheet?.id }, { sprites: [spriteNamed(engine, ANIMATED.tree).id], layers: { by: 'all' }, frames: { by: 'all' } });
  const sprites = [spriteNamed(engine, ANIMATED.tree).id, spriteNamed(engine, ANIMATED.gem).id];
  runStep(engine, COMMAND_NAME.animationCreate, { name: ANIMATED.blink, source: { kind: 'sprites', sprites, mode: 'reference' } });
  return engine.state().artwork;
};

export { buildAnimatedArtwork };
