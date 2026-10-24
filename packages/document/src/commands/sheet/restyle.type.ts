/* @layer core @kind types */
import type { Point } from '../../model/geometry.type';
import type { LayoutRequest } from '../../sheet/layout-request.type';

type Restyle = {
  readonly layout?: LayoutRequest | undefined;
  readonly spacing?: Point | undefined;
  readonly margin?: number | undefined;
};

export type { Restyle };
