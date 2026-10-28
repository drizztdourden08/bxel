/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuNode } from '@drizztdourden08/tessera';
import { canDuplicate } from '../../../asset-list/can-duplicate';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import type { BrowserActions } from '../ProjectBrowser.type';

type MenuInput = {
  readonly entry: BrowserEntry;
  readonly picked: readonly BrowserEntry[];
  readonly actions: BrowserActions;
  readonly editable: boolean;
};

const when = (show: boolean, node: MenuNode): MenuNode[] => (show ? [node] : []);

const fileGroups = ({ entry, picked, actions, editable }: MenuInput): MenuGroup[] => {
  const many = picked.length > 1;
  const file = entry.kind === 'file' ? entry : null;
  const named = file?.facts.uses.length ?? 0;
  const referrers = file?.facts.usedBy.length ?? 0;
  const groups: MenuGroup[] = [
    {
      id: 'open',
      items: [
        { id: 'open', label: many ? `Open ${picked.length} files` : BROWSER_TEXT.open, icon: 'folder-open', onSelect: () => (many ? actions.openAll(picked) : actions.open(entry)) },
        ...when(!many, { id: 'properties', label: BROWSER_TEXT.properties, icon: 'sliders-horizontal', shortcut: 'Alt+Enter', onSelect: () => actions.properties([entry]) }),
      ],
    },
    {
      id: 'edit',
      items: [
        ...when(editable && !many, { id: 'rename', label: BROWSER_TEXT.rename, icon: 'pencil', shortcut: 'F2', onSelect: () => actions.startRename(entry.id) }),
        ...when(editable && picked.every((each) => each.kind === 'file' && canDuplicate(each.row)), { id: 'duplicate', label: BROWSER_TEXT.duplicate, icon: 'copy', shortcut: 'Ctrl+D', onSelect: () => actions.duplicate(picked) }),
        ...when(file !== null, { id: 'pin', label: file?.pinned === true ? BROWSER_TEXT.unpin : BROWSER_TEXT.pin, icon: file?.pinned === true ? 'pin-off' : 'pin', onSelect: () => actions.pin(picked, file?.pinned !== true) }),
      ],
    },
    {
      id: 'find',
      items: [
        ...when(file !== null && referrers > 0, { id: 'used-by', label: `${BROWSER_TEXT.findUses} (${referrers})`, icon: 'link', onSelect: () => actions.filterBy(`uses:"${file?.row.name ?? ''}"`) }),
        ...when(file !== null && named > 0, { id: 'uses', label: `${BROWSER_TEXT.findUsedBy} (${named})`, icon: 'link', onSelect: () => actions.filterBy(`usedby:"${file?.row.name ?? ''}"`) }),
      ],
    },
    {
      id: 'where',
      items: [
        { id: 'reveal', label: BROWSER_TEXT.reveal, icon: 'folder', onSelect: () => actions.reveal(entry) },
        ...when(!many, { id: 'copy-path', label: BROWSER_TEXT.copyPath, icon: 'copy', onSelect: () => actions.copyPath(entry) }),
        ...when(editable, { separator: true }),
        ...when(editable, { id: 'trash', label: BROWSER_TEXT.trash, icon: 'trash-2', tone: 'danger', shortcut: 'Delete', onSelect: () => actions.trash(picked) }),
      ],
    },
  ];
  return groups.filter((group) => group.items.length > 0);
};

/** One list of entries for a right click on a file or a folder. Several selected files share it. */
const entryMenuGroups = (input: MenuInput): MenuGroup[] => fileGroups(input);

export { entryMenuGroups };
