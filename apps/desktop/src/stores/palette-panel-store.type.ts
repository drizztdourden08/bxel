/* @layer renderer-app @kind types */
import type { BankId, DocumentId } from '@bxel/document';
import type { CleanUpKind } from '../palette-panel/palette-panel.type';

interface PaletteSelection {
  bankId: BankId | null;
  selected: readonly string[];
  anchor: string | null;
}

interface PaletteSelectionState extends PaletteSelection {
  select: (selection: PaletteSelection) => void;
  clear: () => void;
}

interface SwatchDraftPreview {
  documentId: DocumentId;
  bankId: BankId;
  index: number;
  rgb: string;
  alpha: number;
}

interface SwatchDraftState {
  draft: SwatchDraftPreview | null;
  show: (draft: SwatchDraftPreview) => void;
  hide: () => void;
}

interface BankPreview {
  documentId: DocumentId;
  revision: number;
  bankId: BankId;
  withBankId: BankId;
}

interface BankPreviewState {
  preview: BankPreview | null;
  show: (preview: BankPreview) => void;
  end: () => void;
}

interface RampBuilderRequest {
  documentId: DocumentId;
  bankId: BankId;
  baseIndex: number;
}

interface RampBuilderState {
  request: RampBuilderRequest | null;
  open: (request: RampBuilderRequest) => void;
  close: () => void;
}

interface PaletteImportRequest {
  documentId: DocumentId;
  bankId: BankId;
}

interface PaletteImportState {
  request: PaletteImportRequest | null;
  open: (request: PaletteImportRequest) => void;
  close: () => void;
}

type SheetKind = CleanUpKind | 'gradient' | 'copy' | 'move';

interface PaletteSheetRequest {
  kind: SheetKind;
  documentId: DocumentId;
  bankId: BankId;
  first: number;
  last: number;
}

interface PaletteSheetState {
  request: PaletteSheetRequest | null;
  open: (request: PaletteSheetRequest) => void;
  close: () => void;
}

export type {
  BankPreview, BankPreviewState, PaletteImportRequest, PaletteImportState, PaletteSelectionState, PaletteSheetRequest, PaletteSheetState, RampBuilderRequest, RampBuilderState, SheetKind, SwatchDraftPreview, SwatchDraftState,
};
