/* @layer renderer-app @kind types */
import type { Artwork, Frame, PaletteBank, Sprite, SpriteId, Tag, Tilemap, Tileset } from '@bxel/document';
import type { SheetFlavour } from '@bxel/formats';
import type { CurrentPick } from '../editor/current-pick.type';

type ExportKind = 'sprite' | 'frames' | 'animation' | 'sheet' | 'map';

type MapFormat = 'bxel' | 'tiled';

type SpriteChoice = 'current' | 'selected' | 'all' | 'sheet';

type LayerChoice = 'visible' | 'all';

type FrameChoice = 'current' | 'tag' | 'all';

type ColourMode = 'rgba' | 'indexed';

type AnimationFormat = 'gif' | 'apng';

type LayoutChoice = 'grid' | 'packed';

type ExportSettings = {
  readonly kind: ExportKind;
  readonly sprites: SpriteChoice;
  readonly layers: LayerChoice;
  readonly frames: FrameChoice;
  readonly tag: string;
  readonly scale: number;
  readonly colour: ColourMode;
  readonly approved: boolean;
  readonly animation: AnimationFormat;
  readonly layout: LayoutChoice;
  readonly columns: number;
  readonly padding: number;
  readonly extrusion: number;
  readonly trim: boolean;
  readonly powerOfTwo: boolean;
  readonly pageSide: number;
  readonly sheetId: string;
  readonly flavour: SheetFlavour;
  readonly mapFormat: MapFormat;
  readonly folder: string;
  readonly fileName: string;
  readonly pathTemplate: string;
};

type ExportOpen = {
  readonly kind?: ExportKind;
  readonly settings?: Partial<ExportSettings>;
};

type SavedPreset = {
  readonly name: string;
  readonly settings: ExportSettings;
};

type FrozenArtwork = {
  readonly revision: number;
  readonly artwork: Artwork;
};

type Target = {
  readonly sprite: Sprite;
  readonly bank: PaletteBank;
  readonly frames: readonly Frame[];
  readonly tag: Tag | null;
};

type TargetsResult =
  | { readonly ok: true; readonly targets: readonly Target[] }
  | { readonly ok: false; readonly message: string };

type FileData =
  | { readonly kind: 'bytes'; readonly bytes: Uint8Array }
  | { readonly kind: 'text'; readonly text: string };

type MadeFile = { readonly ok: true; readonly data: FileData } | { readonly ok: false; readonly message: string };

type EncodedBytes = { readonly ok: true; readonly bytes: Uint8Array } | { readonly ok: false; readonly message: string };

type PlannedFile = {
  readonly name: string;
  readonly detail: string;
  readonly spriteIndex: number;
  readonly width: number | null;
  readonly height: number | null;
  readonly make: () => MadeFile;
};

type ColourMap = {
  readonly palette: Uint8Array;
  readonly lookup: ReadonlyMap<number, number>;
  readonly bankName: string;
  readonly banks: number;
  readonly opaque: number;
};

type MadeEntry = { readonly file: PlannedFile; readonly data: FileData };

type ColourBuilder = { readonly rgba: number[]; readonly lookup: Map<number, number> };

type ColourMapResult =
  | { readonly ok: true; readonly map: ColourMap }
  | { readonly ok: false; readonly banks: number; readonly colours: number };

type IndexedStatus =
  | { readonly state: 'available'; readonly note: string; readonly needsApproval: boolean; readonly map: ColourMap | null }
  | { readonly state: 'unavailable'; readonly note: string };

type ExportPlan = {
  readonly files: readonly PlannedFile[];
  readonly spriteCount: number;
  readonly indexed: IndexedStatus;
  readonly notes: readonly string[];
  readonly problem: string | null;
  readonly revision: number;
};

type ExportResult =
  | { readonly kind: 'done'; readonly count: number }
  | { readonly kind: 'cancelled' }
  | { readonly kind: 'failed'; readonly message: string; readonly written: number };

type ExportJob = {
  readonly signal: AbortSignal;
  readonly step: (stepId: string, line?: string) => void;
  readonly progress: (fraction: number, line?: string) => void;
  readonly setCancellable: (on: boolean) => void;
};

type ExportSink = {
  readonly writeBytes: (path: string, bytes: Uint8Array) => Promise<void>;
  readonly writeText: (path: string, text: string) => Promise<void>;
};

type ExportRun = {
  readonly plan: ExportPlan;
  readonly folder: string;
  readonly title: string;
};

type ExportRequest = {
  readonly frozen: FrozenArtwork;
  readonly settings: ExportSettings;
  readonly selectedIds: readonly SpriteId[];
  readonly title: string;
  readonly current?: CurrentPick;
};

type PlanInput = {
  readonly frozen: FrozenArtwork;
  readonly settings: ExportSettings;
  readonly selectedIds: readonly SpriteId[];
  readonly current?: CurrentPick;
};

type MapPick = {
  readonly tilemap: Tilemap;
  readonly tileset: Tileset;
};

type LabelParts = {
  readonly base: string;
  readonly target: Target;
  readonly count: number;
  readonly extra: string | null;
  readonly template: string;
};

type PlanParts = {
  readonly targets: readonly Target[];
  readonly settings: ExportSettings;
  readonly base: string;
  readonly map: ColourMap | null;
};

export type {
  AnimationFormat,
  ColourBuilder,
  ColourMap,
  ColourMapResult,
  ColourMode,
  EncodedBytes,
  ExportJob,
  ExportKind,
  ExportOpen,
  ExportPlan,
  ExportRequest,
  ExportResult,
  ExportRun,
  ExportSettings,
  ExportSink,
  FrameChoice,
  IndexedStatus,
  LabelParts,
  LayerChoice,
  LayoutChoice,
  MadeEntry,
  MapFormat,
  MapPick,
  MadeFile,
  PlanInput,
  PlanParts,
  PlannedFile,
  SavedPreset,
  SpriteChoice,
  Target,
  TargetsResult,
};
