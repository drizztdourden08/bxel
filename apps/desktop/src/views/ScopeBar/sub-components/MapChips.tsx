/* @layer renderer-app @kind component */
import { Flex, Tag } from '@drizztdourden08/tessera';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { mapLayerState } from '../behavior/map-layer-state';
import { MapEditChip } from './MapEditChip';
import { MAP_TEXT } from '../ScopeBar.constants';

const MapChips = () => {
  const context = useMapContext();
  const editing = useTilemapStore((state) => state.editMode === 'edit');
  if (editing) return <MapEditChip />;
  return (
    <Flex gap="xs" align="center">
      <Tag variant="urgency" color="info">
        {MAP_TEXT.placing}
      </Tag>
      {context?.tilemap && <Tag>{MAP_TEXT.map(context.tilemap.name)}</Tag>}
      {context?.layer && <Tag>{MAP_TEXT.layer(context.layer.name, mapLayerState(context.layer))}</Tag>}
    </Flex>
  );
};

export { MapChips };
