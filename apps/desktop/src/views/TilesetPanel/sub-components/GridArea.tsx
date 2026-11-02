/* @layer renderer-app @kind component */
import { Box, Button, EmptyState, Stack } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { addTile } from '../../../tilemap/add-tile';
import { useGridSelection } from '../behavior/useGridSelection';
import { useGridView } from '../behavior/useGridView';
import { useTilePaint } from '../behavior/useTilePaint';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { GridToolbar } from './GridToolbar';
import { TileGrid } from './TileGrid';
import { TilesetActions } from './TilesetActions';
import { TilesetHeader } from './TilesetHeader';

const GridArea = ({ model }: TilesetModelProps) => {
  const paint = useTilePaint();
  const selection = useGridSelection(model, paint);
  const { view, ref } = useGridView(model, paint.painted);
  const clear = useTilesetViewStore((state) => state.clearFilters);
  const empty = model.cells.length === 0;
  const none = !empty && model.filtering && model.matched === 0;
  const addAction = (
    <Button size="sm" variant="primary" onClick={addTile}>
      {TILESET_TEXT.addTile}
    </Button>
  );
  return (
    <Stack gap="xs" className="tileset-panel__grid-area">
      <TilesetHeader model={model} />
      <GridToolbar model={model} />
      <Box ref={ref} className="tileset-panel__measure">
        {empty ? <EmptyState size="sm" message={TILESET_TEXT.noTiles} action={addAction} /> : <TileGrid model={model} view={view} handlers={selection.handlers} />}
      </Box>
      {none ? (
        <EmptyState
          size="sm"
          message={TILESET_TEXT.noMatch}
          action={
            <Button size="sm" variant="tertiary" onClick={clear}>
              {TILESET_TEXT.clearFilter}
            </Button>
          }
        />
      ) : null}
      <TilesetActions model={model} />
    </Stack>
  );
};

export { GridArea };
