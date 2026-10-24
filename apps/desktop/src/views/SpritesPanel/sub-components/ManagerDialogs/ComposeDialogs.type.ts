/* @layer renderer-app @kind types */
import type { Sprite } from '@bxel/document';
import type { MergePlan, MergeSpec, PiecePlan, SlicePlan, SliceSpec, SplitSpec } from '../../../../sheet-manager/compose.type';

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

export type {
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
