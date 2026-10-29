/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../../stores/useTimelineStore';
import type { TimelinePatch } from './timeline-patch.type';

const applyZoom = (zoom: NonNullable<TimelinePatch['zoom']>): void => {
  const timeline = useTimelineStore.getState();
  if (zoom === 'fit') timeline.setFit(true);
  else timeline.setZoom(zoom);
};

const timelineSettingsStep = (patch: TimelinePatch): void => {
  const timeline = useTimelineStore.getState();
  if (patch.playMode !== undefined) timeline.setPlayMode(patch.playMode);
  if (patch.speed !== undefined) timeline.setSpeed(patch.speed);
  if (patch.zoom !== undefined) applyZoom(patch.zoom);
  if (patch.timeMode !== undefined) timeline.setTimeMode(patch.timeMode);
  if (patch.units !== undefined) timeline.setUnits(patch.units);
  if (patch.onion !== undefined) timeline.setOnion(patch.onion);
};

export { timelineSettingsStep };
