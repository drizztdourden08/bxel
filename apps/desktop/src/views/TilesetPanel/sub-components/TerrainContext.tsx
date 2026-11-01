/* @layer renderer-app @kind component */
import { Canvas, Stack, Text } from '@drizztdourden08/tessera';
import { useTerrainContext } from '../behavior/useTerrainContext';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TerrainContextProps } from '../TilesetPanel.type';

const TerrainContext = ({ model, tileKey }: TerrainContextProps) => {
  const canvas = useTerrainContext(model, tileKey);
  return (
    <Stack gap="2xs" role="group" aria-label={TILESET_TEXT.context}>
      <Text variant="caption" tone="muted">
        {TILESET_TEXT.contextHint}
      </Text>
      <Canvas ref={canvas} className="tileset-panel__context" role="img" aria-label={TILESET_TEXT.contextPicture(tileKey)} />
    </Stack>
  );
};

export { TerrainContext };
