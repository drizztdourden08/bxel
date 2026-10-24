/* @layer renderer-app @kind component */
import { Button, Checkbox, Flex } from '@drizztdourden08/tessera';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { emptyRules } from '../../../tilemap/terrain/empty-rules';
import { fillSlots } from '../../../tilemap/terrain/fill-slots';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import { setTerrain } from '../../../tilemap/set-terrain';
import type { TerrainActionsProps } from '../TilesetPanel.type';

const TerrainActions = ({ model, rules }: TerrainActionsProps) => {
  const brush = useTilemapStore((state) => state.terrainBrush);
  const setBrush = useTilemapStore((state) => state.setTerrainBrush);
  const { pickedKey } = model;
  return (
    <Flex gap="xs" align="center" wrap>
      <Checkbox size="sm" label={TERRAIN_TEXT.brush} help={TERRAIN_TEXT.brushHint} checked={brush} onChange={setBrush} />
      <Button
        size="sm"
        variant="tertiary"
        disabled={pickedKey === null}
        title={pickedKey === null ? TERRAIN_TEXT.noPick : undefined}
        onClick={() => pickedKey !== null && setTerrain(fillSlots(rules, model.tileset, pickedKey))}
      >
        {TERRAIN_TEXT.fill}
      </Button>
      <Button size="sm" variant="tertiary" onClick={() => setTerrain(emptyRules(rules.kind))}>
        {TERRAIN_TEXT.clear}
      </Button>
    </Flex>
  );
};

export { TerrainActions };
