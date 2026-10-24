/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import { MODE_LABELS, SELECT_LABELS, SELECT_MODES, SELECT_VARIANTS } from '../../../editor/selection/selection.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useToolStore } from '../../../stores/useToolStore';
import { TOOL_RAIL_TEXT } from '../ToolRail.constants';

const SelectFlyout = () => {
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
        kind: 'radio',
        checked: mode === each,
        onSelect: () => setMode(each),
      })),
    },
  ];
  return (
    <DropdownMenu
      label={TOOL_RAIL_TEXT.selectFlyout}
      trigger={{ label: TOOL_RAIL_TEXT.selectFlyout, icon: 'chevron-down', iconOnly: true }}
      size="xs"
      variant="ghost"
      groups={groups}
    />
  );
};

export { SelectFlyout };
