/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { PaletteSource } from '../palette-source/palette-source.type';
import type { PlatformReport } from '../platform-preset/platform-preset.type';

type CreationKind = 'sprite' | 'sheet';

type BackgroundKind = 'transparent' | 'opaque';

interface CreationForm {
  kind: CreationKind;
  name: string;
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
  columns: number;
  rows: number;
  background: BackgroundKind;
  backgroundSlot: number;
  limit: number;
  transparent: boolean;
  source: PaletteSource;
  platformId: string | null;
}

interface CreationErrors {
  name: string | null;
  size: string | null;
  sheet: string | null;
  limit: string | null;
  palette: string | null;
  background: string | null;
}

interface CreationSummary {
  count: string;
  usage: string;
  fits: string | null;
  sheet: string | null;
  platform: PlatformReport | null;
}

interface CreationMemory {
  width: number;
  height: number;
  limit: number;
  transparent: boolean;
  presetId: string;
  platformId?: string;
}

interface BackgroundChoice {
  slot: number;
  name: string;
  rgb: string;
}

interface SpriteSize {
  width: number;
  height: number;
}

interface SpriteDraft {
  name: string;
  width: number;
  height: number;
}

interface SpriteStepsInput {
  names: readonly string[];
  size: SpriteSize;
  bankId: string | null;
  fillSlot: number | null;
  existingId: string | null;
}

type CreationOutcome = { ok: true; documentId: DocumentId; names: readonly string[] } | { ok: false; message: string };

type InFileOutcome = { ok: true; names: readonly string[] } | { ok: false; message: string };

export type { BackgroundChoice, BackgroundKind, InFileOutcome, CreationForm, CreationErrors, CreationKind, CreationMemory, CreationOutcome, CreationSummary, SpriteDraft, SpriteSize, SpriteStepsInput };
