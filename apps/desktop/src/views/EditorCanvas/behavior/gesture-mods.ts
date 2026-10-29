/* @layer renderer-app @kind logic */
import { commands } from '@drizztdourden08/brock-react';
import type { PointerEvent } from 'react';
import { gesture } from '../../../editor/gesture-state';
import type { ShapeMods } from '../../../editor/shape-mods.type';

const gestureMods = (event: PointerEvent<HTMLElement>): ShapeMods => {
  const held = commands.heldModifiers(event);
  return { constrain: held.includes('shift'), centre: held.includes('alt'), move: gesture.space };
};

export { gestureMods };
