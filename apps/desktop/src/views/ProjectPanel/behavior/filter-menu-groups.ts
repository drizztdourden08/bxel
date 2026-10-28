/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { FILTER_KINDS, FILTER_STATES, ITEM_ICON, PLURAL_LABEL, STATE_LABEL } from '../../../project-browser/project-browser.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const filterMenuGroups = (model: ProjectPanelModel): readonly MenuGroup[] => {
  const { query, counts } = model;
  return [
    {
      id: 'kinds',
      label: 'Kind',
      items: FILTER_KINDS.map((kind) => ({
        id: kind,
        label: `${PLURAL_LABEL[kind]} ${counts.kinds[kind] ?? 0}`,
        icon: ITEM_ICON[kind],
        kind: 'check' as const,
        checked: query.chips.kinds.includes(kind),
        onSelect: () => query.toggleKind(kind),
      })),
    },
    {
      id: 'states',
      label: 'State',
      items: FILTER_STATES.map((state) => ({
        id: state,
        label: `${STATE_LABEL[state]} ${counts.states[state]}`,
        kind: 'check' as const,
        checked: query.chips.states.includes(state),
        onSelect: () => query.toggleState(state),
      })),
    },
  ];
};

export { filterMenuGroups };
