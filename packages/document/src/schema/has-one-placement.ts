/* @layer core @kind logic */
import type { Point } from '../model/geometry.type';

const hasOnePlacement = (value: { readonly points?: readonly Point[]; readonly cells?: readonly Point[] }): boolean =>
  (value.points === undefined) !== (value.cells === undefined);

export { hasOnePlacement };
