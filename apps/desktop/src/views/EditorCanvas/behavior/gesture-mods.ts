/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { gesture } from '../../../editor/gesture-state';
import type { ShapeMods } from '../../../editor/shape-mods.type';

const gestureMods = (event: PointerEvent<HTMLElement>): ShapeMods => ({ constrain: event.shiftKey, centre: event.altKey, move: gesture.space });

export { gestureMods };
