/* @layer renderer-app @kind logic */
import type { Ink } from '@bxel/raster';
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { ToolSettings } from '../stores/tool-store.type';
import type { ColourSlot } from './press-plan.type';

type InkChoice = { readonly index: number; readonly ink: Ink | undefined };

const PARTNER: Readonly<Record<ColourSlot, ColourSlot>> = {
  foreground: 'background',
  background: 'foreground',
  third: 'fourth',
  fourth: 'third',
};

const inkOf = (slot: ColourSlot, tools: ToolSettings, drawing: DrawingSettings): InkChoice => {
  const index = tools[slot];
  const other = tools[PARTNER[slot]];
  const reversed = slot === 'background' || slot === 'fourth';
  const steps = drawing.shadeSteps;
  switch (drawing.inkKind) {
    case 'behind':
      return { index, ink: { kind: 'behind' } };
    case 'lockAlpha':
      return { index, ink: { kind: 'lockAlpha' } };
    case 'onlyColour':
      return { index, ink: { kind: 'onlyColour', index: drawing.onlyColour ?? other } };
    case 'dither':
      return { index, ink: { kind: 'dither', pattern: drawing.ditherPattern, level: drawing.ditherLevel, second: other } };
    case 'shade':
      return { index, ink: { kind: 'shade', ...(drawing.shadeRamp === null ? {} : { ramp: drawing.shadeRamp }), direction: reversed ? 'down' : 'up', steps } };
    case 'lighten':
      return { index, ink: { kind: reversed ? 'darken' : 'lighten', steps } };
    case 'darken':
      return { index, ink: { kind: reversed ? 'lighten' : 'darken', steps } };
    case 'normal':
      return { index, ink: undefined };
  }
};

export { inkOf, PARTNER };
export type { InkChoice };
