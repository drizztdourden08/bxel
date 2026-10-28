/* @layer renderer-app @kind logic */
import type { AnimFrameId, TagId } from '@bxel/document';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { currentFocus } from '../../timeline/current-focus';
import { goToFrame } from '../../timeline/go-to-frame';
import { playTag } from '../../timeline/play-tag';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const applyTag = (tag: string | null | undefined): void => {
  if (tag === null) useTimelineStore.getState().selectTag(null);
  else if (typeof tag === 'string') playTag(tag as TagId);
};

const playbackStep: ViewStep = (patch) => {
  const { playback } = patch;
  if (!playback) return null;
  if ((playback.frame !== undefined || typeof playback.tag === 'string') && !currentFocus()) return viewFail(APP_TOOL_TEXT.playbackNeedsAnimation, 'playback');
  const timeline = useTimelineStore.getState();
  if (playback.loop !== undefined) timeline.setLoop(playback.loop);
  if (playback.frame !== undefined) goToFrame(playback.frame as AnimFrameId);
  applyTag(playback.tag);
  if (playback.playing === true) timeline.play();
  if (playback.playing === false) timeline.pause();
  return null;
};

export { playbackStep };
