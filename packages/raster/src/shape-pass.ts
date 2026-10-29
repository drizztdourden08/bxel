/* @layer core @kind logic */
import { brushStamp } from './brush-stamp';
import { DEFAULT_BRUSH } from './brush.constants';
import { createWriter } from './create-writer';
import type { PixelWriter, ShapeOptions, ShapePass } from './paint.type';

const fillWriterOf = (writer: PixelWriter, fillIndex: number | undefined): PixelWriter =>
  fillIndex === undefined ? writer : { ...writer, index: fillIndex & 255 };

const shapePass = (options: ShapeOptions): { readonly pass: ShapePass; readonly span: number } => {
  const filled = options.filled === true && options.shape !== 'line';
  const stamp = brushStamp(options.brush ?? DEFAULT_BRUSH);
  const writer = createWriter(options);
  const outlined = !filled || (options.fillIndex !== undefined && options.fillIndex !== options.index);
  const pass: ShapePass = {
    writer,
    fillWriter: fillWriterOf(writer, options.fillIndex),
    stamp,
    shape: options.shape,
    filled,
    outlined,
    radius: options.radius ?? 0,
    evenSteps: options.evenSteps === true,
  };
  return { pass, span: filled && !outlined ? 1 : stamp.size };
};

export { shapePass };
