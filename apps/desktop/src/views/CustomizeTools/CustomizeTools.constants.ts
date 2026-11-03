/* @layer renderer-app @kind constants */
import { defineDragType } from '@drizztdourden08/brock-react';
import type { MemberDragPayload, SlotDragPayload } from './CustomizeTools.type';

const CUSTOMIZE_TEXT = {
  title: 'Customize tools',
  rail: 'On the rail',
  railHint: 'A tool switched off leaves the rail and waits under More tools. Its key still picks it. Drag a tool, or use the arrows, to reorder it or move it to another group. Drag a variant onto another tool to join it, or give it a slot of its own.',
  keys: 'Tool keys',
  keysHint: 'Change a key in Settings, under Keyboard. A tool key held down borrows the tool until you let go.',
  presetKeys: 'Preset keys',
  presetKeysHint: 'Each preset you save in My presets or in the project has a command you can give a key.',
  noKey: 'No key',
  heldKeys: 'Held keys',
  space: 'Hand',
  alt: 'Picker',
  heldHint: 'Hold Space to borrow the hand and Alt to borrow the picker. Let go to go back.',
  resize: 'Resize the brush',
  resizeHint: 'Hold Ctrl and Alt, then drag left or right on the canvas.',
  reset: 'Reset this surface',
  group: (label: string): string => `${label} tools`,
  moveUp: (label: string): string => `Move ${label} up`,
  moveDown: (label: string): string => `Move ${label} down`,
  done: 'Done',
  alone: (label: string): string => `Give ${label} a slot of its own`,
  toggle: (label: string): string => `Show ${label} on the rail`,
} as const;

const SLOT_DRAG = defineDragType<SlotDragPayload>('bxel.tool-slot');

const MEMBER_DRAG = defineDragType<MemberDragPayload>('bxel.tool-member');

export { CUSTOMIZE_TEXT, MEMBER_DRAG, SLOT_DRAG };
