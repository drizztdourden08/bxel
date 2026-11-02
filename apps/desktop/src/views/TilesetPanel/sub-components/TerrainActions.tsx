/* @layer renderer-app @kind component */
import { Button, Checkbox, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { TERRAIN_COMMAND } from '../../../keymap/terrain-command-id.constants';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { setTerrainSets } from '../../../tilemap/set-terrain-sets';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import { runTerrainCommand } from '../behavior/run-terrain-command';
import type { PackingPickerProps } from '../behavior/terrain-panel.type';
import { PackingPicker } from './PackingPicker';

const TerrainActions = (props: PackingPickerProps) => {
  const { sets, set } = props;
  const brush = useTilemapStore((state) => state.terrainBrush);
  const setBrush = useTilemapStore((state) => state.setTerrainBrush);
  const replace = (next: typeof set, label: string): void => {
    setTerrainSets(sets.map((each) => (each.id === set.id ? next : each)), label);
  };
  return (
    <Stack gap="xs">
      <Checkbox size="sm" label={TERRAIN_TEXT.brush} help={TERRAIN_TEXT.brushHint} checked={brush} onChange={setBrush} />
      <Text variant="label">{TERRAIN_TEXT.fillFromLayout}</Text>
      <PackingPicker {...props} />
      <Flex gap="xs" wrap>
        <Button size="sm" variant="secondary" title={TERRAIN_TEXT.fillTurningHint} onClick={() => runTerrainCommand(TERRAIN_COMMAND.fillByTurning, { set: set.id })}>
          {TERRAIN_TEXT.fillTurning}
        </Button>
        <Button size="sm" variant="tertiary" onClick={() => replace({ ...set, slots: set.slots.map(() => []) }, TERRAIN_TEXT.clearAll)}>
          {TERRAIN_TEXT.clearAll}
        </Button>
      </Flex>
    </Stack>
  );
};

export { TerrainActions };
