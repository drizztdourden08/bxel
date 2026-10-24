/* @layer renderer-app @kind component */
import { Pressable, Text } from '@drizztdourden08/tessera';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TileButtonProps } from '../TilesetPanel.type';
import { TileThumb } from './TileThumb';

const TileButton = ({ cell, index, artwork, handlers }: TileButtonProps) => (
  <Pressable
    type="button"
    className={cell.editing ? 'tileset-panel__tile tileset-panel__tile--editing' : 'tileset-panel__tile'}
    aria-pressed={cell.picked}
    aria-label={TILESET_TEXT.tile(cell.tile.key, cell.uses)}
    title={cell.editing ? TILESET_TEXT.editing : TILESET_TEXT.tile(cell.tile.key, cell.uses)}
    data-tile-key={cell.tile.key}
    onPointerDown={(event) => handlers.down(index, event)}
    onPointerEnter={(event) => handlers.enter(index, event)}
    onPointerUp={handlers.up}
    onClick={(event) => handlers.click(index, event)}
  >
    <TileThumb artwork={artwork} sprite={cell.sprite} />
    <Text as="span" variant="caption" className="tileset-panel__key">
      {cell.tile.key}
    </Text>
  </Pressable>
);

export { TileButton };
