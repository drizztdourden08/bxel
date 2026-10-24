/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../../../project/project.constants';
import type { EntryRowProps } from '../ProjectPanel.type';

const EntryMenu = ({ model, entry }: EntryRowProps) => (
  <DropdownMenu
    size="xs"
    label={PANEL_TEXT.entryActions(entry.name)}
    trigger={{ label: PANEL_TEXT.entryActions(entry.name), icon: 'ellipsis', iconOnly: true }}
    groups={[
      {
        id: 'entry',
        items: [
          { id: 'rename', label: PANEL_TEXT.rename, icon: 'pencil', onSelect: () => model.startRename(entry) },
          { id: 'trash', label: PANEL_TEXT.trash, icon: 'trash-2', tone: 'danger', onSelect: () => model.trash(entry) },
        ],
      },
    ]}
  />
);

export { EntryMenu };
