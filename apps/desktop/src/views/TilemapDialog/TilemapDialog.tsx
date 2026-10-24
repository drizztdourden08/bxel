/* @layer renderer-app @kind component */
import { useTilemapDialogStore } from '../../stores/useTilemapDialogStore';
import { DeleteTileDialog } from './sub-components/DeleteTileDialog';
import { MapDialog } from './sub-components/MapDialog';
import { TilesetDialog } from './sub-components/TilesetDialog';

const TilemapDialog = () => {
  const kind = useTilemapDialogStore((state) => state.kind);
  if (kind === 'tileset') return <TilesetDialog />;
  if (kind === 'delete') return <DeleteTileDialog />;
  return kind === 'tilemap' ? <MapDialog /> : null;
};

export { TilemapDialog };
