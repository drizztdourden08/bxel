/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { Button, EmptyState, Flex, ScrollArea, Stack } from '@drizztdourden08/tessera';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import { useTileHandlers } from '../behavior/useTileHandlers';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetHeaderProps } from '../TilesetPanel.type';
import { TileGrid } from './TileGrid';
import { TilesetHeader } from './TilesetHeader';
import './TilesetStageBody.css';

const TilesetStageBody = ({ model }: TilesetHeaderProps) => {
  const handlers = useTileHandlers(model);
  const show = useTilemapDialogStore((state) => state.show);
  return (
    <Stack gap="sm" className="tileset-stage" {...commandZone(COMMAND_ZONE.tileset)}>
      <TilesetHeader model={model} />
      <ScrollArea axis="y" scrollbar="slim" fade={false} className="tileset-panel__scroll">
        {model.cells.length === 0 ? <EmptyState size="sm" message={TILESET_TEXT.noTiles} /> : <TileGrid model={model} handlers={handlers} />}
      </ScrollArea>
      <Flex gap="sm">
        <Button variant="primary" onClick={() => show('tilemap')}>
          {TILESET_TEXT.newTilemapFromSet}
        </Button>
      </Flex>
    </Stack>
  );
};

export { TilesetStageBody };
