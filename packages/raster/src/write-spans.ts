/* @layer core @kind logic */
import type { Span } from './geometry.type';
import type { PixelWriter } from './paint.type';
import { writePixel } from './write-pixel';

const writeSpan = (writer: PixelWriter, span: Span): void => {
  const wrapped = writer.wrap.x === true;
  const first = wrapped ? span.x0 : Math.max(0, span.x0);
  const last = wrapped ? span.x1 : Math.min(writer.target.width - 1, span.x1);
  for (let x = first; x <= last; x++) {
    writePixel(writer, x, span.y);
  }
};

const writeSpans = (writer: PixelWriter, spans: readonly Span[]): void => {
  for (const span of spans) {
    if (writer.wrap.y === true || (span.y >= 0 && span.y < writer.target.height)) {
      writeSpan(writer, span);
    }
  }
};

export { writeSpans };
