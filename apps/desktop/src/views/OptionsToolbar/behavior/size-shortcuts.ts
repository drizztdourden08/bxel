/* @layer renderer-app @kind logic */
import type { LabelledShortcut, ShortcutKey } from '@drizztdourden08/tessera';
import { OPTIONS_TEXT } from '../OptionsToolbar.constants';

const sizeShortcuts = (smaller: readonly ShortcutKey[] | undefined, larger: readonly ShortcutKey[] | undefined): LabelledShortcut[] | undefined => {
  const rows = [
    ...(smaller ? [{ label: OPTIONS_TEXT.smaller, keys: smaller }] : []),
    ...(larger ? [{ label: OPTIONS_TEXT.larger, keys: larger }] : []),
  ];
  return rows.length > 0 ? rows : undefined;
};

export { sizeShortcuts };
