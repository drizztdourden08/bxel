/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import type { Size, Span } from '../geometry.type';
import { emptyMask } from './empty-mask';

const maskFromSpans = (size: Size, spans: readonly Span[]): MaskView => {
  const mask = emptyMask(size);
  for (const span of spans) {
    const left = Math.max(0, span.x0);
    const right = Math.min(size.width - 1, span.x1);
    if (span.y >= 0 && span.y < size.height && right >= left) {
      mask.bits.fill(1, span.y * size.width + left, span.y * size.width + right + 1);
    }
  }
  return mask;
};

export { maskFromSpans };
