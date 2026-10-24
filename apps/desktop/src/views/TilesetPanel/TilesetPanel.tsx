/* @layer renderer-app @kind component */
import { Button, EmptyState } from '@drizztdourden08/tessera';
import { useTilemapDialogStore } from '../../stores/useTilemapDialogStore';
import { useMapContext } from '../../hooks/useMapContext';
import { TILESET_TEXT } from './TilesetPanel.constants';
import { useTilesetModel } from './behavior/useTilesetModel';
import { TilesetBody } from './sub-components/TilesetBody';
import './TilesetPanel.css';

const TilesetPanel = () => {
  const context = useMapContext();
  const model = useTilesetModel();
  const show = useTilemapDialogStore((state) => state.show);
  if (!context) return <EmptyState message={TILESET_TEXT.empty} />;
  if (!model) {
    const action = (
      <Button size="sm" variant="primary" onClick={() => show('tileset')}>
        {TILESET_TEXT.newTileset}
      </Button>
    );
    return <EmptyState size="sm" message={TILESET_TEXT.noTileset} action={action} />;
  }
  return <TilesetBody model={model} />;
};

export { TilesetPanel };
