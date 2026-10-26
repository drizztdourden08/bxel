/* @layer renderer-app @kind types */
import type { AnimFlip, AnimFrame, AnimFrameId, Animation, Artwork, DocumentId, TagId } from '@bxel/document';

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
  label: string;
}

type TagEdge = 'only' | 'start' | 'mid' | 'end';

interface TagCell {
  tagId: TagId;
  name: string;
  colour: string;
  custom: string | null;
  edge: TagEdge;
  selected: boolean;
  roving: boolean;
  mirror: boolean;
  label: string;
}

type TagLook = Pick<TagCell, 'colour' | 'edge' | 'selected' | 'roving'>;

interface TagColourChoice {
  name: string;
  hex: string;
}

interface TimelineModel {
  cells: readonly FrameCell[];
  tagLanes: readonly (readonly (TagCell | null)[])[];
}

interface PlayStep {
  frameId: AnimFrameId;
  flip: AnimFlip | null;
}

export type { AnimationFocus, FrameBadge, FrameCell, PlayStep, TagCell, TagColourChoice, TagEdge, TagLook, TimelineModel };
