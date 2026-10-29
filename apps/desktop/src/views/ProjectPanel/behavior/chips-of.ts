/* @layer renderer-app @kind logic */
import type { SearchModel } from '../../../panel-browser/browser-state.type';
import type { FilterChip } from '../ProjectPanel.type';

const chipsOf = (search: SearchModel): readonly FilterChip[] => search.chips.map((chip) => ({ id: chip.text, label: chip.label, remove: () => search.remove(chip.text) }));

export { chipsOf };
