/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import type { MenuGroup } from '@drizztdourden08/tessera';
import { revealRow } from '../../../asset-list/reveal-row';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { packCurrentProject } from '../../../project/pack-current-project';
import { useBrowserContext } from '../behavior/useBrowserContext';

const MoreMenu = () => {
  const { actions, model } = useBrowserContext();
  const home = model.roots[0]?.path ?? null;
  const groups: MenuGroup[] = [
    {
      id: 'import',
      items: [
        { id: 'image', label: BROWSER_TEXT.importImage, icon: 'upload', disabled: !model.editable, onSelect: actions.importImage },
        { id: 'palette', label: BROWSER_TEXT.importPalette, icon: 'pixel-palette', disabled: !model.editable, onSelect: actions.importPalette },
        { id: 'tiled', label: BROWSER_TEXT.importTiled, icon: 'pixel-tileset', disabled: !model.editable, onSelect: actions.importTiled },
      ],
    },
    {
      id: 'project',
      items: [
        { id: 'pack', label: BROWSER_TEXT.pack, icon: 'package', disabled: !model.editable, onSelect: () => void packCurrentProject() },
        { id: 'reveal', label: BROWSER_TEXT.revealProject, icon: 'folder-open', disabled: home === null, onSelect: () => (home === null ? undefined : revealRow({ path: home })) },
      ],
    },
  ];
  return <DropdownMenu groups={groups} label={BROWSER_TEXT.more} variant="tertiary" size="sm" trigger={{ label: BROWSER_TEXT.more, icon: 'ellipsis', iconOnly: true }} />;
};

export { MoreMenu };
