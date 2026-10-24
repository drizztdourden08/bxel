/* @layer renderer-app @kind component */
import { Flex, Tag } from '@drizztdourden08/tessera';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { mapLayerState } from '../behavior/map-layer-state';
import { MapEditChip } from './MapEditChip';
import { TILE_BAR_TEXT } from './TileBar.constants';

const MapChips = () => {
  const context = useMapContext();
  const editing = useTilemapStore((state) => state.editMode === 'edit');
  if (editing) return <MapEditChip />;
  return (
    <Flex gap="xs" align="center">
      <Tag variant="urgency" color="info">
        {TILE_BAR_TEXT.placing}
      </Tag>
      {context?.tilemap && <Tag>{TILE_BAR_TEXT.map(context.tilemap.name)}</Tag>}
      {context?.layer && <Tag>{TILE_BAR_TEXT.layer(context.layer.name, mapLayerState(context.layer))}</Tag>}
    </Flex>
  );
};

export { MapChips };
