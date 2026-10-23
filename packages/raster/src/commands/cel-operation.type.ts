/* @layer core @kind types */
import type { BufferView } from '../buffer.type';
import type { Rect } from '../geometry.type';

type CelOperation = (target: BufferView) => Rect | null;

export type { CelOperation };
