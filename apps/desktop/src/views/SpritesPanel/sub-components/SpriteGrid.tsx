/* @layer renderer-app @kind component */
import { Box, Flex, MarqueeBox, Stack } from '@drizztdourden08/tessera';
import { useSpriteMarquee } from '../behavior/useSpriteMarquee';
import { stateOf } from '../behavior/state-of';
import type { SpriteGridProps } from '../SpritesPanel.type';
import { FolderHeader } from './FolderHeader';
import { SpriteTile } from './SpriteTile';

const SpriteGrid = ({ model, affected, dragFor, handlersFor, box }: SpriteGridProps) => {
  const marquee = useSpriteMarquee(model);
  return (
    <Box ref={marquee.area} className="sprites-panel__grid" onPointerDown={marquee.onPointerDown} onClick={marquee.onClick}>
      <Stack gap="xs">
        {model.groups
          .filter((group) => !group.hidden)
          .map((group) => (
            <Stack key={group.path} gap="2xs">
              {group.path !== '' && <FolderHeader group={group} />}
              {!group.closed && (
                <Flex wrap gap="xs" role="group" aria-label={group.path === '' ? 'Sprites' : group.path} className="sprites-panel__strip">
                  {group.facts.map((fact) => (
                    <SpriteTile
                      key={fact.sprite.id}
                      fact={fact}
                      artwork={model.artwork}
                      box={box}
                      state={stateOf(model, fact, affected)}
                      drag={dragFor(fact.sprite.id)}
                      handlers={handlersFor(fact.sprite.id)}
                    />
                  ))}
                </Flex>
              )}
            </Stack>
          ))}
      </Stack>
      <MarqueeBox rect={marquee.rect} />
    </Box>
  );
};

export { SpriteGrid };
