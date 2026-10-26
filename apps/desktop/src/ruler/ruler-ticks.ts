/* @layer renderer-app @kind logic */
import { labelStep } from './label-step';
import { minorStep } from './minor-step';
import { PIXEL_SCALE } from './ruler-unit.constants';
import { MIN_ZOOM } from './ruler.constants';
import type { RulerSpan, RulerTick } from './ruler.type';
import { tickText } from './tick-text';

const rulerTicks = (span: RulerSpan): RulerTick[] => {
  const zoom = Math.max(MIN_ZOOM, span.zoom);
  const unit = span.unit ?? { ...PIXEL_SCALE, total: span.count };
  const perUnit = zoom * unit.size;
  const label = labelStep(perUnit);
  const minor = minorStep(label);
  const from = Math.max(0, -span.origin / perUnit);
  const to = Math.min(unit.total, (span.length - span.origin) / perUnit);
  const tick = (value: number, labelled: boolean): RulerTick => ({
    value,
    at: span.origin + value * perUnit,
    label: labelled,
    text: tickText(value, unit.suffix),
  });
  const ticks: RulerTick[] = [];
  for (let value = Math.ceil(from / minor) * minor; value <= to; value += minor) {
    ticks.push(tick(value, value % label === 0));
  }
  const end = ticks[ticks.length - 1];
  if (unit.total <= to && end?.value !== unit.total) ticks.push(tick(unit.total, unit.total % label === 0));
  return ticks;
};

export { rulerTicks };
