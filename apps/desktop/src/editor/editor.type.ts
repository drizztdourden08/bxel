/* @layer renderer-app @kind types */
import type { Brush, Point } from '@bxel/raster';
import type { DocumentId, FrameId, LayerId, PaletteBank, Sprite } from '@bxel/document';
import type { StrokeTool, ToolId } from './tool.type';

interface EditorTarget {
  documentId: DocumentId;
  revision: number;
  sprite: Sprite;
  bank: PaletteBank;
  layerId: LayerId;
  frameId: FrameId;
}

interface StrokeSession {
  tool: StrokeTool;
  index: number;
  brush: Brush;
  width: number;
  height: number;
  indices: Uint8Array;
  rgba: Uint8ClampedArray<ArrayBuffer>;
  table: Uint8ClampedArray<ArrayBuffer>;
  points: Point[];
}

interface StrokeStart {
  target: EditorTarget;
  tool: StrokeTool;
  index: number;
  brush: Brush;
  at: Point;
}

type EditorAction =
  | { kind: 'undo' }
  | { kind: 'redo' }
  | { kind: 'swap' }
  | { kind: 'tool'; tool: ToolId };

interface KeyLike {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

type HistoryDirection = 'undo' | 'redo';

export type { EditorAction, EditorTarget, HistoryDirection, KeyLike, StrokeSession, StrokeStart };
