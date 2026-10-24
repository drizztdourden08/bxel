/* @layer renderer-app @kind types */
import type { Artwork, Sprite } from '@bxel/document';
import type { MergePlan, MergeSpec, PiecePlan, SlicePlan, SliceSpec, SplitSpec } from './compose.type';
import type { SpriteComparison } from './identical.type';

interface MergeForm {
  spec: MergeSpec;
  plan: MergePlan;
  targets: readonly Sprite[];
  update: (change: Partial<MergeSpec>) => void;
}

interface SplitForm {
  spec: SplitSpec;
  plan: PiecePlan;
  targets: readonly Sprite[];
  skipped: number;
  update: (change: Partial<SplitSpec>) => void;
}

interface SliceForm {
  spec: SliceSpec;
  plan: SlicePlan;
  targets: readonly Sprite[];
  update: (change: Partial<SliceSpec>) => void;
}

interface MergeFieldsProps {
  spec: MergeSpec;
  first: string;
  update: (change: Partial<MergeSpec>) => void;
}

interface MergeNoteProps {
  plan: MergePlan;
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
  CompareDiffProps,
  CompareSideProps,
  CompareVerdictProps,
  MergeFieldsProps,
  MergeForm,
  MergeNoteProps,
  PieceFieldsProps,
  PieceNamesProps,
  SliceFieldsProps,
  SliceForm,
  SliceNoteProps,
  SplitForm,
};
