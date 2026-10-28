/* @layer renderer-app @kind logic */
import { ZOOM_PERCENT } from './view-zoom.constants';

const clampPercent = (percent: number): number => Math.min(ZOOM_PERCENT.max, Math.max(ZOOM_PERCENT.min, Math.round(percent)));

export { clampPercent };
