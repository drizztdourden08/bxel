/* @layer renderer-app @kind logic */
import { canvasMapper } from './canvas-mapper';
import { createSprite } from './create-sprite';
import { MARKS_SIDE } from './marks.constants';
import { openSession } from './open-session';
import { readDisplayed } from './read-displayed';
import { readSwatches } from './read-swatches';
import type { CellMapper } from './e2e.type';
import type { SpriteRig } from './sprite-rig.type';

const openSpriteRig = async (): Promise<SpriteRig> => {
  const session = await openSession();
  await createSprite(session);
  const size = { width: MARKS_SIDE, height: MARKS_SIDE };
  const remap = () => canvasMapper(session, size);
  const map = await remap();
  const read = async (mapper: CellMapper) => readDisplayed(session, mapper, size, await readSwatches(session));
  return { session, map, remap, shown: () => read(map), shownNow: async () => read(await remap()) };
};

export { openSpriteRig };
