/* @layer renderer-app @kind component */
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import { PixelIcon } from '../../PixelIcon';
import { MODE_DESCRIPTIONS, MODE_KEYS, SELECT_DESCRIPTIONS } from '../../../editor/tool-descriptions.constants';
import { MODE_LABELS, SELECT_LABELS, SELECT_MODES, SELECT_VARIANTS } from '../../../editor/selection/selection.constants';
import { SELECT_VARIANT_ICONS } from '../../../icons/tool-icons.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useToolStore } from '../../../stores/useToolStore';
import { TOOL_RAIL_TEXT } from '../ToolRail.constants';
import type { ToolButtonProps } from '../ToolRail.type';
import { ToolFlyout } from './ToolFlyout';

const SelectFlyout = (props: ToolButtonProps) => {
  const variant = useSelectionStore((state) => state.variant);
  const mode = useSelectionStore((state) => state.mode);
  const setVariant = useSelectionStore((state) => state.setVariant);
  const setMode = useSelectionStore((state) => state.setMode);
  const selectTool = useToolStore((state) => state.selectTool);
  const groups: MenuGroup[] = [
    {
      id: 'shape',
      label: TOOL_RAIL_TEXT.selectShapes,
      items: SELECT_VARIANTS.map((each): MenuItem => ({
        id: each,
        label: SELECT_LABELS[each],
        description: SELECT_DESCRIPTIONS[each],
        icon: <PixelIcon name={SELECT_VARIANT_ICONS[each]} />,
        kind: 'radio',
        checked: variant === each,
        onSelect: () => {
          setVariant(each);
          selectTool('select');
        },
      })),
    },
    {
      id: 'mode',
      label: TOOL_RAIL_TEXT.selectModes,
      items: SELECT_MODES.map((each): MenuItem => ({
        id: each,
        label: MODE_LABELS[each],
        description: MODE_DESCRIPTIONS[each],
        shortcut: MODE_KEYS[each].length > 0 ? MODE_KEYS[each] : undefined,
        kind: 'radio',
        checked: mode === each,
        onSelect: () => setMode(each),
      })),
    },
  ];
  return <ToolFlyout {...props} groups={groups} />;
};

export { SelectFlyout };
