/* @layer core @kind types */
import type { CelId } from '../../model/ids.type';
import type { Cel, Layer } from '../../model/sprite.type';

type Pieces = { readonly layers: readonly Layer[]; readonly cels: Readonly<Record<CelId, Cel>> };

export type { Pieces };
