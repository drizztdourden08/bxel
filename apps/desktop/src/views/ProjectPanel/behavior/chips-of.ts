/* @layer renderer-app @kind logic */
import { PLURAL_LABEL, STATE_LABEL } from '../../../panel-browser/project-browser.constants';
import type { BrowserQueryState } from '../../../panel-browser/project-browser.type';
import type { FilterChip } from '../ProjectPanel.type';

const chipsOf = (query: BrowserQueryState): readonly FilterChip[] => {
  const { chips } = query;
  return [
    ...chips.kinds.map((kind) => ({ id: `kind:${kind}`, label: PLURAL_LABEL[kind], remove: () => query.toggleKind(kind) })),
    ...chips.states.map((state) => ({ id: `state:${state}`, label: STATE_LABEL[state], remove: () => query.toggleState(state) })),
    ...(chips.usedBy === null ? [] : [{ id: 'used', label: `Used by ${chips.usedBy}`, remove: () => query.setUsedBy(null) }]),
    ...(chips.inside === null ? [] : [{ id: 'in', label: `In ${chips.inside}/`, remove: () => query.setInside(null) }]),
  ];
};

export { chipsOf };
