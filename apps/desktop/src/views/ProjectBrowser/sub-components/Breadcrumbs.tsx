/* @layer renderer-app @kind component */
import { Box, DropdownMenu, Icon } from '@drizztdourden08/tessera';
import type { MenuGroup } from '@drizztdourden08/tessera';
import { BROWSER_TEXT, OVERFLOW_AFTER } from '../../../project-browser/project-browser.constants';
import type { Crumb } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { CrumbButton } from './CrumbButton';

const folded = (crumbs: readonly Crumb[]): { readonly head: readonly Crumb[]; readonly hidden: readonly Crumb[]; readonly tail: readonly Crumb[] } =>
  crumbs.length <= OVERFLOW_AFTER ? { head: crumbs, hidden: [], tail: [] } : { head: crumbs.slice(0, 1), hidden: crumbs.slice(1, -2), tail: crumbs.slice(-2) };

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
          <Icon name="chevron-right" size={14} />
          <DropdownMenu groups={hiddenGroups} label={BROWSER_TEXT.breadcrumbs} trigger={{ label: 'Hidden folders', icon: 'ellipsis', iconOnly: true }} size="sm" variant="ghost" />
        </>
      )}
      {tail.map((crumb) => (
        <CrumbButton key={crumb.path ?? 'project'} crumb={crumb} last={crumb === last} />
      ))}
    </Box>
  );
};

export { Breadcrumbs };
