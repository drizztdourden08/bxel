/* @layer renderer-app @kind component */
import { DropdownMenu, Text } from '@drizztdourden08/tessera';
import { openAnimation } from '../../../timeline/open-animation';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import type { AnimationChoiceProps } from './AnimationChoice.type';

const AnimationChoice = ({ animations }: AnimationChoiceProps) => {
  if (animations.length === 0) return <Text variant="caption" tone="muted">{TIMELINE_TEXT.noAnimations}</Text>;
  return (
    <DropdownMenu
      size="sm"
      label={TIMELINE_TEXT.openAnimation}
      trigger={{ label: TIMELINE_TEXT.openAnimation }}
      groups={[{ id: 'animations', items: animations.map((animation) => ({ id: animation.id, label: animation.name, onSelect: () => openAnimation(animation.id) })) }]}
    />
  );
};

export { AnimationChoice };
