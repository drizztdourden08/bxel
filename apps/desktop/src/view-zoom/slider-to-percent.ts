/* @layer renderer-app @kind logic */
import { clampPercent } from './clamp-percent';
import { SLIDER_SPAN, ZOOM_PERCENT, ZOOM_SLIDER } from './view-zoom.constants';

const sliderToPercent = (value: number): number => {
  const share = (value - ZOOM_SLIDER.min) / (ZOOM_SLIDER.max - ZOOM_SLIDER.min);
  return clampPercent(ZOOM_PERCENT.min * Math.exp(share * SLIDER_SPAN));
};

export { sliderToPercent };
