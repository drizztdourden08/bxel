/* @layer renderer-app @kind component */
import { Button, Flex, NumberInput, Text } from '@drizztdourden08/tessera';
import { ASSET_VIEW_TEXT, GRID_SIZE_RANGE, MAJOR_RANGE } from '../../../asset-view/asset-view.constants';
import { useAssetView } from '../../../asset-view/useAssetView';
import { useGridDefaults } from '../../../asset-view/useGridDefaults';
import { useViewStore } from '../../../stores/useViewStore';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import { OVERLAY_TEXT } from '../ViewPanel.constants';
import type { SurfaceProps } from '../ViewPanel.type';

const clamp = (value: number, range: { min: number; max: number }): number => Math.min(range.max, Math.max(range.min, Math.round(value)));

const GridSpacing = ({ surface }: SurfaceProps) => {
  const { view, patch } = useAssetView();
  const defaults = useGridDefaults();
  const look = useCanvasLook();
  const major = useViewStore((state) => state.gridMajor);
  const tileOn = useViewStore((state) => state.gridTile);
  const fixed = surface === 'map' || surface === 'sheet';
  const tile = view.tileGrid ?? defaults.tile ?? { width: 16, height: 16 };
  return (
    <Flex direction="column" gap="xs" className="view-panel__spacing">
      {major && !fixed && (
        <Flex gap="xs" align="center">
          <Text as="span" variant="caption" tone="muted" className="view-panel__field-label">{OVERLAY_TEXT.majorEvery}</Text>
          <NumberInput
            size="sm"
            aria-label={OVERLAY_TEXT.majorEvery}
            min={MAJOR_RANGE.min}
            max={MAJOR_RANGE.max}
            value={view.majorEvery ?? look.majorLine.every}
            onChange={(value) => patch({ majorEvery: clamp(value, MAJOR_RANGE) })}
          />
          <Text as="span" variant="caption" tone="muted">{OVERLAY_TEXT.pixels}</Text>
        </Flex>
      )}
      {tileOn && (
        <Flex gap="xs" align="center" wrap>
          <Text as="span" variant="caption" tone="muted" className="view-panel__field-label">{OVERLAY_TEXT.tileSize}</Text>
          <NumberInput
            size="sm"
            aria-label={OVERLAY_TEXT.tileWidth}
            min={GRID_SIZE_RANGE.min}
            max={GRID_SIZE_RANGE.max}
            value={tile.width}
            disabled={fixed}
            onChange={(value) => patch({ tileGrid: { width: clamp(value, GRID_SIZE_RANGE), height: tile.height } })}
          />
          <Text as="span" variant="caption" tone="muted" aria-hidden="true">x</Text>
          <NumberInput
            size="sm"
            aria-label={OVERLAY_TEXT.tileHeight}
            min={GRID_SIZE_RANGE.min}
            max={GRID_SIZE_RANGE.max}
            value={tile.height}
            disabled={fixed}
            onChange={(value) => patch({ tileGrid: { width: tile.width, height: clamp(value, GRID_SIZE_RANGE) } })}
          />
          {view.tileGrid && !fixed && (
            <Button size="xs" variant="ghost" onClick={() => patch({ tileGrid: null })}>{OVERLAY_TEXT.reset}</Button>
          )}
        </Flex>
      )}
      {tileOn && <Text variant="caption" tone="muted">{view.tileGrid && !fixed ? ASSET_VIEW_TEXT.custom : ASSET_VIEW_TEXT.source[defaults.source]}</Text>}
    </Flex>
  );
};

export { GridSpacing };
