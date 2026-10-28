/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import type { MenuGroup } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { KIND_ICON } from '../../../asset-list/asset-list.constants';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { NEW_KINDS } from '../ProjectBrowser.constants';

const CreateMenu = () => {
  const { actions, model } = useBrowserContext();
  const heading = model.folder === null ? BROWSER_TEXT.newAsset : BROWSER_TEXT.inFolder(model.folder.split('/').at(-1) ?? '');
  const groups: MenuGroup[] = [
    { id: 'new', label: heading, items: NEW_KINDS.map((kind) => ({ id: kind, label: ASSET_LIST_TEXT.newKinds[kind], icon: KIND_ICON[kind], onSelect: () => actions.newAsset(kind) })) },
    {
      id: 'more',
      items: [
        { id: 'folder', label: BROWSER_TEXT.newFolder, icon: 'folder', shortcut: 'Ctrl+Shift+N', disabled: model.folder === null, onSelect: actions.newFolder },
        { id: 'image', label: 'Import an image...', icon: 'upload', onSelect: actions.importImage },
        { id: 'palette', label: 'Import a palette file...', icon: 'pixel-palette', onSelect: actions.importPalette },
      ],
    },
  ];
  return <DropdownMenu groups={groups} label={BROWSER_TEXT.newAsset} variant="primary" size="sm" disabled={!model.editable} trigger={{ label: BROWSER_TEXT.newAsset, icon: 'chevron-down', iconSide: 'end' }} />;
};

export { CreateMenu };
