/* @layer renderer-app @kind logic */
import { drawStroke } from './draw-stroke';
import { MARKS } from './marks.constants';
import { openSpriteRig } from './open-sprite-rig';
import { pickSwatch } from './pick-swatch';
import type { TransformRig } from './transform-rig.type';

const openTransformRig = async (): Promise<TransformRig> => {
  const rig = await openSpriteRig();
  for (const [swatch, cells] of MARKS) {
    await pickSwatch(rig.session, swatch);
    await drawStroke(rig.session, rig.map, [...cells]);
  }
  return { ...rig, original: await rig.shown() };
};

export { openTransformRig };
