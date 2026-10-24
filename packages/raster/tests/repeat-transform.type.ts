/* @layer tests @kind types */
import type { Pivot2, Size } from '@bxel/document';
import type { BufferView } from '@bxel/raster';

type Repeated = { readonly view: BufferView; readonly size: Size; readonly pivot: Pivot2 };

export type { Repeated };
