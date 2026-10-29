/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { missingSlots } from '../../../tilemap/terrain/missing-slots';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import { slotView } from '../behavior/slot-view';
import type { TerrainBoardProps } from '../behavior/terrain-panel.type';
import { TerrainSlot } from './TerrainSlot';

const TemplateBoard = ({ model, set }: TerrainBoardProps) => {
  const slot = useTilesetViewStore((state) => state.terrainSlot);
  const select = useTilesetViewStore((state) => state.setTerrainSlot);
  const view = slotView(model.artwork, model.tileset);
  return (
    <Box role="group" aria-label={TERRAIN_TEXT.board}>
      <Text variant="caption" tone="muted" role="status">
        {TERRAIN_TEXT.missing(missingSlots(set).length, set.slots.length)}
      </Text>
      <Box className="tileset-panel__slots">
        {set.slots.map((variants, index) => (
          <TerrainSlot key={index} index={index} set={set} cell={model.byKey.get(variants[0]?.key ?? 0)} view={view} selected={slot === index} onPick={select} />
        ))}
      </Box>
    </Box>
  );
};

export { TemplateBoard };
