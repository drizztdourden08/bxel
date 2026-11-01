/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import { Flex, SegmentedControl } from '@drizztdourden08/tessera';
import { useAssetLook } from '../../../asset-view/useAssetLook';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import { RULER_UNITS } from '../../../ruler/ruler-unit.constants';
import { useRulerUnitStore } from '../../../stores/useRulerUnitStore';
import { useLintStore } from '../../../stores/useLintStore';
import { useViewStore } from '../../../stores/useViewStore';
import { LINT_TEXT } from '../../../pixel-lint/pixel-lint.constants';
import { ActionHint } from '../../ActionHint';
import { VIEW_HINTS } from '../../CanvasToolbar/CanvasToolbar.constants';
import { swatchOf } from '../behavior/swatch-of';
import { OVERLAY_TEXT, RULER_UNIT_NAMES } from '../ViewPanel.constants';
import type { ViewToggle } from '../../../stores/view-store.type';
import type { SurfaceProps } from '../ViewPanel.type';
import { GridSpacing } from './GridSpacing';
import { MODE_ROWS } from './OverlaysSection.constants';
import { OverlayRow } from './OverlayRow';
import { SurfaceOverlayRows } from './SurfaceOverlayRows';

const OverlaysSection = ({ surface }: SurfaceProps) => {
  const view = useViewStore();
  const look = useAssetLook(useCanvasLook());
  const unit = useRulerUnitStore((state) => state.unit);
  const pixels = surface === 'sprite' || surface === 'tile';
  const lintShown = useLintStore((state) => state.shown);
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
  const modeRows = (shown: boolean, make: (toggle: ViewToggle) => ReactNode): ReactNode => [make('lockGuides'), make('hideOverlays'), ...(shown ? MODE_ROWS.map(make) : [])];
  return (
    <Flex direction="column" gap="xs">
      {pixels && row('grid')}
      {pixels && row('gridMajor')}
      {row('gridTile', cells ? OVERLAY_TEXT.cellGrid : undefined)}
      {pixels && row('gridIso')}
      <GridSpacing surface={surface} />
      {row('guides')}
      {row('rulers')}
      {row('snap')}
      {pixels && row('slices')}
      {pixels && <OverlayRow label={LINT_TEXT.label} description={LINT_TEXT.description} checked={lintShown} onChange={(on) => useLintStore.getState().setShown(on)} />}
      {modeRows(pixels, row)}
      <SegmentedControl
        size="sm"
        label={OVERLAY_TEXT.rulerUnit}
        value={unit}
        options={RULER_UNITS.map((each) => ({ value: each, label: RULER_UNIT_NAMES[each] }))}
        onChange={(next) => useRulerUnitStore.getState().choose(next)}
      />
      <SurfaceOverlayRows surface={surface} />
    </Flex>
  );
};

export { OverlaysSection };
