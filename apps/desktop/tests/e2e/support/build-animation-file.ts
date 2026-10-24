/* @layer renderer-app @kind logic */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { artworkCreate, COMMAND_NAME, counterIdSource, createEngine, documentCommands, sliceAsset } from '@bxel/document';
import type { Engine, Sprite, TargetScope } from '@bxel/document';
import { encodeSprite } from '@bxel/document/native';
import { ANIMATION, ANIMATION_COLORS } from './animation.constants';
import { runStep } from './run-step';

const SIDE = ANIMATION.side;

const firstSprite = (engine: Engine): Sprite => {
  const sprite = engine.state().artwork.sprites[0];
  if (!sprite) throw new Error('the fixture has no sprite');
  return sprite;
};

const paintFrame = (engine: Engine, frameAt: number): void => {
  const sprite = firstSprite(engine);
  const frame = sprite.frames[frameAt];
  const swatch = ANIMATION.swatches[frameAt];
  if (!frame || swatch === undefined) throw new Error(`no frame ${frameAt}`);
  const targets: TargetScope = { sprites: [sprite.id], layers: { by: 'all' }, frames: { by: 'ids', ids: [frame.id] } };
  const rect = { x: frameAt * 2 + 1, y: frameAt + 1, width: 2, height: 3 };
  runStep(engine, COMMAND_NAME.pixelsPatch, { rect, pixels: new Uint8Array(6).fill(swatch), skipZero: false }, targets);
};

const buildAnimationFile = async (dir: string): Promise<string> => {
  const ids = counterIdSource();
  const created = artworkCreate({
    options: { name: 'Walk', bank: { name: 'Walk 16', cap: 16, transparent: true, colors: ANIMATION_COLORS }, sprite: { name: ANIMATION.spriteName, width: SIDE, height: SIDE } },
    ids,
  });
  if (!created.ok) throw new Error(created.error.message);
  const engine = createEngine({ state: created.state, ids, commands: documentCommands });
  const all = (): TargetScope => ({ sprites: [firstSprite(engine).id], layers: { by: 'all' }, frames: { by: 'all' } });
  runStep(engine, COMMAND_NAME.frameAdd, { durationMs: ANIMATION.durations[1] }, all());
  runStep(engine, COMMAND_NAME.frameAdd, { durationMs: ANIMATION.durations[2] }, all());
  runStep(engine, COMMAND_NAME.frameUpdate, { frame: { by: 'index', index: 0 }, durationMs: ANIMATION.durations[0] }, all());
  for (let frameAt = 0; frameAt < ANIMATION.durations.length; frameAt += 1) paintFrame(engine, frameAt);
  runStep(engine, COMMAND_NAME.tagAdd, { name: ANIMATION.tagName, from: { by: 'index', index: 0 }, to: { by: 'index', index: 2 } }, all());
  const path = join(dir, ANIMATION.file);
  const slice = sliceAsset(engine.state().artwork, { kind: 'sprite', id: firstSprite(engine).id }, new Map());
  await writeFile(path, encodeSprite(slice, null, () => 0));
  return path;
};

export { buildAnimationFile };
