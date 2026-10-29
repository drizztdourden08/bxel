/* @layer core @kind types */
import type { AnimFrame, Animation } from '../../model/animation.type';

type PickedAnimFrame = { readonly frame: AnimFrame; readonly index: number };

type PickedAnimationFrame = { readonly animation: Animation; readonly frame: AnimFrame };

export type { PickedAnimationFrame, PickedAnimFrame };
