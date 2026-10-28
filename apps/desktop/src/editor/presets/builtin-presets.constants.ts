/* @layer renderer-app @kind constants */
import type { ToolPreset } from './tool-preset.type';

const BUILTIN_PRESETS: readonly ToolPreset[] = [
  { id: 'builtin.pencil-1', name: 'Pencil 1 px, pixel perfect', member: 'pencil', fields: { 'pencil.size': 1, 'pencil.tip': 'square', 'pencil.pixel_perfect': true }, builtin: true },
  { id: 'builtin.pencil-2', name: 'Pencil 2 px, square', member: 'pencil', fields: { 'pencil.size': 2, 'pencil.tip': 'square', 'pencil.pixel_perfect': false }, builtin: true },
  { id: 'builtin.pencil-3', name: 'Pencil 3 px, circle', member: 'pencil', fields: { 'pencil.size': 3, 'pencil.tip': 'circle', 'pencil.pixel_perfect': false }, builtin: true },
  { id: 'builtin.eraser-1', name: 'Eraser 1 px', member: 'eraser', fields: { 'eraser.size': 1, 'eraser.tip': 'square' }, builtin: true },
  { id: 'builtin.fill-global', name: 'Fill global', member: 'fill', fields: { 'fill.area': 'global' }, builtin: true },
  { id: 'builtin.select-wand-4', name: 'Wand, 4 neighbours', member: 'select-wand', fields: { 'select.neighbours': '4' }, builtin: true },
];

const QUICK_SLOTS = 5;

export { BUILTIN_PRESETS, QUICK_SLOTS };
