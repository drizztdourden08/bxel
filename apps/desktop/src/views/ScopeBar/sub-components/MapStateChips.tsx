/* @layer renderer-app @kind component */
import { Flex, Tag } from '@drizztdourden08/tessera';
import { optionsOf } from '../../../editor/tool-options/options-of';
import { useToolStore } from '../../../stores/useToolStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { flagsLabel } from '../behavior/flags-label';
import { MAP_TEXT } from '../ScopeBar.constants';

const MapStateChips = () => {
  const turns = useToolStore((state) => optionsOf('map', state.tool).some((spec) => spec.group === 'turn'));
  const cells = useToolStore((state) => optionsOf('map', state.tool).some((spec) => spec.group === 'actions'));
  const flags = useTilemapStore((state) => state.flags);
  const selection = useTilemapStore((state) => state.selection);
  return (
    <Flex gap="xs" align="center">
      {turns && <Tag>{`${MAP_TEXT.turn}: ${flagsLabel(flags)}`}</Tag>}
      {cells && <Tag>{selection ? MAP_TEXT.selected(selection.rect.width, selection.rect.height) : MAP_TEXT.noSelection}</Tag>}
    </Flex>
  );
};

export { MapStateChips };
