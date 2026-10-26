/* @layer renderer-app @kind component */
import { Button, DropdownMenu, EmptyState, Flex, Text } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { makeAnimation } from '../../../timeline/make-animation';
import { openAnimation } from '../../../timeline/open-animation';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';

const EmptyTimeline = () => {
  const view = useActiveDocument();
  const target = useEditorTarget();
  const animations = view?.state.artwork.animations ?? [];
  const canMake = target !== null && target.sprite.role === 'sprite' && !(view?.state.readOnly ?? true);
  return (
    <EmptyState
      size="sm"
      title={TIMELINE_TEXT.emptyTitle}
      message={TIMELINE_TEXT.empty}
      action={
        <Flex gap="sm" align="center" wrap>
          <Button variant="primary" size="sm" disabled={!canMake} onClick={() => void makeAnimation()}>
            {TIMELINE_TEXT.makeFromSprite}
          </Button>
          {animations.length > 0 ? (
            <DropdownMenu
              size="sm"
              label={TIMELINE_TEXT.openAnimation}
              trigger={{ label: TIMELINE_TEXT.openAnimation }}
              groups={[
                {
                  id: 'animations',
                  items: animations.map((animation) => ({ id: animation.id, label: animation.name, onSelect: () => openAnimation(animation.id) })),
                },
              ]}
            />
          ) : (
            <Text variant="caption" tone="muted">{TIMELINE_TEXT.noAnimations}</Text>
          )}
        </Flex>
      }
    />
  );
};

export { EmptyTimeline };
