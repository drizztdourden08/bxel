/* @layer renderer-app @kind types */
import type { DocumentId, PaletteBank } from '@bxel/document';
import type { BankDraft, PaletteSource } from '../palette-source/palette-source.type';

interface SourceImage {
  fileName: string;
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

type ImageRead = { ok: true; image: SourceImage } | { ok: false; message: string };

type ImportTarget = 'new' | 'file';

type ImportKind = 'sprite' | 'sheet';

type ReduceMode = 'map' | 'extract' | 'palette';

type DitherName = 'none' | 'bayer2' | 'bayer4' | 'bayer8';

type ImportStep = 'source' | 'colors' | 'slicing';

type SliceOrder = 'rows' | 'columns';

interface SliceForm {
  cellWidth: number;
  cellHeight: number;
  offsetX: number;
  offsetY: number;
  spacingX: number;
  spacingY: number;
  order: SliceOrder;
  names: string;
}

interface ImportForm {
  target: ImportTarget;
  kind: ImportKind;
  name: string;
  reduce: ReduceMode | null;
  dither: DitherName;
  alphaPercent: number;
  limit: number;
  transparent: boolean;
  source: PaletteSource;
  slice: SliceForm;
}

type ColorsForm = Pick<ImportForm, 'target' | 'reduce' | 'dither' | 'alphaPercent' | 'limit' | 'transparent' | 'source'>;

interface ChoiceOption<T extends string> {
  value: T;
  label: string;
}

interface ReduceOption {
  value: ReduceMode;
  label: string;
}

interface ImportContext {
  documentId: DocumentId | null;
  bank: PaletteBank | null;
  taken: readonly string[];
  spriteCount: number;
}

interface ImageExtent {
  width: number;
  height: number;
}

interface SliceRect {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ReductionPlan {
  palette: readonly string[];
  transparent: boolean;
  limit: number;
  bank: BankDraft | null;
  bankId: string | null;
  dropped: number;
}

interface MappedImage {
  rgba: Uint8ClampedArray;
  pixels: Uint8Array;
  changed: number;
  used: number;
}

interface ColorsView {
  count: number;
  plan: ReductionPlan | null;
  mapped: MappedImage | null;
  limit: number;
  transparent: boolean;
  opaque: number;
  warning: string | null;
}

interface ImportErrors {
  name: string | null;
  size: string | null;
  limit: string | null;
  palette: string | null;
  slice: string | null;
  naming: string | null;
}

interface ErrorInput {
  form: ImportForm;
  image: SourceImage;
  context: ImportContext;
  rects: readonly SliceRect[];
  names: readonly string[];
}

interface ImportRun {
  form: ImportForm;
  image: SourceImage;
  plan: ReductionPlan;
  rects: readonly SliceRect[];
  names: readonly string[];
  context: ImportContext;
}

type ImportOutcome = { ok: true; documentId: DocumentId; names: readonly string[] } | { ok: false; message: string };

export type {
  ChoiceOption,
  ColorsForm,
  DitherName,
  ErrorInput,
  ImageExtent,
  ImageRead,
  ImportContext,
  ImportErrors,
  ImportForm,
  ImportKind,
  ImportOutcome,
  ImportRun,
  ImportStep,
  ImportTarget,
  ColorsView,
  MappedImage,
  ReduceMode,
  ReduceOption,
  ReductionPlan,
  SliceForm,
  SliceOrder,
  SliceRect,
  SourceImage,
};
