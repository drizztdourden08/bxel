/* @layer core @kind types */
import type { Pivot2, Point, Rect } from './geometry.type';
import type { AnimationId, AnimFrameId, BankId, SpriteId, TagId } from './ids.type';

type AnimDirection = 'forward' | 'reverse' | 'pingpong' | 'pingpongReverse';
type AnimDirections = 'none' | 'four' | 'eight';
type AnimFacing = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
type AnimFlip = 'x' | 'y';

type AnimFrame = {
  readonly id: AnimFrameId;
  readonly spriteId: SpriteId | null;
  readonly clip: Rect | null;
  readonly durationMs: number;
  readonly offset: Point;
  readonly pivot: Pivot2 | null;
};

type AnimSpanTag = {
  readonly kind: 'span';
  readonly id: TagId;
  readonly name: string;
  readonly from: AnimFrameId;
  readonly to: AnimFrameId;
  readonly direction: AnimDirection;
  readonly repeat: number;
  readonly facing?: AnimFacing;
  readonly colour?: string;
};

type AnimMirrorTag = {
  readonly kind: 'mirror';
  readonly id: TagId;
  readonly of: TagId;
  readonly flip: AnimFlip;
  readonly facing: AnimFacing;
};

type AnimTag = AnimSpanTag | AnimMirrorTag;

type AnimLoop = { readonly direction: AnimDirection; readonly repeat: number };

type Animation = {
  readonly id: AnimationId;
  readonly name: string;
  readonly created?: number;
  readonly bankId: BankId;
  readonly width: number;
  readonly height: number;
  readonly anchor: Pivot2;
  readonly loop: AnimLoop;
  readonly directions: AnimDirections;
  readonly directionPattern: string;
  readonly frames: readonly AnimFrame[];
  readonly tags: readonly AnimTag[];
};

export type {
  AnimDirection,
  AnimDirections,
  AnimFacing,
  AnimFlip,
  AnimFrame,
  AnimLoop,
  AnimMirrorTag,
  AnimSpanTag,
  AnimTag,
  Animation,
};
