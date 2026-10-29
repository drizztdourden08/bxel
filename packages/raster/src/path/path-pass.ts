/* @layer core @kind logic */
import { brushStamp } from '../brush-stamp';
import { DEFAULT_BRUSH } from '../brush.constants';
import { createWriter } from '../create-writer';
import type { PixelWriter } from '../paint.type';
import type { PathOptions } from './path.type';

const pathPass = (options: PathOptions) => {
  const stamp = brushStamp(options.brush ?? DEFAULT_BRUSH);
  const writer = createWriter(options);
  const fillWriter: PixelWriter = options.fillIndex === undefined ? writer : { ...writer, index: options.fillIndex & 255 };
  const filled = options.filled === true;
  const outlined = !filled || (options.fillIndex !== undefined && options.fillIndex !== options.index);
  return { stamp, writer, fillWriter, filled, outlined, span: filled && !outlined ? 1 : stamp.size };
};

export { pathPass };
