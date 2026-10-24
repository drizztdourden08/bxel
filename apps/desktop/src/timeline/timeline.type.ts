/* @layer renderer-app @kind types */
import type { FrameId, LayerId, TagId } from '@bxel/document';
import type { TimelineSelection } from '../stores/timeline-store.type';

type CelState = 'empty' | 'filled' | 'linked';

interface FrameColumn {
  id: FrameId;
  number: number;
  durationMs: number;
  current: boolean;
  selected: boolean;
}

interface CelCell {
  layerId: LayerId;
  frameId: FrameId;
  state: CelState;
  current: boolean;
  selected: boolean;
  label: string;
}

interface LayerRow {
  id: LayerId;
  name: string;
  visible: boolean;
  locked: boolean;
  active: boolean;
  cells: readonly CelCell[];
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
  label: string;
}

type TagLook = Pick<TagCell, 'colour' | 'edge' | 'selected' | 'roving'>;

interface TagColourChoice {
  name: string;
  hex: string;
}

interface TimelineModel {
  columns: readonly FrameColumn[];
  rows: readonly LayerRow[];
  tagLanes: readonly (readonly (TagCell | null)[])[];
}

interface EffectiveSelection {
  frames: readonly FrameId[];
  layers: readonly LayerId[];
}

interface PlayOptions {
  pingPong: boolean;
  tagId: TagId | null;
}

interface CelMove {
  frames: number;
  layers: number;
}

interface ShiftedSelection {
  selection: TimelineSelection;
  frameId: FrameId;
  layerId: LayerId;
}

interface CelStep {
  layerId: LayerId;
  frameId: FrameId;
  toLayer: LayerId;
  toFrame: FrameId;
}

export type { CelCell, CelMove, CelState, CelStep, EffectiveSelection, FrameColumn, LayerRow, PlayOptions, ShiftedSelection, TagCell, TagColourChoice, TagEdge, TagLook, TimelineModel };
