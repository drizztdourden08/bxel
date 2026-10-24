/* @layer renderer-app @kind component */
import { Box, Flex, MarqueeBox } from '@drizztdourden08/tessera';
import { useSpriteMarquee } from '../behavior/useSpriteMarquee';
import { stateOf } from '../behavior/state-of';
import type { SpriteGridProps } from '../SpritesPanel.type';
import { SpriteTile } from './SpriteTile';

const SpriteGrid = ({ model, affected, dragFor, handlersFor, box }: SpriteGridProps) => {
  const marquee = useSpriteMarquee(model);
  return (
    <Box ref={marquee.area} className="sprites-panel__grid" onPointerDown={marquee.onPointerDown} onClick={marquee.onClick}>
      <Flex wrap gap="xs" role="group" aria-label="Sprites" className="sprites-panel__strip">
        {model.shown.map((fact) => (
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
      <MarqueeBox rect={marquee.rect} />
    </Box>
  );
};

export { SpriteGrid };
