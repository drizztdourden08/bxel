/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { ToolSettings } from '../stores/tool-store.type';
import type { EditorTarget, GradientSpec } from './editor.type';
import { gradientColours } from './gradient-colours';
import { PARTNER } from './ink-of';
import type { ColourSlot } from './press-plan.type';
import { wrapOf } from './wrap-of';

type GradientInput = {
  readonly tools: ToolSettings;
  readonly drawing: DrawingSettings;
  readonly target: EditorTarget;
  readonly slot: ColourSlot;
  readonly at: Point;
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
    wrap: wrapOf(),
  };
};

export { gradientSpec };
