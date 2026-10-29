/* @layer core @kind types */
import type { BufferView } from '../buffer.type';
import type { Point } from '../geometry.type';

type Oriented = { readonly patch: BufferView; readonly anchor: Point };

export type { Oriented };
