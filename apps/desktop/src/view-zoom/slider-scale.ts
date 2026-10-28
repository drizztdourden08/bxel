/* @layer renderer-app @kind logic */
import { clampPercent } from './clamp-percent';
import { ZOOM_PERCENT, ZOOM_SLIDER } from './view-zoom.constants';

const span = Math.log(ZOOM_PERCENT.max / ZOOM_PERCENT.min);

const percentToSlider = (percent: number): number => {
  const share = Math.log(clampPercent(percent) / ZOOM_PERCENT.min) / span;
  return Math.round(ZOOM_SLIDER.min + share * (ZOOM_SLIDER.max - ZOOM_SLIDER.min));
};

const sliderToPercent = (value: number): number => {
  const share = (value - ZOOM_SLIDER.min) / (ZOOM_SLIDER.max - ZOOM_SLIDER.min);
  return clampPercent(ZOOM_PERCENT.min * Math.exp(share * span));
};

export { percentToSlider, sliderToPercent };
