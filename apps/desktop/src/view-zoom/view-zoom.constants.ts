/* @layer renderer-app @kind constants */
const ZOOM_PERCENT = { min: 25, max: 12800 } as const;

const ZOOM_PRESETS: readonly number[] = [25, 50, 100, 200, 400, 800, 1600, 3200, 6400, 12800];

const DIGIT_ZOOM: Readonly<Record<string, number>> = { '1': 100, '2': 200, '3': 400, '4': 800, '5': 1600, '6': 3200 };

const ZOOM_SLIDER = { min: 0, max: 1000 } as const;

const SLIDER_SPAN = Math.log(ZOOM_PERCENT.max / ZOOM_PERCENT.min);

const ZOOM_TEXT = {
  region: 'Zoom',
  field: 'Zoom percent',
  slider: 'Zoom level',
  presets: 'Zoom presets',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  fit: 'Fit',
  actual: '1:1',
  selection: 'Selection',
  noSelection: 'Select something first.',
  announce: (percent: number): string => `Zoom ${percent}%`,
  preset: (percent: number): string => `${percent}%`,
} as const;

export { DIGIT_ZOOM, SLIDER_SPAN, ZOOM_PERCENT, ZOOM_PRESETS, ZOOM_SLIDER, ZOOM_TEXT };
