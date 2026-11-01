/* @layer renderer-app @kind hook */
import { usePreviewBankStore } from '../../../stores/usePreviewBankStore';
import type { PanelModel } from '../PalettePanel.type';

const useBankPreview = (panel: PanelModel): string | null => {
  const preview = usePreviewBankStore((state) => state.preview);
  if (preview?.documentId !== panel.target.documentId || preview.bankId !== panel.target.bank.id) return null;
  return panel.artwork.banks.find((bank) => bank.id === preview.withBankId)?.name ?? null;
};

export { useBankPreview };
