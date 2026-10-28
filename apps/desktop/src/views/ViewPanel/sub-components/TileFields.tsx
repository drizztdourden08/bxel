/* @layer renderer-app @kind component */
import { Button, Flex, NumberInput, Text } from '@drizztdourden08/tessera';
import { ASSET_VIEW_TEXT, GRID_SIZE_RANGE } from '../../../asset-view/asset-view.constants';
import { useAssetView } from '../../../asset-view/useAssetView';
import { useGridDefaults } from '../../../asset-view/useGridDefaults';
import { clampRange } from '../behavior/clamp-range';
import { OVERLAY_TEXT } from '../ViewPanel.constants';
import type { FixedProps } from '../ViewPanel.type';

const TileFields = ({ fixed }: FixedProps) => {
  const { view, patch } = useAssetView();
  const defaults = useGridDefaults();
  const tile = view.tileGrid ?? defaults.tile ?? { width: 16, height: 16 };
  const own = view.tileGrid !== null && !fixed;
  return (
    <>
      <Flex gap="xs" align="center" wrap>
        <Text as="span" variant="caption" tone="muted" className="view-panel__field-label">{OVERLAY_TEXT.tileSize}</Text>
        <NumberInput
          size="sm"
          aria-label={OVERLAY_TEXT.tileWidth}
          min={GRID_SIZE_RANGE.min}
          max={GRID_SIZE_RANGE.max}
          value={tile.width}
          disabled={fixed}
          onChange={(value) => patch({ tileGrid: { width: clampRange(value, GRID_SIZE_RANGE), height: tile.height } })}
        />
        <Text as="span" variant="caption" tone="muted" aria-hidden="true">x</Text>
        <NumberInput
          size="sm"
          aria-label={OVERLAY_TEXT.tileHeight}
          min={GRID_SIZE_RANGE.min}
          max={GRID_SIZE_RANGE.max}
          value={tile.height}
          disabled={fixed}
          onChange={(value) => patch({ tileGrid: { width: tile.width, height: clampRange(value, GRID_SIZE_RANGE) } })}
        />
        {own && <Button size="sm" variant="ghost" onClick={() => patch({ tileGrid: null })}>{OVERLAY_TEXT.reset}</Button>}
      </Flex>
      <Text variant="caption" tone="muted">{own ? ASSET_VIEW_TEXT.custom : ASSET_VIEW_TEXT.source[defaults.source]}</Text>
    </>
  );
};

export { TileFields };
