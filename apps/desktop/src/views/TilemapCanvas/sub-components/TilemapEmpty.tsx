/* @layer renderer-app @kind component */
import { Button, EmptyState, Flex } from '@drizztdourden08/tessera';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import { TILEMAP_TEXT } from '../../../tilemap/tilemap.constants';

const TilemapEmpty = () => {
  const context = useMapContext();
  const show = useTilemapDialogStore((state) => state.show);
  if (!context) return <EmptyState message={TILEMAP_TEXT.emptyCanvas} />;
  const needsSet = context.tileset === null;
  const message = needsSet ? TILEMAP_TEXT.noTileset : TILEMAP_TEXT.noMap;
  const action = (
    <Flex gap="sm">
      <Button variant={needsSet ? 'primary' : 'secondary'} onClick={() => show('tileset')}>
        {TILEMAP_TEXT.newTileset}
      </Button>
      <Button variant="primary" disabled={needsSet} onClick={() => show('tilemap')}>
        {TILEMAP_TEXT.newTilemap}
      </Button>
    </Flex>
  );
  return <EmptyState message={message} action={action} />;
};

export { TilemapEmpty };
