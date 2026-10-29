/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, NumberInput, Text } from '@drizztdourden08/tessera';
import { MAX_TILE_PROBABILITY } from '@bxel/document';
import { isTurned } from '../../../tilemap/terrain/is-turned';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import { slotView } from '../behavior/slot-view';
import type { VariantRowProps } from '../behavior/terrain-panel.type';
import { TileThumb } from './TileThumb';

const VariantRow = ({ model, variant, onChange, onRemove }: VariantRowProps) => {
  const cell = model.byKey.get(variant.key);
  const turned = isTurned(variant);
  return (
    <Flex gap="xs" align="center" className="tileset-panel__variant">
      {cell ? <TileThumb view={slotView(model.artwork, model.tileset)} cell={cell} /> : null}
      <Text variant="caption">{turned ? `Tile ${variant.key}, ${TERRAIN_TEXT.turned}` : `Tile ${variant.key}`}</Text>
      <NumberInput
        size="sm"
        aria-label={TERRAIN_TEXT.weight(variant.key)}
        min={0}
        max={MAX_TILE_PROBABILITY}
        step={0.5}
        value={variant.weight}
        onChange={(weight) => Number.isFinite(weight) && weight >= 0 && onChange(weight)}
      />
      <IconButton label={TERRAIN_TEXT.removeVariant(variant.key)} size="sm" onClick={onRemove}>
        <Icon name="x" size={16} />
      </IconButton>
    </Flex>
  );
};

export { VariantRow };
