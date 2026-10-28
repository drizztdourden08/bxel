/* @layer renderer-app @kind component */
import { Icon, Text } from '@drizztdourden08/tessera';
import { chipOf } from '../behavior/chip-of';
import type { TileThumbProps } from '../TilesetPanel.type';

const TileBadges = ({ view, cell }: TileThumbProps) => {
  const { tile } = cell;
  const chip = view.mode === 'data' ? chipOf(view.tileset, tile) : null;
  const order = view.order.get(tile.key);
  return (
    <>
      {tile.animation ? <Icon name="pixel-animation" size={12} className="tileset-panel__badge" aria-hidden="true" /> : null}
      {view.showUses && cell.uses > 0 ? (
        <Text as="span" variant="caption" className="tileset-panel__uses" aria-hidden="true">
          {cell.uses}
        </Text>
      ) : null}
      {view.showKeys ? (
        <Text as="span" variant="caption" className="tileset-panel__key" aria-hidden="true">
          {tile.key}
        </Text>
      ) : null}
      {view.mode === 'terrain' && cell.terrainSlot !== null ? (
        <Text as="span" variant="caption" className="tileset-panel__slot-mark" aria-hidden="true">
          {`S${cell.terrainSlot + 1}`}
        </Text>
      ) : null}
      {chip ? (
        <Text as="span" variant="caption" className="tileset-panel__chip" data-chip={chip.tone} aria-hidden="true">
          {chip.letter}
        </Text>
      ) : null}
      {order !== undefined && view.mode === 'animation' ? (
        <Text as="span" variant="caption" className="tileset-panel__order" aria-hidden="true">
          {order}
        </Text>
      ) : null}
    </>
  );
};

export { TileBadges };
