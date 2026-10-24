/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { assignSlot } from '../../../tilemap/terrain/assign-slot';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import { setTerrain } from '../../../tilemap/set-terrain';
import type { TilesetHeaderProps } from '../TilesetPanel.type';
import { TerrainActions } from './TerrainActions';
import { TerrainKindControl } from './TerrainKindControl';
import { TerrainSlots } from './TerrainSlots';

const TerrainSection = ({ model }: TilesetHeaderProps) => {
  const rules = model.tileset.terrain;
  const pick = (index: number): void => {
    if (rules && model.pickedKey !== null) setTerrain(assignSlot(rules, index, model.pickedKey));
  };
  return (
    <Stack gap="xs" role="group" aria-label={TERRAIN_TEXT.title}>
      <Text variant="label">{TERRAIN_TEXT.title}</Text>
      <TerrainKindControl model={model} />
      {rules ? (
        <>
          <TerrainSlots model={model} rules={rules} onPick={pick} />
          <Text variant="caption" tone="muted">
            {TERRAIN_TEXT.help}
          </Text>
          <TerrainActions model={model} rules={rules} />
        </>
      ) : (
        <Text variant="caption" tone="muted">
          {TERRAIN_TEXT.none}
        </Text>
      )}
    </Stack>
  );
};

export { TerrainSection };
