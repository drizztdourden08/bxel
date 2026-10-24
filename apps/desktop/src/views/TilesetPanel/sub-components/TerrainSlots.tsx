/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { slotMask } from '@bxel/document';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import type { TerrainSlotsProps } from '../TilesetPanel.type';
import { TerrainSlot } from './TerrainSlot';

const TerrainSlots = ({ model, rules, onPick }: TerrainSlotsProps) => (
  <Box className="tileset-panel__slots" role="group" aria-label={TERRAIN_TEXT.slots}>
    {rules.keys.map((key, index) => (
      <TerrainSlot
        key={index}
        index={index}
        mask={slotMask(rules.kind, index)}
        cell={model.cells.find((each) => each.tile.key === key)}
        artwork={model.artwork}
        onPick={onPick}
      />
    ))}
  </Box>
);

export { TerrainSlots };
