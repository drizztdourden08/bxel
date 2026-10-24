/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import { PixelIcon } from '../../PixelIcon';
import { pickShape } from '../../../editor/pick-shape';
import { SHAPE_KINDS, SHAPE_LABELS } from '../../../editor/tools.constants';
import { SHAPE_KIND_ICONS } from '../../../icons/tool-icons.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { TOOL_RAIL_TEXT } from '../ToolRail.constants';

const ShapeFlyout = () => {
  const shape = useToolStore((state) => state.shape);
  const filled = useToolStore((state) => state.filled);
  const setFilled = useToolStore((state) => state.setFilled);
  const groups: MenuGroup[] = [
    {
      id: 'kind',
      label: TOOL_RAIL_TEXT.kinds,
      items: SHAPE_KINDS.map((kind): MenuItem => ({
        id: kind,
        label: SHAPE_LABELS[kind],
        icon: <PixelIcon name={SHAPE_KIND_ICONS[kind]} />,
        kind: 'radio',
        checked: shape === kind,
        onSelect: () => pickShape(kind),
      })),
    },
    {
      id: 'fill',
      items: [
        {
          id: 'filled',
          label: TOOL_RAIL_TEXT.filled,
          icon: <PixelIcon name="rectangleFilled" />,
          kind: 'check',
          checked: filled,
          onSelect: () => setFilled(!filled),
        },
      ],
    },
  ];
  return (
    <DropdownMenu
      label={TOOL_RAIL_TEXT.flyout}
      trigger={{ label: TOOL_RAIL_TEXT.flyout, icon: 'chevron-down', iconOnly: true }}
      size="xs"
      variant="ghost"
      groups={groups}
    />
  );
};

export { ShapeFlyout };
