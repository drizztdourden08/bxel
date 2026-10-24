/* @layer renderer-app @kind types */
import type { AssetKey, DocumentId, FrameId, PaletteBank, Sprite } from '@bxel/document';
import type { FileKind } from '@bxel/project';

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

type LocationTarget = { readonly location: ProjectLocation; readonly overwrite: boolean };

type SaveInput = DocumentInput & {
  readonly expectedRevision?: number;
  readonly target: 'current' | FileNameTarget | LocationTarget;
};

type ExportInput = DocumentInput & {
  readonly expectedRevision?: number;
  readonly format: string;
  readonly source: SpriteSource | SheetSource;
  readonly scale: number;
  readonly overwrite?: boolean;
  readonly fileName?: string;
  readonly location?: ProjectLocation;
};

type CloseInput = DocumentInput & { readonly discard: boolean };

type ProjectLocation = {
  readonly projectId: string;
  readonly folderId: string;
  readonly path: string;
};

type ProjectWrite = {
  readonly location: ProjectLocation;
  readonly kind: FileKind;
  readonly overwrite: boolean;
};

type OpenInput = {
  readonly file: { readonly recentId: string } | ProjectLocation;
  readonly activate: boolean;
};

type OpenTarget = { readonly path: string; readonly viaRecent: boolean };

type OpenedFile = { readonly documentId: DocumentId; readonly key: AssetKey | null };

type WireFileKind = 'bxel' | 'image' | 'palette' | 'sheet_json' | 'other';

type ListFilesInput = {
  readonly projectId: string;
  readonly folderId: string;
  readonly path?: string;
  readonly kinds: readonly WireFileKind[];
  readonly offset: number;
  readonly limit: number;
};

type PlatformOptions = { platformStrict?: unknown; platformId?: unknown };

export type {
  PlatformOptions,
  CloseInput,
  EditInput,
  ExportInput,
  ExportTarget,
  FramePng,
  GetDocumentInput,
  ListFilesInput,
  OpenedFile,
  OpenInput,
  OpenTarget,
  ProjectLocation,
  ProjectWrite,
  ReadPaletteInput,
  ReadPixelsInput,
  RenderInput,
  SaveInput,
  SpriteFrame,
  UndoInput,
  WireFileKind,
  WireRect,
  WireStep,
};
