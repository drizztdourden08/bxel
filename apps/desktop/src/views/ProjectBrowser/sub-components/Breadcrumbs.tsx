/* @layer renderer-app @kind component */
import { Box, Button, DropdownMenu, Icon } from '@drizztdourden08/tessera';
import type { MenuGroup } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { Crumb } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/browser-context';
import { useFolderDrop } from '../behavior/useFolderDrop';

const OVERFLOW_AFTER = 4;

const CrumbButton = ({ crumb, last }: { readonly crumb: Crumb; readonly last: boolean }) => {
  const { model } = useBrowserContext();
  const drop = useFolderDrop(crumb.path);
  const siblings = model.entriesIn(crumb.path).filter((entry) => entry.kind === 'folder');
  const groups: MenuGroup[] = [{ id: 'folders', label: BROWSER_TEXT.siblings, items: siblings.map((entry) => ({ id: entry.id, label: entry.kind === 'folder' ? entry.name : '', icon: 'folder', onSelect: () => useBrowserStore.getState().goTo(entry.id) })) }];
  return (
    <Box className={`browser-crumb${drop.over ? ' browser-crumb--drop' : ''}`} {...drop.handlers}>
      <Button size="sm" variant="ghost" aria-current={last ? 'page' : undefined} onClick={() => useBrowserStore.getState().goTo(crumb.path)}>
        {crumb.label}
      </Button>
      {siblings.length > 0 && <DropdownMenu groups={groups} label={BROWSER_TEXT.siblings} trigger={{ label: `${BROWSER_TEXT.siblings}: ${crumb.label}`, icon: 'chevron-right', iconOnly: true }} size="xs" />}
    </Box>
  );
};

const folded = (crumbs: readonly Crumb[]): { readonly head: readonly Crumb[]; readonly hidden: readonly Crumb[]; readonly tail: readonly Crumb[] } =>
  crumbs.length <= OVERFLOW_AFTER ? { head: crumbs, hidden: [], tail: [] } : { head: crumbs.slice(0, 1), hidden: crumbs.slice(1, -2), tail: crumbs.slice(-2) };

/** The path to the folder shown. Each step is a place to go and a drop target; a long path folds its middle into one menu. */
const Breadcrumbs = () => {
  const { model } = useBrowserContext();
  const { head, hidden, tail } = folded(model.crumbs);
  const hiddenGroups: MenuGroup[] = [{ id: 'hidden', items: hidden.map((crumb) => ({ id: crumb.path ?? 'project', label: crumb.label, icon: 'folder', onSelect: () => useBrowserStore.getState().goTo(crumb.path) })) }];
  const last = model.crumbs.at(-1);
  return (
    <Box as="nav" className="browser-crumbs" aria-label={BROWSER_TEXT.breadcrumbs}>
      {head.map((crumb) => (
        <CrumbButton key={crumb.path ?? 'project'} crumb={crumb} last={crumb === last} />
      ))}
      {hidden.length > 0 && (
        <>
          <Icon name="chevron-right" size="sm" />
          <DropdownMenu groups={hiddenGroups} label={BROWSER_TEXT.breadcrumbs} trigger={{ label: 'Hidden folders', icon: 'ellipsis', iconOnly: true }} size="xs" />
        </>
      )}
      {tail.map((crumb) => (
        <CrumbButton key={crumb.path ?? 'project'} crumb={crumb} last={crumb === last} />
      ))}
    </Box>
  );
};

export { Breadcrumbs };
