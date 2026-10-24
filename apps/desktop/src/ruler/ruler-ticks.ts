/* @layer renderer-app @kind logic */
import { labelStep } from './label-step';
import { minorStep } from './minor-step';
import { MIN_ZOOM } from './ruler.constants';
import type { RulerSpan, RulerTick } from './ruler.type';

const rulerTicks = (span: RulerSpan): RulerTick[] => {
  const zoom = Math.max(MIN_ZOOM, span.zoom);
  const label = labelStep(zoom);
  const minor = minorStep(label);
  const from = Math.max(0, -span.origin / zoom);
  const to = Math.min(span.count, (span.length - span.origin) / zoom);
  const ticks: RulerTick[] = [];
  for (let value = Math.ceil(from / minor) * minor; value <= to; value += minor) {
    ticks.push({ value, at: span.origin + value * zoom, label: value % label === 0 });
  }
  const end = ticks[ticks.length - 1];
  if (span.count <= to && end?.value !== span.count) {
    ticks.push({ value: span.count, at: span.origin + span.count * zoom, label: span.count % label === 0 });
  }
  return ticks;
};

export { rulerTicks };
