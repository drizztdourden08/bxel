/* @layer renderer-app @kind logic */
import type { GradientPattern } from '@bxel/raster';
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { buttonItem } from '../../../toolbar-items';
import { DRAWING_TEXT } from '../DrawingOptions.constants';

const patternItem = (
  current: GradientPattern,
  labels: Readonly<Record<GradientPattern, string>>,
  onPick: (pattern: GradientPattern) => void,
): ToolbarItem =>
  buttonItem({
    id: 'gradient-pattern',
    icon: 'pixel-grid',
    hint: { name: DRAWING_TEXT.gradientPattern, description: 'The pattern the dither follows. It stays fixed to the canvas.' },
    caption: labels[current],
    openOn: 'click',
    options: [
      {
        id: 'pattern',
        label: DRAWING_TEXT.gradientPattern,
        items: (Object.keys(labels) as GradientPattern[]).map((each) => ({
          id: each,
          label: labels[each],
          kind: 'radio' as const,
          checked: current === each,
          onSelect: () => onPick(each),
        })),
      },
    ],
    onSelect: () => onPick(current),
  });

export { patternItem };
