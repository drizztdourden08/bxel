/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { hasToken } from '../../../panel-browser/has-token';
import { FILTER_KINDS, FILTER_STATES, ITEM_ICON, PLURAL_LABEL, STATE_LABEL } from '../../../panel-browser/project-browser.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const filterMenuGroups = (model: ProjectPanelModel): readonly MenuGroup[] => {
  const { search, counts } = model;
  return [
    {
      id: 'kinds',
      label: 'Kind',
      items: FILTER_KINDS.map((kind) => ({
        id: kind,
        label: `${PLURAL_LABEL[kind]} ${counts.kinds[kind] ?? 0}`,
        icon: ITEM_ICON[kind],
        kind: 'check' as const,
        checked: hasToken(search.tokens, `kind:${kind}`),
        onSelect: () => search.toggle(`kind:${kind}`),
      })),
    },
    {
      id: 'states',
      label: 'State',
      items: FILTER_STATES.map((state) => ({
        id: state,
        label: `${STATE_LABEL[state]} ${counts.states[state]}`,
        kind: 'check' as const,
        checked: hasToken(search.tokens, `is:${state}`),
        onSelect: () => search.toggle(`is:${state}`),
      })),
    },
  ];
};

export { filterMenuGroups };
