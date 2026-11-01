/* @layer renderer-app @kind logic */
import type { DrawingState } from './drawing-store.type';

const drawingVersion = (state: DrawingState): string =>
  [
    JSON.stringify(state.inks), state.onlyColour, state.ditherPattern, state.ditherLevel, state.shadeMode, state.shadeSteps, state.shadeRamp, state.patternAlign, JSON.stringify(state.filled), state.fillColour, state.cornerRadius,
    state.evenSteps, state.curvePerfect, state.curveCubic, state.contourPerfect, state.pickSample, state.pickReturn, state.fillSample, state.fillMatch, state.sprayDensity, state.sprayPressure, state.stabiliser, state.spraySize, state.spraySeed,
    state.gradientKind, state.gradientMode, state.gradientPattern, state.gradientSize, state.gradientReflect, state.gradientRamp, state.brushId, state.brushMode,
    state.lockToTile, state.symmetryDiagonal, state.symmetryTurn,
  ].join('|');

export { drawingVersion };
