/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import { useTerrainSet } from '../behavior/useTerrainSet';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { SlotDetail } from './SlotDetail';
import { TemplateBoard } from './TemplateBoard';
import { TerrainActions } from './TerrainActions';
import { TerrainSetBar } from './TerrainSetBar';
import { TerrainStart } from './TerrainStart';

const TerrainSection = ({ model }: TilesetModelProps) => {
  const { sets, set } = useTerrainSet(model);
  return (
    <Stack gap="sm" role="group" aria-label={TERRAIN_TEXT.title}>
      {set ? (
        <>
          <TerrainSetBar sets={sets} set={set} />
          <TemplateBoard model={model} set={set} />
          <SlotDetail model={model} sets={sets} set={set} />
          <TerrainActions model={model} sets={sets} set={set} />
          <Text variant="caption" tone="muted">
            {TERRAIN_TEXT.marksHint}
          </Text>
        </>
      ) : (
        <TerrainStart />
      )}
    </Stack>
  );
};

export { TerrainSection };
