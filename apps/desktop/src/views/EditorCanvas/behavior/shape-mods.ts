/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import type { ShapeMods } from '../../../editor/shape-mods.type';
import { shapeCentre } from '../../../editor/shape-centre';
import { gestureMods } from './gesture-mods';

const shapeMods = (event: PointerEvent<HTMLElement>): ShapeMods => {
  const mods = gestureMods(event);
  return { ...mods, centre: shapeCentre(mods.centre) };
};

export { shapeMods };
