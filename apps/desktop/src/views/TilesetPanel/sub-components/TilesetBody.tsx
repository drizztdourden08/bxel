/* @layer renderer-app @kind component */
import { EmptyState, Stack } from '@drizztdourden08/tessera';
import { askDeleteTile } from '../../../tilemap/ask-delete-tile';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetHeaderProps } from '../TilesetPanel.type';
import { useTileHandlers } from '../behavior/useTileHandlers';
import { CollisionSection } from './CollisionSection';
import { TerrainSection } from './TerrainSection';
import { TileGrid } from './TileGrid';
import { TilesetActions } from './TilesetActions';
import { TilesetHeader } from './TilesetHeader';

const TilesetBody = ({ model }: TilesetHeaderProps) => {
  const handlers = useTileHandlers(model);
  return (
    <Stack gap="sm">
      <TilesetHeader model={model} />
      <TilesetActions model={model} onDelete={askDeleteTile} />
      {model.cells.length === 0 ? <EmptyState size="sm" message={TILESET_TEXT.noTiles} /> : <TileGrid model={model} handlers={handlers} />}
      <CollisionSection model={model} />
      <TerrainSection model={model} />
    </Stack>
  );
};

export { TilesetBody };
