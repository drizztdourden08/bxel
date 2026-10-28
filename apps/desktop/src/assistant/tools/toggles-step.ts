/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../../stores/useTimelineStore';
import { useViewStore } from '../../stores/useViewStore';
import type { ViewStep } from './view-steps.type';

const togglesStep: ViewStep = (patch) => {
  const { toggles } = patch;
  if (!toggles) return null;
  const { tiled, onionSkin, ...flags } = toggles;
  const view = useViewStore.getState();
  view.setToggles(flags);
  if (tiled !== undefined) view.setTiled(tiled);
  if (onionSkin !== undefined) useTimelineStore.getState().setOnion({ on: onionSkin });
  return null;
};

export { togglesStep };
