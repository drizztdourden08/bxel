/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { Button, Flex, Stack } from '@drizztdourden08/tessera';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { GridArea } from './GridArea';
import './TilesetStageBody.css';

const TilesetStageBody = ({ model }: TilesetModelProps) => {
  const show = useTilemapDialogStore((state) => state.show);
  return (
    <Stack gap="sm" className="tileset-stage" {...commandZone(COMMAND_ZONE.tileset)}>
      <GridArea model={model} />
      <Flex gap="sm">
        <Button variant="primary" onClick={() => show('tilemap')}>
          {TILESET_TEXT.newTilemapFromSet}
        </Button>
      </Flex>
    </Stack>
  );
};

export { TilesetStageBody };
