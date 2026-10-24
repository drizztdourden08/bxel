/* @layer renderer-app @kind component */
import { Flex, Tag } from '@drizztdourden08/tessera';
import { useToolStore } from '../../../stores/useToolStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { MAP_TOOL_OPTIONS } from '../../OptionsToolbar/OptionsToolbar.constants';
import { flagsLabel } from '../behavior/flags-label';
import { MAP_TEXT } from '../ScopeBar.constants';

const MapStateChips = () => {
  const kinds = useToolStore((state) => MAP_TOOL_OPTIONS[state.tool]);
  const flags = useTilemapStore((state) => state.flags);
  const selection = useTilemapStore((state) => state.selection);
  return (
    <Flex gap="xs" align="center">
      {kinds.includes('mapFlags') && <Tag>{`${MAP_TEXT.turn}: ${flagsLabel(flags)}`}</Tag>}
      {kinds.includes('mapSelection') && <Tag>{selection ? MAP_TEXT.selected(selection.rect.width, selection.rect.height) : MAP_TEXT.noSelection}</Tag>}
    </Flex>
  );
};

export { MapStateChips };
