/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import { PALETTE_TRANSFER_COMMAND } from '../../../keymap/palette-transfer-command-id.constants';
import { addToSwatchSets } from '../../../palette-export/add-to-swatch-sets';
import { copyHexList } from '../../../palette-export/copy-hex-list';
import { exportPaletteFile } from '../../../palette-export/export-palette-file';
import { PALETTE_EXPORT_FORMATS, PALETTE_EXPORT_TEXT } from '../../../palette-export/palette-export.constants';
import { saveProjectPalette } from '../../../palette-export/save-project-palette';
import { PREVIEW_TEXT } from '../../../palette-preview/palette-preview.constants';
import { previewBanks } from '../../../palette-preview/preview-banks';
import { startPreview } from '../../../palette-preview/start-preview';
import type { UserSets } from '../../../swatch-library/swatch-library.type';
import { usePaletteImportStore } from '../../../stores/usePaletteImportStore';
import { PALETTE_MENU } from '../PalettePanel.constants';
import type { PanelModel } from '../PalettePanel.type';
import { ruledOff } from './ruled-off';

const formatItems = (panel: PanelModel, indices: readonly number[] | null): MenuItem[] =>
  PALETTE_EXPORT_FORMATS.map((format) => ({
    id: `export-${indices === null ? 'all' : 'selection'}-${format.id}`,
    label: format.label,
    disabled: ruledOff(PALETTE_TRANSFER_COMMAND.export),
    onSelect: () => void exportPaletteFile(panel.target, format.id, indices),
  }));

const previewItems = (panel: PanelModel): MenuItem[] => {
  const { target, artwork } = panel;
  const banks = target.sprite ? previewBanks(artwork, target.bank) : [];
  if (banks.length === 0) return [{ id: 'preview-none', label: PREVIEW_TEXT.none, disabled: true }];
  return banks.map((bank) => ({ id: `preview-${bank.id}`, label: bank.name, onSelect: () => startPreview(target, bank.id) }));
};

const transferGroups = (panel: PanelModel, sets: UserSets): MenuGroup[] => {
  const { target, selection } = panel;
  const chosen = [...selection.selected].sort((a, b) => a - b);
  const none = chosen.length === 0;
  const writable = !panel.lock.locked && !ruledOff(PALETTE_TRANSFER_COMMAND.import);
  return [
    {
      id: 'transfer',
      items: [
        { id: 'import', label: PALETTE_MENU.import, icon: 'folder-open', disabled: !writable, onSelect: () => usePaletteImportStore.getState().open({ documentId: target.documentId, bankId: target.bank.id }) },
        { id: 'export', label: PALETTE_EXPORT_TEXT.menu, children: formatItems(panel, null) },
        { id: 'export-selection', label: PALETTE_EXPORT_TEXT.menuSelection, disabled: none, children: formatItems(panel, chosen) },
        { id: 'copy-list', label: PALETTE_EXPORT_TEXT.copyList, disabled: ruledOff(PALETTE_TRANSFER_COMMAND.copyList), onSelect: () => void copyHexList(target, none ? null : chosen) },
        { id: 'save-project', label: PALETTE_EXPORT_TEXT.saveProject, disabled: ruledOff(PALETTE_TRANSFER_COMMAND.saveProject), onSelect: () => void saveProjectPalette(target, none ? null : chosen) },
        { id: 'add-set', label: PALETTE_EXPORT_TEXT.addSet, onSelect: () => addToSwatchSets(target, none ? null : chosen, sets) },
        { id: 'preview-with', label: PREVIEW_TEXT.menu, disabled: !target.sprite || ruledOff(PALETTE_TRANSFER_COMMAND.previewWith), children: previewItems(panel) },
      ],
    },
  ];
};

export { transferGroups };
