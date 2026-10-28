/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import { SORT_OPTIONS } from '../../../asset-list/asset-list.constants';
import type { ProjectViewSettings } from '../../../project-browser/project-browser.type';
import { GROUP_CHOICES, PROJECT_MENU, TILE_CHOICES } from '../ProjectPanel.constants';
import type { ProjectPanelModel, ViewSetter } from '../ProjectPanel.type';

const radio = (id: string, label: string, checked: boolean, onSelect: () => void): MenuItem => ({ id, label, kind: 'radio', checked, onSelect });

const rowDensity = (view: ProjectViewSettings): ProjectViewSettings['density'] => (view.density === 'grid' ? 'comfortable' : view.density);

const viewGroup = (view: ProjectViewSettings, set: ViewSetter): MenuGroup => ({
  id: 'mode',
  label: 'View',
  items: [
    radio('tree', 'Tree', view.mode === 'tree' && view.density !== 'grid', () => set({ mode: 'tree', density: rowDensity(view) })),
    radio('list', 'List', view.mode === 'list' && view.density !== 'grid', () => set({ mode: 'list', density: rowDensity(view) })),
    ...TILE_CHOICES.map((tile) => radio(`tile-${tile.size}`, tile.label, view.density === 'grid' && view.tile === tile.size, () => set({ mode: 'list', density: 'grid', tile: tile.size }))),
  ],
});

const densityGroup = (view: ProjectViewSettings, set: ViewSetter): MenuGroup => ({
  id: 'density',
  label: 'Row size',
  items: [
    radio('compact', 'Compact', view.density === 'compact', () => set({ density: 'compact' })),
    radio('comfortable', 'Comfortable', view.density === 'comfortable', () => set({ density: 'comfortable' })),
  ],
});

const listGroup = (view: ProjectViewSettings, set: ViewSetter): MenuGroup => ({
  id: 'list',
  label: 'List sections and order',
  items: [
    ...GROUP_CHOICES.map((each) => radio(`group-${each.value}`, each.label, view.group === each.value, () => set({ group: each.value }))),
    { separator: true },
    ...SORT_OPTIONS.map((each) => radio(`sort-${each.value}`, `Sort by ${each.label.toLowerCase()}`, view.sort === each.value, () => set({ sort: each.value }))),
  ],
});

const optionsMenuGroups = (model: ProjectPanelModel): readonly MenuGroup[] => {
  const { view } = model;
  return [
    viewGroup(view, view.set),
    densityGroup(view, view.set),
    listGroup(view, view.set),
    {
      id: 'more',
      items: [
        { id: 'follow', label: 'Follow the active tab', kind: 'check', checked: view.follow, onSelect: () => view.set({ follow: !view.follow }) },
        { id: 'collapse', label: PROJECT_MENU.collapseAll, icon: 'chevrons-up-down', onSelect: model.rowActions.collapseAll },
        { id: 'refresh', label: PROJECT_MENU.refresh, icon: 'refresh-cw', onSelect: model.refresh },
      ],
    },
  ];
};

export { optionsMenuGroups };
