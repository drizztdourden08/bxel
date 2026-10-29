/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import type { OnionSettings } from '../../../stores/timeline-store.type';
import type { OnionChoiceField, OnionChoiceSpec, OnionSetter } from './onion-radios.type';

const onionRadios = <K extends OnionChoiceField>(spec: OnionChoiceSpec<K>, onion: OnionSettings, set: OnionSetter): MenuGroup => ({
  id: `onion-${spec.field}`,
  label: spec.label,
  items: spec.order.map((each) => ({
    id: `onion-${spec.field}-${each}`,
    label: spec.names[each],
    kind: 'radio',
    checked: onion[spec.field] === each,
    onSelect: () => set({ [spec.field]: each }),
  })),
});

export { onionRadios };
