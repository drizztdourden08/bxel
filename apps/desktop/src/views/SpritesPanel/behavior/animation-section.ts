/* @layer renderer-app @kind logic */
import type { VirtualGridSection } from '@drizztdourden08/tessera';
import type { AnimationFacts, EntryFacts } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { ANIMATION_SECTION } from '../SpritesPanel.constants';

const animationSection = (animations: readonly AnimationFacts[]): VirtualGridSection<EntryFacts>[] =>
  animations.length === 0 ? [] : [{ key: ANIMATION_SECTION, label: MANAGER_TEXT.kinds.animations, items: animations, depth: 0 }];

export { animationSection };
