/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../../stores/useTimelineStore';
import { currentFocus } from '../../timeline/current-focus';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { timelineFramesStep } from './timeline-frames-step';
import type { TimelinePatch } from './timeline-patch.type';
import { timelineProblem } from './timeline-problem';
import { timelineSettingsStep } from './timeline-settings-step';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const needsFocus = (patch: TimelinePatch): boolean => patch.frameId !== undefined || patch.pickedFrameIds !== undefined || patch.range !== undefined;

const settle = (patch: TimelinePatch): null => {
  timelineSettingsStep(patch);
  const timeline = useTimelineStore.getState();
  if (patch.playing === true) timeline.play();
  if (patch.playing === false) timeline.pause();
  return null;
};

const timelineStep: ViewStep = (input) => {
  const patch = input.timeline;
  if (!patch) return null;
  const focus = currentFocus();
  if (!focus) return needsFocus(patch) ? viewFail(APP_TOOL_TEXT.timelineNeedsAnimation, 'timeline') : settle(patch);
  const problem = timelineProblem(patch, focus);
  if (problem) return viewFail(problem.message, problem.path);
  timelineFramesStep(patch, focus);
  return settle(patch);
};

export { timelineStep };
