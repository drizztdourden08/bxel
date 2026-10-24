/* @layer renderer-app @kind component */
import { Box, Canvas, Flex } from '@drizztdourden08/tessera';
import { useBandSelect } from '../behavior/useBandSelect';
import { stateOf } from '../behavior/state-of';
import type { SpriteGridProps } from '../SpritesPanel.type';
import { SpriteTile } from './SpriteTile';

const SpriteGrid = ({ model, affected, dragFor, handlersFor, box }: SpriteGridProps) => {
  const band = useBandSelect(model.scene.selected.map((sprite) => sprite.id));
  return (
    <Box
      className="sprites-panel__grid"
      onPointerDown={band.onPointerDown}
      onPointerMove={band.onPointerMove}
      onPointerUp={band.onPointerUp}
    >
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
      <Canvas ref={band.canvas} className="sprites-panel__band" aria-hidden="true" />
    </Box>
  );
};

export { SpriteGrid };
