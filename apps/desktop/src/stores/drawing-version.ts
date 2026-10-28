/* @layer renderer-app @kind logic */
import type { DrawingState } from './drawing-store.type';

const drawingVersion = (state: DrawingState): string =>
  [
    state.inkKind, state.onlyColour, state.ditherPattern, state.ditherLevel, state.shadeMode, state.shadeSteps, state.shadeRamp, JSON.stringify(state.filled), state.fillColour, state.cornerRadius,
    state.evenSteps, state.curvePerfect, state.contourPerfect, state.pickSample, state.fillSample, state.fillMatch, state.sprayDensity, state.spraySize, state.spraySeed,
    state.gradientKind, state.gradientMode, state.gradientPattern, state.gradientSize, state.gradientReflect, state.gradientRamp, state.brushId, state.brushMode,
    state.lockToTile,
  ].join('|');

export { drawingVersion };
