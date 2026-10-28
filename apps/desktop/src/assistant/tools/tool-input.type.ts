/* @layer renderer-app @kind types */
import type { AssetKey, AssetKind, DocumentId, FrameId, PaletteBank, Sprite } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import type { FileKind } from '@bxel/project';

type SpriteFrame = { readonly sprite: Sprite; readonly bank: PaletteBank; readonly frameId: FrameId };

type FramePng = { readonly bytes: Uint8Array; readonly width: number; readonly height: number };

type DocumentInput = { readonly documentId: string };

type WireRect = { readonly x: number; readonly y: number; readonly width: number; readonly height: number };

type SpriteSource = { readonly spriteId: string; readonly frameId?: string };

type SheetSource = { readonly sheetId: string };

type AnimationSource = { readonly animationId: string; readonly frameId?: string; readonly tagId?: string };

type AnimationStrip = { readonly image: RgbaImage; readonly indices: Uint8Array };

type ExportTarget = { readonly path: string; readonly source: SpriteSource | AnimationSource | SheetSource };

type GetDocumentInput = DocumentInput & { readonly spriteOffset: number; readonly spriteLimit: number };

type ReadPaletteInput = DocumentInput & { readonly bankId?: string; readonly include?: readonly ('usage' | 'duplicates' | 'sharing')[] };

type ListMapLayersInput = DocumentInput & { readonly tilemapId?: string; readonly includeTiles: boolean };

type ReadMapCellsInput = DocumentInput & { readonly tilemapId: string; readonly layerId: string; readonly rect: WireRect };

type ReadPixelsInput = DocumentInput & {
  readonly spriteId: string;
  readonly frameId: string;
  readonly layer: 'flattened' | { readonly layerId: string };
  readonly rect: WireRect;
};

type RenderInput = DocumentInput & {
  readonly target: SpriteSource | AnimationSource | SheetSource;
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

type PreviewInput = EditInput & { readonly render?: { readonly scale: number } };

type UndoInput = DocumentInput & { readonly expectedRevision: number };

type WireAssetKind = Exclude<AssetKind, 'project'>;

type AssetInput = { readonly kind: WireAssetKind; readonly id: string };

type AlsoSaved = { readonly fileName: string; readonly asset: AssetInput };

type SavedAt = { readonly path: string; readonly also: readonly AlsoSaved[] };

type PathOwner = { readonly documentId: DocumentId; readonly id: string | null };

type FileNameTarget = { readonly fileName: string; readonly overwrite: boolean; readonly moveAsset: boolean };

type LocationTarget = { readonly location: ProjectLocation; readonly overwrite: boolean; readonly moveAsset: boolean };

type GetAnimationInput = DocumentInput & { readonly animationId: string };

type SaveInput = DocumentInput & {
  readonly asset?: AssetInput;
  readonly expectedRevision?: number;
  readonly target: 'current' | FileNameTarget | LocationTarget;
};

type ExportInput = DocumentInput & {
  readonly expectedRevision?: number;
  readonly format: string;
  readonly source: SpriteSource | AnimationSource | SheetSource;
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

type ListAssetsInput = {
  readonly projectId: string;
  readonly kinds: readonly WireAssetKind[];
  readonly folderId?: string;
  readonly path?: string;
  readonly usedBy?: string;
  readonly search?: string;
  readonly offset: number;
  readonly limit: number;
};

type SplitInput = { readonly file: ProjectLocation };

type CreateInput = {
  readonly name: string;
  readonly kind: WireAssetKind;
  readonly platformId?: string;
  readonly bank: unknown;
  readonly sprite?: { readonly name: string; readonly width: number; readonly height: number };
  readonly tileSize?: { readonly width: number; readonly height: number };
  readonly mapSize?: { readonly columns: number; readonly rows: number };
  readonly animation?: { readonly width: number; readonly height: number; readonly frames: number };
};

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
  AlsoSaved,
  AnimationSource,
  AnimationStrip,
  GetAnimationInput,
  PathOwner,
  ListMapLayersInput,
  ReadMapCellsInput,
  PlatformOptions,
  AssetInput,
  CreateInput,
  ListAssetsInput,
  SplitInput,
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
  PreviewInput,
  SaveInput,
  SheetSource,
  SavedAt,
  SpriteFrame,
  UndoInput,
  WireFileKind,
  WireRect,
  WireStep,
};
