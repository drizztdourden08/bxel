/* @layer renderer-app @kind component */
import { Button, DropdownMenu, EmptyState, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { makeAnimationFrom } from '../../../sheet-manager/make-animation-from';
import { uniqueName } from '../../../sprite-name/unique-name';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { makeAnimation } from '../../../timeline/make-animation';
import { openAnimation } from '../../../timeline/open-animation';
import { openAnimationAt } from '../../../timeline/open-animation-at';
import { spriteUsage } from '../../../timeline/sprite-usage';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';

const EmptyTimeline = () => {
  const view = useActiveDocument();
  const target = useEditorTarget();
  const picked = useSpriteStore((state) => state.selected);
  const animations = view?.state.artwork.animations ?? [];
  const isSprite = target !== null && target.sprite.role === 'sprite';
  const canMake = isSprite && !(view?.state.readOnly ?? true);
  const used = useMemo(() => (view && isSprite ? spriteUsage(view.state.artwork, target.sprite.id) : []), [view, isSprite, target?.sprite.id]);
  const several = view !== null && !view.state.readOnly && picked.length > 1;
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
            {several && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const name = uniqueName(TIMELINE_TEXT.severalName, animations.map((each) => each.name));
                  void makeAnimationFrom(picked, name, { name, mode: 'reference', durationMs: 100 });
                }}
              >
                {TIMELINE_TEXT.makeFromSprites(picked.length)}
              </Button>
            )}
            {animations.length > 0 ? (
              <DropdownMenu
                size="sm"
                label={TIMELINE_TEXT.openAnimation}
                trigger={{ label: TIMELINE_TEXT.openAnimation }}
                groups={[{ id: 'animations', items: animations.map((animation) => ({ id: animation.id, label: animation.name, onSelect: () => openAnimation(animation.id) })) }]}
              />
            ) : (
              <Text variant="caption" tone="muted">{TIMELINE_TEXT.noAnimations}</Text>
            )}
          </Flex>
          {used.length > 0 && (
            <Stack gap="xs" role="group" aria-label={TIMELINE_PANEL_TEXT.usedBy} className="timeline__used">
              <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.usedBy}</Text>
              {used.map((use) => (
                <Flex key={use.animationId} gap="sm" align="center" wrap>
                  <Text variant="caption">{`${use.name}, ${TIMELINE_TEXT.framesList(use.frames.map((frame) => frame.number))}`}</Text>
                  <Button size="sm" variant="tertiary" onClick={() => openAnimationAt(use.animationId, use.frames[0]?.id ?? null)}>
                    {TIMELINE_PANEL_TEXT.openAtFrame(use.frames[0]?.number ?? 1)}
                  </Button>
                </Flex>
              ))}
            </Stack>
          )}
        </Stack>
      }
    />
  );
};

export { EmptyTimeline };
