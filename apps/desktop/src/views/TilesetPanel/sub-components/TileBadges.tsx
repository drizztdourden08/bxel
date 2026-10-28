/* @layer renderer-app @kind component */
import { Icon, Text } from '@drizztdourden08/tessera';
import { chipOf } from '../behavior/chip-of';
import type { TileThumbProps } from '../TilesetPanel.type';

const TileBadges = ({ view, cell }: TileThumbProps) => {
  const { tile } = cell;
  const chip = view.mode === 'data' ? chipOf(view.tileset, tile) : null;
  const order = view.mode === 'animation' ? view.order.get(tile.key) : undefined;
  const slot = view.mode === 'terrain' ? cell.terrainSlot : null;
  const marks = [
    { id: 'uses', show: view.showUses && cell.uses > 0, className: 'tileset-panel__uses', text: cell.uses },
    { id: 'key', show: view.showKeys, className: 'tileset-panel__key', text: tile.key },
    { id: 'slot', show: slot !== null, className: 'tileset-panel__slot-mark', text: `S${(slot ?? 0) + 1}` },
    { id: 'order', show: order !== undefined, className: 'tileset-panel__order', text: order },
  ];
  return (
    <>
      {tile.animation ? <Icon name="pixel-animation" size={12} className="tileset-panel__badge" aria-hidden="true" /> : null}
      {marks.map((mark) =>
        mark.show ? (
          <Text key={mark.id} as="span" variant="caption" className={mark.className} aria-hidden="true">
            {mark.text}
          </Text>
        ) : null,
      )}
      {chip ? (
        <Text as="span" variant="caption" className="tileset-panel__chip" data-chip={chip.tone} aria-hidden="true">
          {chip.letter}
        </Text>
      ) : null}
    </>
  );
};

export { TileBadges };
