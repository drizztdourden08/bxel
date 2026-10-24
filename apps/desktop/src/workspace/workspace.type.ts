/* @layer renderer-app @kind types */
import type { Artwork, AssetKey, AssetKind, AssetSlice, DocumentId } from '@bxel/document';
import type { AssetManifest, AssetReport, Clock } from '@bxel/document/native';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { DocumentHost } from '../documents/document-host.type';

type WorkspaceKind = 'project' | 'loose' | 'legacy';

type AssetDirs = Readonly<Partial<Record<AssetKind, string>>>;

type LegacyCounts = { readonly sprites: number; readonly sheets: number; readonly palettes: number };

type LegacySource = { readonly path: string; readonly counts: LegacyCounts };

type Workspace = {
  readonly documentId: DocumentId;
  readonly kind: WorkspaceKind;
  readonly name: string;
  readonly root: string | null;
  readonly dirs: AssetDirs;
  readonly projectFile: string | null;
  readonly paths: ReadonlyMap<string, string>;
  readonly saved: ReadonlyMap<string, string>;
  readonly dirty: ReadonlySet<string>;
  readonly base: Artwork;
  readonly last: Artwork;
  readonly legacy: LegacySource | null;
};

type WorkspaceSeed = Omit<Workspace, 'documentId' | 'base' | 'last' | 'saved'> & {
  readonly artwork: Artwork;
  readonly readOnly: boolean;
  readonly unsaved: boolean;
  readonly focus: AssetKey | null;
};

type AssetFile = { readonly path: string; readonly bytes: Uint8Array; readonly manifest: AssetManifest };

type DecodedFile = { readonly path: string; readonly slice: AssetSlice; readonly relinked: boolean };

type LinkedSlice = { readonly found: DecodedFile | null; readonly relinked: boolean };

type DecodeResult = { readonly report: AssetReport; readonly relinked: boolean };

type Decoder = (file: AssetFile, pool: readonly DecodedFile[]) => DecodeResult;

type FileReport = { readonly path: string; readonly report: AssetReport };

type DecodedFiles = { readonly sources: readonly DecodedFile[]; readonly reports: readonly FileReport[] };

type MergedWorkspace = {
  readonly artwork: Artwork;
  readonly paths: ReadonlyMap<string, string>;
  readonly dirty: ReadonlySet<string>;
  readonly issues: readonly string[];
};

type NameSync = { readonly paths: Map<string, string>; readonly referrers: readonly AssetKey[] };

type WrittenAsset = { readonly key: AssetKey; readonly hash: string; readonly path: string };

type SavedAssets = {
  readonly artwork: Artwork;
  readonly paths: ReadonlyMap<string, string>;
  readonly written: readonly WrittenAsset[];
  readonly referrers: readonly AssetKey[];
};

type DirtyKeys = {
  readonly live: readonly AssetKey[];
  readonly gone: readonly AssetKey[];
  readonly project: AssetKey | null;
};

type ActiveAsset = {
  readonly tab: OpenTab | null;
  readonly name: string;
  readonly path: string | undefined;
  readonly dirty: boolean;
  readonly anyDirty: boolean;
};

type SeededWorkspace = { readonly seed: WorkspaceSeed; readonly merged: MergedWorkspace };

type WorkspaceKit = {
  readonly documents: DocumentsPort;
  readonly host: DocumentHost;
  readonly clock: Clock;
};

type Progress = (done: number, total: number) => void;

type SaveOutcome = { readonly written: readonly string[]; readonly trashed: readonly string[] };

type OpenTab = { readonly id: string; readonly documentId: DocumentId; readonly key: AssetKey };

type NamedAsset = { readonly id: string; readonly name: string };

type Encoder = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock) => Uint8Array;

export type {
  ActiveAsset,
  AssetDirs,
  AssetFile,
  DecodedFile,
  DirtyKeys,
  DecodedFiles,
  DecodeResult,
  Decoder,
  Encoder,
  FileReport,
  LegacyCounts,
  LegacySource,
  LinkedSlice,
  MergedWorkspace,
  NamedAsset,
  NameSync,
  OpenTab,
  Progress,
  SaveOutcome,
  SavedAssets,
  SeededWorkspace,
  Workspace,
  WorkspaceKind,
  WorkspaceKit,
  WorkspaceSeed,
  WrittenAsset,
};
