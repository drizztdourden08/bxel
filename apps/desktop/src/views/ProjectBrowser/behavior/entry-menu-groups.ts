/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuNode } from '@drizztdourden08/tessera';
import { canDuplicate } from '../../../asset-list/can-duplicate';
import { FILE_ACTION_TEXT } from '../../../project-browser/file-actions.constants';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { roleFolderMenuNode } from '../../../project-config/role-folder-menu-node';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import type { MenuInput } from '../ProjectBrowser.type';

const when = (show: boolean, node: MenuNode): MenuNode[] => (show ? [node] : []);

const openGroup = ({ entry, picked, actions }: MenuInput): MenuGroup => {
  const many = picked.length > 1;
  return {
    id: 'open',
    items: [
      { id: 'open', label: many ? `Open ${picked.length} files` : BROWSER_TEXT.open, icon: 'folder-open', onSelect: () => (many ? actions.openAll(picked) : actions.open(entry)) },
      { id: 'properties', label: many ? FILE_ACTION_TEXT.propertiesMany(picked.length) : BROWSER_TEXT.properties, icon: 'sliders-horizontal', shortcut: 'Alt+Enter', onSelect: () => actions.properties(many ? picked : [entry]) },
    ],
  };
};

const collectItems = ({ picked, actions, collections }: MenuInput): MenuNode[] => {
  const files = picked.filter((each): each is FileEntry => each.kind === 'file' && each.row.assetId !== null);
  const inside = (collection: MenuInput['collections'][number]): boolean => files.every((each) => each.row.assetId !== null && collection.assets.includes(each.row.assetId));
  return collections.map((collection) => ({
    id: `collect:${collection.id}`,
    label: collection.name,
    kind: 'check',
    checked: inside(collection),
    onSelect: () => actions.collect(files, collection.id, !inside(collection)),
  }));
};

const editGroup = ({ entry, picked, actions, editable }: MenuInput): MenuGroup => {
  const duplicable = picked.every((each) => each.kind === 'file' && canDuplicate(each.row));
  return {
    id: 'edit',
    items: [
      ...when(editable && picked.length === 1, { id: 'rename', label: BROWSER_TEXT.rename, icon: 'pencil', shortcut: 'F2', onSelect: () => actions.startRename(entry.id) }),
      ...when(editable && duplicable, { id: 'duplicate', label: BROWSER_TEXT.duplicate, icon: 'copy', shortcut: 'Ctrl+D', onSelect: () => actions.duplicate(picked) }),
      ...when(editable, { id: 'cut', label: FILE_ACTION_TEXT.cut, shortcut: 'Ctrl+X', onSelect: () => actions.cut(picked) }),
      ...when(editable, { id: 'copy', label: FILE_ACTION_TEXT.copy, icon: 'copy', shortcut: 'Ctrl+C', onSelect: () => actions.copy(picked) }),
      ...when(editable, { id: 'paste', label: FILE_ACTION_TEXT.paste, shortcut: 'Ctrl+V', onSelect: actions.paste }),
      ...when(editable, { id: 'move-to', label: FILE_ACTION_TEXT.moveTo, icon: 'folder', onSelect: () => actions.moveTo(picked) }),
    ],
  };
};

const organiseGroup = (input: MenuInput, file: FileEntry | null): MenuGroup => {
  const organisable = input.editable && file !== null && file.row.assetId !== null;
  return {
    id: 'organise',
    items: [
      ...when(organisable && input.collections.length > 0, { id: 'collect', label: BROWSER_TEXT.addToCollection, icon: 'bookmark', children: collectItems(input) }),
      ...when(organisable, { id: 'pin', label: file?.pinned ? BROWSER_TEXT.unpin : BROWSER_TEXT.pin, icon: file?.pinned ? 'pin-off' : 'pin', onSelect: () => input.actions.pin(input.picked, !file?.pinned) }),
    ],
  };
};

const roleGroup = ({ entry, picked, editable }: MenuInput): MenuGroup => ({
  id: 'role',
  items: entry.kind === 'folder' && editable && picked.length === 1 ? [roleFolderMenuNode(entry.path)] : [],
});

const findGroup = ({ actions }: MenuInput, file: FileEntry | null): MenuGroup => {
  const users = file?.facts.usedBy.length ?? 0;
  const uses = file?.facts.uses.length ?? 0;
  const name = file?.row.name ?? '';
  return {
    id: 'find',
    items: [
      ...when(users > 0, { id: 'used-by', label: `${BROWSER_TEXT.findUses} (${users})`, icon: 'link', onSelect: () => actions.filterBy(`uses:"${name}"`) }),
      ...when(uses > 0, { id: 'uses', label: `${BROWSER_TEXT.findUsedBy} (${uses})`, icon: 'link', onSelect: () => actions.filterBy(`usedby:"${name}"`) }),
    ],
  };
};

const whereGroup = ({ entry, picked, actions, editable }: MenuInput): MenuGroup => ({
  id: 'where',
  items: [
    { id: 'reveal', label: BROWSER_TEXT.reveal, icon: 'folder', onSelect: () => actions.reveal(entry) },
    ...when(picked.length === 1, { id: 'copy-path', label: BROWSER_TEXT.copyPath, icon: 'copy', onSelect: () => actions.copyPath(entry) }),
    ...when(editable, { separator: true }),
    ...when(editable, { id: 'trash', label: BROWSER_TEXT.trash, icon: 'trash-2', tone: 'danger', shortcut: 'Delete', onSelect: () => actions.trash(picked) }),
  ],
});

const entryMenuGroups = (input: MenuInput): MenuGroup[] => {
  const file = input.entry.kind === 'file' ? input.entry : null;
  return [openGroup(input), editGroup(input), organiseGroup(input, file), roleGroup(input), findGroup(input, file), whereGroup(input)].filter((group) => group.items.length > 0);
};

export { entryMenuGroups };
