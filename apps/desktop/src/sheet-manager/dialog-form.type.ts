/* @layer renderer-app @kind types */
import type { Artwork, Sprite } from '@bxel/document';
import type { AnimatePlan, AnimateSpec, CutStripSpec, PiecePlan, SlicePlan, SliceSpec, SplitSpec } from './compose.type';
import type { StripPlan } from '../add-frames/add-frames.type';
import type { SpriteComparison } from './identical.type';

interface AnimateForm {
  spec: AnimateSpec;
  plan: AnimatePlan;
  targets: readonly Sprite[];
  update: (change: Partial<AnimateSpec>) => void;
}

interface CutStripForm {
  spec: CutStripSpec;
  plan: StripPlan;
  target: Sprite | null;
  blocker: string | null;
  update: (change: Partial<CutStripSpec>) => void;
}

interface SliceForm {
  spec: SliceSpec;
  plan: SlicePlan;
  targets: readonly Sprite[];
  update: (change: Partial<SliceSpec>) => void;
}

interface AnimateNoteProps {
  plan: AnimatePlan;
}

interface PieceFieldsProps {
  pattern: string;
  start: number;
  keep: boolean;
  update: (change: Partial<Pick<SplitSpec, 'pattern' | 'start' | 'keep'>>) => void;
}

interface PieceNamesProps {
  plan: PiecePlan;
}

interface SliceFieldsProps {
  spec: SliceSpec;
  update: (change: Partial<SliceSpec>) => void;
}

interface SliceNoteProps {
  plan: SlicePlan;
}

interface CompareSideProps {
  artwork: Artwork;
  sprite: Sprite;
}

interface CompareDiffProps {
  artwork: Artwork;
  first: Sprite;
  second: Sprite;
}

interface CompareVerdictProps {
  comparison: SpriteComparison;
  first: Sprite;
  second: Sprite;
}

export type {
  AnimateForm,
  AnimateNoteProps,
  CompareDiffProps,
  CompareSideProps,
  CompareVerdictProps,
  PieceFieldsProps,
  PieceNamesProps,
  SliceFieldsProps,
  SliceForm,
  SliceNoteProps,
  CutStripForm,
};
