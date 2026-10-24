/* @layer renderer-app @kind logic */
import { CANVAS_DEFAULTS, RANGES } from './canvas-look.constants';
import type { CanvasLook, CanvasSettings } from './canvas-look.type';
import { checkerSize } from './checker-size';
import { clampSetting } from './clamp-setting';
import { colourOr } from './colour-or';
import { gridLineOf } from './grid-line-of';
import { patternBits } from './pattern-bits';

const lookOf = (settings: CanvasSettings): CanvasLook => {
  const base = CANVAS_DEFAULTS;
  return {
    checkerA: colourOr(settings.checkerA, base.checkerA),
    checkerB: colourOr(settings.checkerB, base.checkerB),
    checkerSize: checkerSize(settings),
    surroundA: colourOr(settings.surroundA, base.surroundA),
    surroundB: colourOr(settings.surroundB, base.surroundB),
    surroundScale: Math.round(clampSetting(settings.surroundScale, RANGES.surroundScale, base.surroundScale)),
    surroundBits: patternBits(settings.surroundPattern, settings.surroundCustom),
    pixelLine: gridLineOf(
      { colour: settings.gridColor, opacity: settings.gridOpacity, every: 1 },
      { min: 1, max: 1 },
      { colour: base.gridColor, opacity: base.gridOpacity, every: 1 },
    ),
    majorLine: gridLineOf(
      { colour: settings.gridMajorColor, opacity: settings.gridMajorOpacity, every: settings.gridMajorEvery },
      RANGES.major,
      { colour: base.gridMajorColor, opacity: base.gridMajorOpacity, every: base.gridMajorEvery },
    ),
    tileLine: gridLineOf(
      { colour: settings.gridTileColor, opacity: settings.gridTileOpacity, every: settings.gridTileSize },
      RANGES.tile,
      { colour: base.gridTileColor, opacity: base.gridTileOpacity, every: base.gridTileSize },
    ),
  };
};

export { lookOf };
