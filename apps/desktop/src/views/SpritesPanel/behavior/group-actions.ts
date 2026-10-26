/* @layer renderer-app @kind logic */
import type { ActionItem } from '@drizztdourden08/tessera';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import { selectIds } from '../../../sheet-manager/select-ids';
import type { ListRow } from '../SpritesPanel.type';

const groupActions = (key: string, rows: readonly ListRow[]): readonly ActionItem[] => [
  { id: 'select-folder', label: FOLDER_TEXT.select(key), icon: 'check', iconOnly: true, onSelect: () => selectIds(rows.map((row) => row.id)) },
];

export { groupActions };
