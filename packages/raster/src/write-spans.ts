/* @layer core @kind logic */
import type { Span } from './geometry.type';
import type { PixelWriter } from './paint.type';
import { writePixel } from './write-pixel';

const writeSpan = (writer: PixelWriter, span: Span): void => {
  const last = Math.min(writer.target.width - 1, span.x1);
  for (let x = Math.max(0, span.x0); x <= last; x++) {
    writePixel(writer, x, span.y);
  }
};

const writeSpans = (writer: PixelWriter, spans: readonly Span[]): void => {
  for (const span of spans) {
    if (span.y >= 0 && span.y < writer.target.height) {
      writeSpan(writer, span);
    }
  }
};

export { writeSpans };
