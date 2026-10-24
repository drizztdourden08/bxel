/* @layer renderer-app @kind logic */
import type { CreationForm } from './new-sprite.type';

const sheetCount = (form: CreationForm): number => (form.kind === 'sheet' ? form.columns * form.rows : 1);

export { sheetCount };
