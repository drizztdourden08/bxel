/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import { ONION_LIMITS } from '../../../stores/timeline-store.constants';
import type { OnionSettings } from '../../../stores/timeline-store.type';
import {
  ONION_FALLOFF_ORDER,
  ONION_ORDER_ORDER,
  ONION_POSITION_ORDER,
  ONION_SCOPE_ORDER,
  ONION_STYLE_ORDER,
  ONION_TEXT,
  ONION_TINT_ORDER,
} from '../../../timeline/onion.constants';
import { OPACITY_STEP } from './onion-groups.constants';
import { onionRadios } from './onion-radios';
import type { OnionCheckField, OnionSetter } from './onion-radios.type';

const slider = (item: Pick<MenuItem, 'id' | 'label' | 'value' | 'min' | 'max' | 'step' | 'onChange'>): MenuItem => ({ ...item, kind: 'slider' });

const check = (field: OnionCheckField, label: string, onion: OnionSettings, set: OnionSetter): MenuItem => ({
  id: `onion-${field}`,
  label,
  kind: 'check',
  checked: onion[field],
  onSelect: () => set({ [field]: !onion[field] }),
});

const amounts = (onion: OnionSettings, set: OnionSetter): MenuGroup => {
  const { frames, opacity } = ONION_LIMITS;
  return {
    id: 'onion-amounts',
    items: [
      slider({ id: 'onion-before', label: ONION_TEXT.before, value: onion.before, min: frames.min, max: frames.max, step: 1, onChange: (before) => set({ before }) }),
      slider({ id: 'onion-after', label: ONION_TEXT.after, value: onion.after, min: frames.min, max: frames.max, step: 1, onChange: (after) => set({ after }) }),
      slider({ id: 'onion-opacity', label: ONION_TEXT.opacity, value: onion.opacity, min: opacity.min, max: opacity.max, step: OPACITY_STEP, onChange: (next) => set({ opacity: next }) }),
    ],
  };
};

const onionGroups = (onion: OnionSettings, set: OnionSetter): MenuGroup[] => [
  amounts(onion, set),
  onionRadios({ field: 'falloff', label: ONION_TEXT.falloff, order: ONION_FALLOFF_ORDER, names: ONION_TEXT.falloffs }, onion, set),
  onionRadios({ field: 'tint', label: ONION_TEXT.tint, order: ONION_TINT_ORDER, names: ONION_TEXT.tints }, onion, set),
  onionRadios({ field: 'style', label: ONION_TEXT.style, order: ONION_STYLE_ORDER, names: ONION_TEXT.styles }, onion, set),
  onionRadios({ field: 'order', label: ONION_TEXT.order, order: ONION_ORDER_ORDER, names: ONION_TEXT.orders }, onion, set),
  onionRadios({ field: 'scope', label: ONION_TEXT.scope, order: ONION_SCOPE_ORDER, names: ONION_TEXT.scopes }, onion, set),
  onionRadios({ field: 'position', label: ONION_TEXT.position, order: ONION_POSITION_ORDER, names: ONION_TEXT.positions }, onion, set),
  {
    id: 'onion-switches',
    items: [check('wrap', ONION_TEXT.wrap, onion, set), check('skipRepeats', ONION_TEXT.skipRepeats, onion, set), check('hideWhilePlaying', ONION_TEXT.hide, onion, set)],
  },
];

export { onionGroups };
