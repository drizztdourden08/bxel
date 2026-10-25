/* @layer renderer-app @kind component */
import { Button, Flex } from '@drizztdourden08/tessera';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import { ActionHint } from '../../ActionHint';
import { NEW_TILEMAP_HINT, NEW_TILESET_HINT, TILESET_TEXT } from '../TilesetPanel.constants';

const TilesetNew = () => {
  const show = useTilemapDialogStore((state) => state.show);
  return (
    <Flex gap="xs" wrap>
      <ActionHint hint={NEW_TILESET_HINT}>
        <Button size="sm" variant="tertiary" onClick={() => show('tileset')}>
          {TILESET_TEXT.newTileset}
        </Button>
      </ActionHint>
      <ActionHint hint={NEW_TILEMAP_HINT}>
        <Button size="sm" variant="tertiary" onClick={() => show('tilemap')}>
          {TILESET_TEXT.newTilemap}
        </Button>
      </ActionHint>
    </Flex>
  );
};

export { TilesetNew };
