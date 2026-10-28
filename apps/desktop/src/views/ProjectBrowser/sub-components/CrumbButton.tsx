/* @layer renderer-app @kind component */
import { Box, Button, DropdownMenu } from '@drizztdourden08/tessera';
import type { MenuGroup } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { Crumb } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { useFolderDrop } from '../behavior/useFolderDrop';

const CrumbButton = ({ crumb, last }: { readonly crumb: Crumb; readonly last: boolean }) => {
  const { model } = useBrowserContext();
  const drop = useFolderDrop(crumb.path);
  const siblings = model.entriesIn(crumb.path).filter((entry) => entry.kind === 'folder');
  const groups: MenuGroup[] = [{ id: 'folders', label: BROWSER_TEXT.siblings, items: siblings.map((entry) => ({ id: entry.id, label: entry.id.split('/').at(-1) ?? entry.id, icon: 'folder', onSelect: () => useBrowserStore.getState().goTo(entry.id) })) }];
  return (
    <Box className={`browser-crumb${drop.over ? ' browser-crumb--drop' : ''}`} {...drop.handlers}>
      <Button size="sm" variant="ghost" aria-current={last ? 'page' : undefined} onClick={() => useBrowserStore.getState().goTo(crumb.path)}>
        {crumb.label}
      </Button>
      {siblings.length > 0 && <DropdownMenu groups={groups} label={BROWSER_TEXT.siblings} trigger={{ label: `${BROWSER_TEXT.siblings}: ${crumb.label}`, icon: 'chevron-right', iconOnly: true }} size="sm" variant="ghost" />}
    </Box>
  );
};

export { CrumbButton };
