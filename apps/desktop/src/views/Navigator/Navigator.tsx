/* @layer renderer-app @kind component */
import { Box, Canvas, Navigator as TesseraNavigator, Text } from '@drizztdourden08/tessera';
import { useMemo, useRef } from 'react';
import { useElementStyle } from '../../hooks/useElementStyle';
import { useSelectionRect } from '../../view-zoom/useSelectionRect';
import { fitThumb } from './behavior/fit-thumb';
import { moveView } from './behavior/move-view';
import { navigatorKey } from './behavior/navigator-key';
import { navigatorOverlays } from './behavior/navigator-overlays';
import { useNavigatorDraw } from './behavior/useNavigatorDraw';
import { useNavigatorFacts } from './behavior/useNavigatorFacts';
import { useOtherViewRect } from './behavior/useOtherViewRect';
import { useStageSize } from './behavior/useStageSize';
import { wheelZoom } from './behavior/wheel-zoom';
import { NAVIGATOR_KEY_SHARE, NAVIGATOR_TEXT } from './Navigator.constants';
import './Navigator.css';

const Navigator = () => {
  const stage = useRef<HTMLDivElement>(null);
  const thumbBox = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useStageSize(stage);
  const facts = useNavigatorFacts();
  const selection = useSelectionRect();
  const other = useOtherViewRect();
  const width = facts?.imageWidth ?? 0;
  const height = facts?.imageHeight ?? 0;
  const thumb = useMemo(() => (width > 0 && height > 0 && box.width > 0 ? fitThumb({ width, height }, box) : null), [width, height, box]);
  const overlays = useMemo(() => navigatorOverlays(selection, other), [selection, other]);
  useNavigatorDraw(canvas, thumb);
  useElementStyle(thumbBox, thumb ? { 'inline-size': `${thumb.width}px`, 'block-size': `${thumb.height}px` } : {});
  return (
    <Box className="view-map" role="group" aria-label={NAVIGATOR_TEXT.region}>
      <Box ref={stage} className="view-map__stage">
        {thumb && facts ? (
          <Box ref={thumbBox} className="view-map__thumb">
            <TesseraNavigator
              className="view-map__navigator"
              label={NAVIGATOR_TEXT.area}
              surface={{ width, height }}
              viewport={facts}
              step={Math.max(1, facts.width * NAVIGATOR_KEY_SHARE)}
              bigStep={Math.max(1, facts.width)}
              unclamped
              overlays={overlays}
              describe={facts.said}
              onViewportChange={moveView}
              onWheelZoom={wheelZoom}
              onKey={(event) => navigatorKey(event.key)}
            >
              <Canvas ref={canvas} className="view-map__canvas" aria-hidden="true" />
            </TesseraNavigator>
          </Box>
        ) : (
          <Text variant="caption" tone="muted">{NAVIGATOR_TEXT.empty}</Text>
        )}
      </Box>
      {thumb && facts && <Text as="span" variant="caption" tone="muted" className="view-map__caption" aria-hidden="true">{NAVIGATOR_TEXT.caption(width, height, facts.percent)}</Text>}
    </Box>
  );
};

export { Navigator };
