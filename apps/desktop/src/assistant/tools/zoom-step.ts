/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../../stores/useTimelineStore';
import { useViewStore } from '../../stores/useViewStore';
import { playTag } from '../../timeline/play-tag';
import { goToFrame } from '../../timeline/go-to-frame';
import { currentFocus } from '../../timeline/current-focus';
import type { AnimFrameId, TagId } from '@bxel/document';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const zoomStep: ViewStep = (patch) => {
  const { zoom } = patch;
  if (zoom === undefined) return null;
  const { viewport } = useViewStore.getState();
  if (!viewport) return viewFail(APP_TOOL_TEXT.noViewport, 'zoom');
  if (zoom === 'fit') viewport.fit();
  else if (zoom === 'actual') viewport.setZoom(1);
  else if (typeof zoom === 'number') viewport.setZoom(zoom / 100);
  else {
    const { rect } = zoom;
    const view = viewport.view();
    viewport.setZoom(Math.min(view.width / rect.width, view.height / rect.height));
    viewport.panTo({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
  }
  return null;
};

const panStep: ViewStep = (patch) => {
  const { pan } = patch;
  if (!pan) return null;
  const { viewport } = useViewStore.getState();
  if (!viewport) return viewFail(APP_TOOL_TEXT.noViewport, 'pan');
  viewport.panTo({ x: pan.centreX, y: pan.centreY });
  return null;
};

const togglesStep: ViewStep = (patch) => {
  const { toggles } = patch;
  if (!toggles) return null;
  const { tiled, onionSkin, ...flags } = toggles;
  const view = useViewStore.getState();
  view.setToggles(Object.fromEntries(Object.entries(flags).filter(([, value]) => value !== undefined)));
  if (tiled !== undefined) view.setTiled(tiled);
  if (onionSkin !== undefined) useTimelineStore.getState().setOnion({ on: onionSkin });
  return null;
};

const playbackStep: ViewStep = (patch) => {
  const { playback } = patch;
  if (!playback) return null;
  if ((playback.frame !== undefined || playback.tag != null) && !currentFocus()) return viewFail(APP_TOOL_TEXT.playbackNeedsAnimation, 'playback');
  const timeline = useTimelineStore.getState();
  if (playback.loop !== undefined) timeline.setLoop(playback.loop);
  if (playback.frame !== undefined) goToFrame(playback.frame as AnimFrameId);
  if (playback.tag === null) timeline.selectTag(null);
  else if (playback.tag !== undefined) playTag(playback.tag as TagId);
  if (playback.playing === true) timeline.play();
  if (playback.playing === false) timeline.pause();
  return null;
};

export { panStep, playbackStep, togglesStep, zoomStep };
