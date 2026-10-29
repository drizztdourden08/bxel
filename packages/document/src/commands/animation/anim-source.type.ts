/* @layer core @kind types */
import type { AnimSourceOptions, AnimationFrameAddOptions } from '../../schema/animation-options.type';

type BlankSource = Extract<AnimSourceOptions, { kind: 'blank' }>;
type StripSource = Extract<AnimSourceOptions, { kind: 'strip' }>;
type FrameSource = AnimationFrameAddOptions['source'];
type SpriteFrameSource = Extract<FrameSource, { kind: 'sprite' }>;
type StripFrameSource = Extract<FrameSource, { kind: 'strip' }>;
type DuplicateFrameSource = Extract<FrameSource, { kind: 'duplicate' }>;

export type { BlankSource, DuplicateFrameSource, SpriteFrameSource, StripFrameSource, StripSource };
