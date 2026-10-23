/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';

const emptyCel = (size: Size): Uint8Array => new Uint8Array(size.width * size.height);

export { emptyCel };
