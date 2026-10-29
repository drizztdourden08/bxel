/* @layer renderer-app @kind logic */
import type { GradientSpec } from './editor.type';
import { gradientColours } from './gradient-colours';
import type { GradientInput } from './gradient-spec.type';
import { PARTNER } from './ink-of.constants';
import { wrapOf } from './wrap-of';

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
