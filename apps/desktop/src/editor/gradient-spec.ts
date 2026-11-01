/* @layer renderer-app @kind logic */
import { decodeBrushPixels } from '@bxel/document';
import type { BufferView } from '@bxel/raster';
import type { GradientSpec } from './editor.type';
import { gradientColours } from './gradient-colours';
import type { GradientInput } from './gradient-spec.type';
import { PARTNER } from './ink-of.constants';
import { savedBrush } from './saved-brush';
import { wrapOf } from './wrap-of';

const stencilOf = (drawing: GradientInput['drawing']): { brushId?: string; stencil?: BufferView } => {
  const brush = drawing.gradientCustom ? savedBrush(drawing.brushId) : null;
  return brush ? { brushId: brush.id, stencil: { width: brush.width, height: brush.height, pixels: decodeBrushPixels(brush.pixels) } } : {};
};

const gradientSpec = ({ tools, drawing, target, slot, at }: GradientInput): GradientSpec => {
  const reversed = slot === 'background' || slot === 'fourth';
  const colours = gradientColours(target.bank, drawing, { front: tools[reversed ? PARTNER[slot] : slot], back: tools[reversed ? slot : PARTNER[slot]] });
  return {
    colors: reversed ? colours.reverse() : colours,
    line: { from: at, to: at },
    kind: drawing.gradientKind,
    reflect: drawing.gradientReflect,
    bayer: drawing.gradientMode === 'dither' ? drawing.gradientSize : null,
    pattern: drawing.gradientPattern,
    ...stencilOf(drawing),
    wrap: wrapOf(),
  };
};

export { gradientSpec };
