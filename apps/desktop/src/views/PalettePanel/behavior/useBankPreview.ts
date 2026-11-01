/* @layer renderer-app @kind hook */
import { usePreviewBankStore } from '../../../stores/usePreviewBankStore';
import type { PanelModel } from '../PalettePanel.type';

/** The name of the palette the canvas is being previewed with, or null when no preview runs for this palette. */
const useBankPreview = (panel: PanelModel): string | null => {
  const preview = usePreviewBankStore((state) => state.preview);
  if (!preview || preview.documentId !== panel.target.documentId || preview.bankId !== panel.target.bank.id) return null;
  return panel.artwork.banks.find((bank) => bank.id === preview.withBankId)?.name ?? null;
};

export { useBankPreview };
