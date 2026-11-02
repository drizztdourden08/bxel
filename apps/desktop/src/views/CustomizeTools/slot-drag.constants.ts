/* @layer renderer-app @kind constants */
import { defineDragType } from '@drizztdourden08/brock-react';
import type { SlotDragPayload } from './CustomizeTools.type';

const SLOT_DRAG = defineDragType<SlotDragPayload>('bxel.tool-slot');

export { SLOT_DRAG };
