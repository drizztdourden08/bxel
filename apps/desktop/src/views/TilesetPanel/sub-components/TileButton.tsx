/* @layer renderer-app @kind component */
import { Icon, Pressable, Text } from '@drizztdourden08/tessera';
import { TILE_ANIMATION_TEXT } from '../../../tile-animation/tile-animation.constants';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TileButtonProps } from '../TilesetPanel.type';
import { TileThumb } from './TileThumb';

const TileButton = ({ cell, index, artwork, handlers }: TileButtonProps) => {
  const animated = cell.tile.animation !== undefined;
  const label = animated ? `${TILESET_TEXT.tile(cell.tile.key, cell.uses)}. ${TILE_ANIMATION_TEXT.badge}` : TILESET_TEXT.tile(cell.tile.key, cell.uses);
  return (
    <Pressable
      type="button"
      className={cell.editing ? 'tileset-panel__tile tileset-panel__tile--editing' : 'tileset-panel__tile'}
      aria-pressed={cell.picked}
      aria-label={label}
      title={cell.editing ? TILESET_TEXT.editing : label}
      data-tile-key={cell.tile.key}
      data-tile-animated={animated ? '' : undefined}
      onPointerDown={(event) => handlers.down(index, event)}
      onPointerEnter={(event) => handlers.enter(index, event)}
      onPointerUp={handlers.up}
      onClick={(event) => handlers.click(index, event)}
    >
      <TileThumb artwork={artwork} sprite={cell.sprite} />
      {animated ? <Icon name="pixel-animation" size={12} className="tileset-panel__badge" aria-hidden="true" /> : null}
      <Text as="span" variant="caption" className="tileset-panel__key">
        {cell.tile.key}
      </Text>
    </Pressable>
  );
};

export { TileButton };
