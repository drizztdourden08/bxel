/* @layer renderer-app @kind component */
import { Button, EmptyState, Flex, Stack } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { makeAnimation } from '../../../timeline/make-animation';
import { spriteUsage } from '../../../timeline/sprite-usage';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { AnimationChoice } from './AnimationChoice';
import { SeveralButton } from './SeveralButton';
import { UsedBy } from './UsedBy';

const EmptyTimeline = () => {
  const view = useActiveDocument();
  const target = useEditorTarget();
  const animations = view?.state.artwork.animations ?? [];
  const isSprite = target !== null && target.sprite.role === 'sprite';
  const canMake = isSprite && !(view?.state.readOnly ?? true);
  const used = useMemo(() => (view && isSprite ? spriteUsage(view.state.artwork, target.sprite.id) : []), [view, isSprite, target?.sprite.id]);
  return (
    <EmptyState
      size="sm"
      title={TIMELINE_TEXT.emptyTitle}
      message={TIMELINE_TEXT.empty}
      action={
        <Stack gap="sm" align="center">
          <Flex gap="sm" align="center" wrap>
            <Button variant="primary" size="sm" disabled={!canMake} onClick={() => void makeAnimation()}>
              {TIMELINE_TEXT.makeFromSprite}
            </Button>
            <SeveralButton />
            <AnimationChoice animations={animations} />
          </Flex>
          {used.length > 0 && <UsedBy used={used} />}
        </Stack>
      }
    />
  );
};

export { EmptyTimeline };
