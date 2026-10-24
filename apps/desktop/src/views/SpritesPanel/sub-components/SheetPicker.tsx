/* @layer renderer-app @kind component */
import { Select } from '@drizztdourden08/tessera';
import { SHEET_PICKER_NEW } from '../../../sheet-manager/manager.constants';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { createSheet } from '../../../sheet-manager/create-sheet';
import { useManagerStore } from '../../../stores/useManagerStore';
import type { ManagerModelProps } from '../SpritesPanel.type';

const SheetPicker = ({ model }: ManagerModelProps) => {
  const patch = useManagerStore((state) => state.patch);
  const options = [
    ...model.artwork.sheets.map((sheet) => ({ value: sheet.id, label: MANAGER_TEXT.sheetChoice(sheet.name, sheet.entries.length) })),
    { value: SHEET_PICKER_NEW, label: MANAGER_TEXT.newSheet },
  ];
  return (
    <Select
      size="sm"
      aria-label={MANAGER_TEXT.sheetPicker}
      placeholder={MANAGER_TEXT.noSheet}
      options={options}
      value={model.sheet?.id ?? ''}
      onChange={(value) => {
        if (value !== SHEET_PICKER_NEW) {
          patch({ sheetId: model.artwork.sheets.find((sheet) => sheet.id === value)?.id ?? null });
          return;
        }
        const made = createSheet();
        if (made) patch({ sheetId: made });
      }}
    />
  );
};

export { SheetPicker };
