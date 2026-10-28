/* @layer renderer-app @kind types */
import type { AnimDirection, AnimFacing, AnimFlip, AnimFrame, AnimFrameId, Animation, Artwork, DocumentId, TagId } from '@bxel/document';

interface AnimationFocus {
  documentId: DocumentId;
  artwork: Artwork;
  animation: Animation;
  frame: AnimFrame;
  readOnly: boolean;
}

type FrameBadge = 'owned' | 'shared' | 'clip' | 'empty';

interface FrameCell {
  id: AnimFrameId;
  number: number;
  durationMs: number;
  current: boolean;
  selected: boolean;
  badges: readonly FrameBadge[];
  linkedTo: number | null;
  linkedNext: boolean;
  label: string;
}

interface TagBar {
  tagId: TagId;
  name: string;
  colour: string;
  custom: string | null;
  start: number;
  end: number;
  direction: AnimDirection;
  repeat: number;
  facing: AnimFacing | null;
  mirror: boolean;
  flip: AnimFlip | null;
  selected: boolean;
  label: string;
}

interface TagColourChoice {
  name: string;
  hex: string;
}

interface TimelineModel {
  cells: readonly FrameCell[];
  tagLanes: readonly (readonly TagBar[])[];
}

export type { AnimationFocus, FrameBadge, FrameCell, TagBar, TagColourChoice, TimelineModel };
