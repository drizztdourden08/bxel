/* @layer core @kind types */
import type { Slice, Sprite } from '../../model/sprite.type';

type PickedSlice = { readonly sprite: Sprite; readonly slice: Slice };

export type { PickedSlice };
