/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { Button, Center, EmptyState } from '@drizztdourden08/tessera';
import { COMMAND_ZONE } from '../../keymap/command-zone.constants';
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
  if (!context) {
    return (
      <Center direction="column" {...commandZone(COMMAND_ZONE.tileset)}>
        <EmptyState size="sm" message={TILESET_TEXT.empty} />
      </Center>
    );
  }
  if (!model) {
    const action = (
      <Button size="sm" variant="primary" onClick={() => show('tileset')}>
        {TILESET_TEXT.newTileset}
      </Button>
    );
    return (
      <Center direction="column" {...commandZone(COMMAND_ZONE.tileset)}>
        <EmptyState size="sm" message={TILESET_TEXT.noTileset} action={action} />
      </Center>
    );
  }
  return <TilesetBody model={model} />;
};

export { TilesetPanel };
