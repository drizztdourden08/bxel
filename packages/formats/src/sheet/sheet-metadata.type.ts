/* @layer core @kind types */
import type { FormatFailure } from '../failure/format.type';
import type { Box } from '../pixels/box.type';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

type SheetPivot = { readonly x2: number; readonly y2: number };

type SheetTagDirection = 'forward' | 'reverse' | 'pingpong' | 'pingpongReverse';

type SheetFlip = 'x' | 'y';

type SheetFrameEntry = {
  readonly box: Box;
  readonly rotated: boolean;
  readonly trimmed: boolean;
  readonly sourceX: number;
  readonly sourceY: number;
  readonly durationMs: number;
  readonly label?: string;
};

type SheetTagEntry = {
  readonly name: string;
  readonly from: number;
  readonly to: number;
  readonly direction: SheetTagDirection;
  readonly repeat: number;
  readonly colour?: string;
  readonly facing?: string;
  readonly mirrorOf?: string;
  readonly flip?: SheetFlip;
};

type SheetSliceEntry = {
  readonly name: string;
  readonly bounds: Box;
  readonly pivot: SheetPivot | null;
  readonly center: Box | null;
};

type SheetSpriteEntry = {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly pivot: SheetPivot;
  readonly frames: readonly SheetFrameEntry[];
  readonly tags: readonly SheetTagEntry[];
  readonly slices: readonly SheetSliceEntry[];
};

type SheetMetadata = {
  readonly image: string;
  readonly width: number;
  readonly height: number;
  readonly scale: number;
  readonly sprites: readonly SheetSpriteEntry[];
};

type SheetMetadataResult =
  | { readonly ok: true; readonly metadata: SheetMetadata }
  | FormatFailure;

export type {
  JsonValue,
  SheetFlip,
  SheetFrameEntry,
  SheetMetadata,
  SheetMetadataResult,
  SheetPivot,
  SheetSliceEntry,
  SheetSpriteEntry,
  SheetTagDirection,
  SheetTagEntry,
};
