/* @layer core @kind config */
import type { ResampleAlgorithm, StepConfig } from './resample.type';

const ROTATE_ALGORITHMS = ['nearest', 'rotsprite', 'cleanedge'] as const;

const SCALE_ALGORITHMS = ['nearest', 'rotsprite', 'scale2x', 'scale3x', 'mmpx'] as const;

const ALGORITHM_LABELS: Readonly<Record<ResampleAlgorithm, string>> = {
  nearest: 'Nearest',
  rotsprite: 'RotSprite',
  cleanedge: 'cleanEdge',
  scale2x: 'Scale2x',
  scale3x: 'Scale3x',
  mmpx: 'MMPX',
};

const ALGORITHM_NOTES: Readonly<Record<ResampleAlgorithm, string>> = {
  nearest: 'Copies the closest pixel. Fast and exact, but diagonal lines turn into stairs.',
  rotsprite: 'Upscales 8 times with an edge rule, turns, and samples back. Keeps outlines clean. Never adds a colour.',
  cleanedge: 'Treats edges as thin lines and cuts corners along them. Best for outlines. Never adds a colour.',
  scale2x: 'Doubles the size and rounds diagonal corners (EPX). Never adds a colour.',
  scale3x: 'Triples the size and rounds diagonal corners. Never adds a colour.',
  mmpx: 'Doubles the size and keeps thin lines and single pixels (MMPX). Never adds a colour.',
};

const ROTSPRITE_PASSES = 3;

const DEFAULT_STEP: StepConfig = {
  border: 'transparent',
  same: (a, b) => a === b,
  luma: (index) => (index === 0 ? 256 : 1 + index * 3),
};

export { ALGORITHM_LABELS, ALGORITHM_NOTES, DEFAULT_STEP, ROTATE_ALGORITHMS, ROTSPRITE_PASSES, SCALE_ALGORITHMS };
