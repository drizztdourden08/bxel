/* @layer core @kind types */
import type { AnimSourceOptions, AnimationFrameAddOptions } from '../../schema/animation-options.type';

type BlankSource = Extract<AnimSourceOptions, { kind: 'blank' }>;
type SpritesSource = Extract<AnimSourceOptions, { kind: 'sprites' }>;
type SpriteSource = Extract<AnimSourceOptions, { kind: 'sprite' }>;
type StripSource = Extract<AnimSourceOptions, { kind: 'strip' }>;
type FrameSource = AnimationFrameAddOptions['source'];
type EmptyFrameSource = Extract<FrameSource, { kind: 'empty' }>;
type SpriteFrameSource = Extract<FrameSource, { kind: 'sprite' }>;
type StripFrameSource = Extract<FrameSource, { kind: 'strip' }>;
type DuplicateFrameSource = Extract<FrameSource, { kind: 'duplicate' }>;

export type {
  BlankSource,
  DuplicateFrameSource,
  EmptyFrameSource,
  FrameSource,
  SpriteFrameSource,
  SpriteSource,
  SpritesSource,
  StripFrameSource,
  StripSource,
};
