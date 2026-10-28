/* @layer renderer-app @kind component */
import { Flex, SegmentedControl } from '@drizztdourden08/tessera';
import { useAssetView } from '../../../asset-view/useAssetView';
import { useAssetLook } from '../../../asset-view/useAssetLook';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import { RULER_UNITS } from '../../../ruler/ruler-unit.constants';
import { useRulerUnitStore } from '../../../stores/useRulerUnitStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useViewStore } from '../../../stores/useViewStore';
import { ActionHint } from '../../ActionHint';
import { VIEW_HINTS } from '../../CanvasToolbar/CanvasToolbar.constants';
import { swatchOf } from '../behavior/swatch-of';
import { OVERLAY_TEXT, RULER_UNIT_NAMES } from '../ViewPanel.constants';
import type { ViewToggle } from '../../../stores/view-store.type';
import type { SurfaceProps } from '../ViewPanel.type';
import { GridSpacing } from './GridSpacing';
import { OverlayRow } from './OverlayRow';

const OverlaysSection = ({ surface }: SurfaceProps) => {
  const view = useViewStore();
  const asset = useAssetView();
  const look = useAssetLook(useCanvasLook());
  const unit = useRulerUnitStore((state) => state.unit);
  const collision = useTilemapStore((state) => state.showCollision);
  const animate = useTilemapStore((state) => state.animateTiles);
  const pixels = surface === 'sprite' || surface === 'tile';
  const cells = surface === 'map' || surface === 'sheet';
  const row = (toggle: ViewToggle, label?: string) => (
    <ActionHint key={toggle} hint={VIEW_HINTS[toggle]} placement="left">
      <OverlayRow
        label={label ?? VIEW_HINTS[toggle].name}
        description={VIEW_HINTS[toggle].description}
        checked={view[toggle]}
        onChange={() => view.toggleView(toggle)}
        swatch={swatchOf(toggle, look)}
      />
    </ActionHint>
  );
  return (
    <Flex direction="column" gap="xs">
      {pixels && row('grid')}
      {pixels && row('gridMajor')}
      {row('gridTile', cells ? OVERLAY_TEXT.cellGrid : undefined)}
      <GridSpacing surface={surface} />
      {row('guides')}
      {row('rulers')}
      {row('snap')}
      <SegmentedControl
        size="sm"
        label={OVERLAY_TEXT.rulerUnit}
        value={unit}
        options={RULER_UNITS.map((each) => ({ value: each, label: RULER_UNIT_NAMES[each] }))}
        onChange={(next) => useRulerUnitStore.getState().choose(next)}
      />
      {surface === 'sheet' && (
        <>
          <OverlayRow label={OVERLAY_TEXT.labels} description={OVERLAY_TEXT.labelsDescription} checked={asset.view.labels} onChange={(labels) => asset.patch({ labels })} />
          <OverlayRow label={OVERLAY_TEXT.overlaps} description={OVERLAY_TEXT.overlapsDescription} checked={asset.view.overlaps} onChange={(overlaps) => asset.patch({ overlaps })} />
          <OverlayRow label={OVERLAY_TEXT.pivots} description={OVERLAY_TEXT.pivotsDescription} checked={asset.view.pivots} onChange={(pivots) => asset.patch({ pivots })} />
        </>
      )}
      {surface === 'map' && (
        <>
          <OverlayRow label={OVERLAY_TEXT.collision} description={OVERLAY_TEXT.collisionDescription} checked={collision} onChange={(on) => useTilemapStore.getState().setShowCollision(on)} />
          <OverlayRow label={OVERLAY_TEXT.animate} description={OVERLAY_TEXT.animateDescription} checked={animate} onChange={(on) => useTilemapStore.getState().setAnimateTiles(on)} />
        </>
      )}
    </Flex>
  );
};

export { OverlaysSection };
