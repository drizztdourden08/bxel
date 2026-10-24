/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { SHAPE_KINDS } from '../../../editor/tools.constants';
import { SHAPE_KIND_ICONS } from '../../../icons/tool-icons.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { choose, hintChoice, toggleItem } from '../../../toolbar-items';
import { FILLED_HINT, OPTIONS_TEXT, SHAPE_HINTS } from '../OptionsToolbar.constants';

const useShapeItems = (): ToolbarItem[] => {
  const shape = useToolStore((state) => state.shape);
  const filled = useToolStore((state) => state.filled);
  const setShape = useToolStore((state) => state.setShape);
  const setFilled = useToolStore((state) => state.setFilled);
  return [
    {
      kind: 'group',
      id: 'shape-kind',
      label: OPTIONS_TEXT.shapeKind,
      value: shape,
      choices: SHAPE_KINDS.map((each) => hintChoice(each, SHAPE_KIND_ICONS[each], SHAPE_HINTS[each])),
      onChange: choose(SHAPE_KINDS, setShape),
    },
    toggleItem({
      id: 'shape-filled',
      icon: 'pixel-shape-rect-filled',
      hint: FILLED_HINT,
      caption: OPTIONS_TEXT.filledCaption,
      disabled: shape === 'line',
      pressed: filled,
      onChange: setFilled,
    }),
  ];
};

export { useShapeItems };
