/* @layer core @kind types */
import type { AnimFrame } from '../../model/animation.type';

type PickedAnimFrame = { readonly frame: AnimFrame; readonly index: number };

export type { PickedAnimFrame };
