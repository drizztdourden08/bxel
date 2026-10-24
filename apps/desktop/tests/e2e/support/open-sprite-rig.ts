/* @layer renderer-app @kind logic */
import { canvasMapper } from './canvas-mapper';
import { createSprite } from './create-sprite';
import { MARKS_SIDE } from './marks.constants';
import { openSession } from './open-session';
import { readDisplayed } from './read-displayed';
import { readSwatches } from './read-swatches';
import type { SpriteRig } from './sprite-rig.type';

const openSpriteRig = async (): Promise<SpriteRig> => {
  const session = await openSession();
  await createSprite(session);
  const size = { width: MARKS_SIDE, height: MARKS_SIDE };
  const map = await canvasMapper(session, size);
  return { session, map, shown: async () => readDisplayed(session, map, size, await readSwatches(session)) };
};

export { openSpriteRig };
