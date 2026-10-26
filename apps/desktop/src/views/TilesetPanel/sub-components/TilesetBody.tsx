/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { EmptyState, ScrollArea, Stack } from '@drizztdourden08/tessera';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { askDeleteTile } from '../../../tilemap/ask-delete-tile';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetHeaderProps } from '../TilesetPanel.type';
import { useTileHandlers } from '../behavior/useTileHandlers';
import { AnimationSection } from './AnimationSection';
import { CollisionSection } from './CollisionSection';
import { TerrainSection } from './TerrainSection';
import { TileGrid } from './TileGrid';
import { TilesetActions } from './TilesetActions';
import { TilesetHeader } from './TilesetHeader';
import { TilesetNew } from './TilesetNew';

const TilesetBody = ({ model }: TilesetHeaderProps) => {
  const handlers = useTileHandlers(model);
  return (
    <Stack gap="xs" {...commandZone(COMMAND_ZONE.tileset)}>
      <TilesetActions model={model} onDelete={askDeleteTile} />
      <ScrollArea axis="y" scrollbar="slim" fade={false} className="tileset-panel__scroll">
        <Stack gap="sm">
          <TilesetHeader model={model} />
          {model.cells.length === 0 ? <EmptyState size="sm" message={TILESET_TEXT.noTiles} /> : <TileGrid model={model} handlers={handlers} />}
          <AnimationSection model={model} />
          <CollisionSection model={model} />
          <TerrainSection model={model} />
          <TilesetNew />
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

export { TilesetBody };
