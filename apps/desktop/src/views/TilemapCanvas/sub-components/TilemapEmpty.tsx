/* @layer renderer-app @kind component */
import { Button, EmptyState } from '@drizztdourden08/tessera';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import { TILEMAP_TEXT } from '../../../tilemap/tilemap.constants';
import { TilesetStage } from '../../TilesetPanel';

const TilemapEmpty = () => {
  const context = useMapContext();
  const show = useTilemapDialogStore((state) => state.show);
  if (!context) return <EmptyState message={TILEMAP_TEXT.emptyCanvas} />;
  if (context.tileset !== null) return <TilesetStage />;
  const action = (
    <Button variant="primary" onClick={() => show('tileset')}>
      {TILEMAP_TEXT.newTileset}
    </Button>
  );
  return <EmptyState message={TILEMAP_TEXT.noTileset} action={action} />;
};

export { TilemapEmpty };
