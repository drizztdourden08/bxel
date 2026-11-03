/* @layer renderer-app @kind constants */
import type { OptionChoice } from '../tool-options.type';

const MARQUEE_TEXT = {
  fixed: 'Marquee size',
  fixedDescription: 'Free draws any box. Fixed ratio keeps the box at the ratio of the two numbers. Fixed size stamps a box of exactly that size where you press.',
  width: 'Width',
  widthDescription: 'The width in pixels, or the width side of the ratio.',
  height: 'Height',
  heightDescription: 'The height in pixels, or the height side of the ratio.',
  mirror: 'Mirror with symmetry',
  mirrorDescription: 'With symmetry on, a marquee or lasso also selects the mirrored area.',
  pasteColours: 'Paste from another palette',
  pasteColoursDescription: 'When a copy comes from a document with a different palette: match the nearest colours, or keep the palette slot numbers.',
  vertexSnap: 'Vertex snap',
  vertexSnapDescription: 'Where a lasso or polygon point lands. Pixel centre uses the pixel under the pointer. Pixel corner uses the nearest corner of the pixel grid.',
} as const;

const FIXED_CHOICES: readonly OptionChoice[] = [
  { value: 'free', label: 'Free', description: 'Drag any box.', glyph: 'F' },
  { value: 'ratio', label: 'Fixed ratio', description: 'Drag a box that keeps the width to height ratio.', glyph: ':' },
  { value: 'size', label: 'Fixed size', description: 'Press to stamp a box of the width and height set here.', glyph: 'W' },
];

const VERTEX_SNAP_CHOICES: readonly OptionChoice[] = [
  { value: 'centre', label: 'Pixel centre', description: 'Points land on the pixel under the pointer.', glyph: 'C' },
  { value: 'corner', label: 'Pixel corner', description: 'Points land on the nearest corner of the pixel grid.', glyph: '+' },
];

const PASTE_COLOUR_CHOICES: readonly OptionChoice[] = [
  { value: 'nearest', label: 'Nearest colours', description: 'Match each pasted colour to the closest one in this palette.', glyph: 'N' },
  { value: 'keep', label: 'Keep indexes', description: 'Keep the palette slot numbers as they were copied, even if the colours differ.', glyph: 'K' },
];

export { FIXED_CHOICES, MARQUEE_TEXT, PASTE_COLOUR_CHOICES, VERTEX_SNAP_CHOICES };
