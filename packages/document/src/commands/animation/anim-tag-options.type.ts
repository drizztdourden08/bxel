/* @layer core @kind types */
import type { AnimationTagAddOptions } from '../../schema/animation-options.type';

type SpanTagOptions = Extract<AnimationTagAddOptions, { kind: 'span' }>;
type MirrorTagOptions = Extract<AnimationTagAddOptions, { kind: 'mirror' }>;

export type { MirrorTagOptions, SpanTagOptions };
