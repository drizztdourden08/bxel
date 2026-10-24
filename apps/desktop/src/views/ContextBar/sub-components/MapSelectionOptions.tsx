/* @layer renderer-app @kind component */
import { Button, Flex, Tag } from '@drizztdourden08/tessera';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { clearCells } from '../../../tilemap/clear-cells';
import { makeUnique } from '../../../tilemap/make-unique';
import { replaceCells } from '../../../tilemap/replace-cells';
import { ActionHint } from '../../ActionHint';
import { CLEAR_CELLS_HINT, REPLACE_ALL_HINT, REPLACE_IN_HINT, TILE_BAR_TEXT, UNIQUE_CELLS_HINT } from './TileBar.constants';

const MapSelectionOptions = () => {
  const selection = useTilemapStore((state) => state.selection);
  const none = selection === null;
  return (
    <Flex gap="xs" align="center">
      <Tag>{selection ? TILE_BAR_TEXT.selected(selection.rect.width, selection.rect.height) : TILE_BAR_TEXT.noSelection}</Tag>
      <ActionHint hint={REPLACE_IN_HINT}>
        <Button size="sm" variant="secondary" disabled={none} onClick={() => replaceCells(false)}>
          {TILE_BAR_TEXT.replaceIn}
        </Button>
      </ActionHint>
      <ActionHint hint={REPLACE_ALL_HINT}>
        <Button size="sm" variant="secondary" disabled={none} onClick={() => replaceCells(true)}>
          {TILE_BAR_TEXT.replaceAll}
        </Button>
      </ActionHint>
      <ActionHint hint={UNIQUE_CELLS_HINT}>
        <Button size="sm" variant="secondary" disabled={none} onClick={makeUnique}>
          {TILE_BAR_TEXT.unique}
        </Button>
      </ActionHint>
      <ActionHint hint={CLEAR_CELLS_HINT}>
        <Button size="sm" variant="tertiary" disabled={none} onClick={clearCells}>
          {TILE_BAR_TEXT.clear}
        </Button>
      </ActionHint>
    </Flex>
  );
};

export { MapSelectionOptions };
