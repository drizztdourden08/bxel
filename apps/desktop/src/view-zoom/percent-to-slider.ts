/* @layer renderer-app @kind logic */
import { clampPercent } from './clamp-percent';
import { SLIDER_SPAN, ZOOM_PERCENT, ZOOM_SLIDER } from './view-zoom.constants';

const percentToSlider = (percent: number): number => {
  const share = Math.log(clampPercent(percent) / ZOOM_PERCENT.min) / SLIDER_SPAN;
  return Math.round(ZOOM_SLIDER.min + share * (ZOOM_SLIDER.max - ZOOM_SLIDER.min));
};

export { percentToSlider };
