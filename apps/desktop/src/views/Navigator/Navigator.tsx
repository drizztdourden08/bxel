/* @layer renderer-app @kind component */
import { Box, Canvas, Text } from '@drizztdourden08/tessera';
import { useId, useMemo, useRef } from 'react';
import { useElementStyle } from '../../hooks/useElementStyle';
import { useViewFeedStore } from '../../stores/useViewFeedStore';
import { useSelectionRect } from '../../view-zoom/useSelectionRect';
import { navigatorKey } from './behavior/navigator-key';
import { fitThumb } from './behavior/fit-thumb';
import { useNavigatorDraw } from './behavior/useNavigatorDraw';
import { useNavigatorPointer } from './behavior/useNavigatorPointer';
import { useNavigatorWheel } from './behavior/useNavigatorWheel';
import { useStageSize } from './behavior/useStageSize';
import { describeView } from './behavior/describe-view';
import { shownPercent } from './behavior/shown-percent';
import { NAVIGATOR_TEXT } from './Navigator.constants';
import './Navigator.css';

const Navigator = () => {
  const hintId = useId();
  const stage = useRef<HTMLDivElement>(null);
  const thumbBox = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const box = useStageSize(stage);
  const width = useViewFeedStore((state) => state.view?.imageWidth ?? 0);
  const height = useViewFeedStore((state) => state.view?.imageHeight ?? 0);
  const said = useViewFeedStore((state) => (state.view ? describeView(state.view) : ''));
  const percent = useViewFeedStore((state) => (state.view ? shownPercent(state.view) : 100));
  const thumb = useMemo(() => (width > 0 && height > 0 && box.width > 0 ? fitThumb({ width, height }, box) : null), [width, height, box]);
  const parts = useMemo(() => ({ canvas, frame, mark }), []);
  useNavigatorDraw(parts, thumb, useSelectionRect());
  useNavigatorWheel(thumbBox);
  const pointer = useNavigatorPointer(thumb?.scale ?? 1);
  useElementStyle(thumbBox, thumb ? { 'inline-size': `${thumb.width}px`, 'block-size': `${thumb.height}px` } : {});
  return (
    <Box className="view-map" role="group" aria-label={NAVIGATOR_TEXT.region}>
      <Box ref={stage} className="view-map__stage">
        {thumb ? (
          <Box
            ref={thumbBox}
            className="view-map__thumb"
            tabIndex={0}
            role="application"
            aria-roledescription={NAVIGATOR_TEXT.roleDescription}
            aria-label={NAVIGATOR_TEXT.area}
            aria-describedby={hintId}
            onKeyDown={(event) => {
              if (navigatorKey(event.key, event.shiftKey)) event.preventDefault();
            }}
            {...pointer}
          >
            <Canvas ref={canvas} className="view-map__canvas" aria-hidden="true" />
            <Box ref={mark} className="view-map__mark" hidden aria-hidden="true" />
            <Box ref={frame} className="view-map__frame" hidden aria-hidden="true" />
          </Box>
        ) : (
          <Text variant="caption" tone="muted">{NAVIGATOR_TEXT.empty}</Text>
        )}
      </Box>
      <Text as="span" id={hintId} className="visually-hidden">{thumb ? said : NAVIGATOR_TEXT.hint}</Text>
      {thumb && <Text as="span" variant="caption" tone="muted" className="view-map__caption" aria-hidden="true">{NAVIGATOR_TEXT.caption(width, height, percent)}</Text>}
    </Box>
  );
};

export { Navigator };
