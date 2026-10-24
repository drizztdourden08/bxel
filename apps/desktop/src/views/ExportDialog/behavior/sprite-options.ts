/* @layer renderer-app @kind logic */
import type { SpriteChoice } from '../../../export/export.type';
import { EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';

const spriteOptions = (spriteCount: number, selectedCount: number, sheetLabel: string | null): { value: SpriteChoice; label: string }[] => [
  { value: 'current', label: EXPORT_DIALOG_TEXT.current },
  ...(selectedCount > 0 ? [{ value: 'selected' as const, label: EXPORT_DIALOG_TEXT.selected(selectedCount) }] : []),
  ...(sheetLabel === null ? [] : [{ value: 'sheet' as const, label: EXPORT_DIALOG_TEXT.onSheet(sheetLabel) }]),
  { value: 'all', label: EXPORT_DIALOG_TEXT.all(spriteCount) },
];

export { spriteOptions };
