/* @layer core @kind types */
import type { FormatFailure } from '../failure/format.type';
import type { PixelBytes, RgbaImage } from '../png.type';
import type { PackSettings, TrimmedImage } from './sheet.type';
import type {
  SheetMetadata,
  SheetPivot,
  SheetSliceEntry,
  SheetTagEntry,
} from './sheet-metadata.type';

type ExportFrame = {
  readonly layers: readonly Uint8Array[];
  readonly durationMs: number;
  readonly label?: string;
};

type ExportSprite = {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly pivot: SheetPivot;
  readonly palette: PixelBytes;
  readonly frames: readonly ExportFrame[];
  readonly tags: readonly SheetTagEntry[];
  readonly slices: readonly SheetSliceEntry[];
};

type SheetFlavour = 'bxel' | 'hash' | 'array' | 'tiled';

type ExportSheetInput = {
  readonly imageName: string;
  readonly sprites: readonly ExportSprite[];
  readonly settings: PackSettings;
  readonly trim: boolean;
  readonly scale: number;
  readonly flavour: SheetFlavour;
  readonly mergeIdentical?: boolean;
};

type ExportedSheet = {
  readonly ok: true;
  readonly image: RgbaImage;
  readonly png: Uint8Array;
  readonly json: string;
  readonly metadata: SheetMetadata;
};

type ExportSheetResult = ExportedSheet | FormatFailure;

type SheetCell = {
  readonly key: string;
  readonly spriteIndex: number;
  readonly frameIndex: number;
  readonly durationMs: number;
  readonly trimmed: TrimmedImage;
  readonly twin?: number;
  readonly label?: string;
};

export type {
  ExportedSheet,
  ExportFrame,
  ExportSheetInput,
  ExportSheetResult,
  ExportSprite,
  SheetCell,
  SheetFlavour,
};
