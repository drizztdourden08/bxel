/* @layer renderer-app @kind types */
import type { FrameId, PaletteBank, Sprite } from '@bxel/document';

type SpriteFrame = { readonly sprite: Sprite; readonly bank: PaletteBank; readonly frameId: FrameId };

type FramePng = { readonly bytes: Uint8Array; readonly width: number; readonly height: number };

type DocumentInput = { readonly documentId: string };

type WireRect = { readonly x: number; readonly y: number; readonly width: number; readonly height: number };

type SpriteSource = { readonly spriteId: string; readonly frameId?: string };

type SheetSource = { readonly sheetId: string };

type ExportTarget = { readonly path: string; readonly source: SpriteSource };

type GetDocumentInput = DocumentInput & { readonly spriteOffset: number; readonly spriteLimit: number };

type ReadPaletteInput = DocumentInput & { readonly bankId?: string };

type ReadPixelsInput = DocumentInput & {
  readonly spriteId: string;
  readonly frameId: string;
  readonly layer: 'flattened' | { readonly layerId: string };
  readonly rect: WireRect;
};

type RenderInput = DocumentInput & {
  readonly target: SpriteSource | SheetSource;
  readonly scale: number;
};

type WireStep = {
  readonly name: string;
  readonly targets?: unknown;
  readonly ref?: string;
  readonly options: unknown;
};

type EditInput = DocumentInput & {
  readonly baseRevision: number;
  readonly label: string;
  readonly steps: readonly WireStep[];
  readonly previewPixels?: number;
  readonly clientRequestId?: string;
};

type UndoInput = DocumentInput & { readonly expectedRevision: number };

type FileNameTarget = { readonly fileName: string; readonly overwrite: boolean };

type LocationTarget = { readonly location: unknown; readonly overwrite: boolean };

type SaveInput = DocumentInput & {
  readonly expectedRevision?: number;
  readonly target: 'current' | FileNameTarget | LocationTarget;
};

type ExportInput = DocumentInput & {
  readonly expectedRevision?: number;
  readonly format: string;
  readonly source: SpriteSource | SheetSource;
  readonly scale: number;
  readonly fileName?: string;
};

type CloseInput = DocumentInput & { readonly discard: boolean };

type OpenInput = {
  readonly file: { readonly recentId: string } | { readonly projectId: string };
  readonly activate: boolean;
};

export type {
  CloseInput,
  DocumentInput,
  EditInput,
  ExportInput,
  ExportTarget,
  FramePng,
  GetDocumentInput,
  OpenInput,
  ReadPaletteInput,
  ReadPixelsInput,
  RenderInput,
  SaveInput,
  SpriteFrame,
  SpriteSource,
  UndoInput,
  WireRect,
  WireStep,
};
