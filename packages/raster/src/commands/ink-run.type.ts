/* @layer core @kind types */
import type { Draft, ResolvedCel } from '@bxel/document';
import type { BufferView } from '../buffer.type';
import type { Rect } from '../geometry.type';
import type { Ink, InkRule } from '../ink/ink.type';

type InkedOperate = (target: BufferView, rule: InkRule | null, cel: ResolvedCel) => Rect | null;

type InkedRun = {
  readonly draft: Draft;
  readonly cels: readonly ResolvedCel[];
  readonly ink: Ink | undefined;
};

export type { InkedOperate, InkedRun };
