/* @layer renderer-app @kind component */
import { stateOf } from '../behavior/state-of';
import type { GridTileProps } from '../SpritesPanel.type';
import { SpriteTile } from './SpriteTile';

const GridTile = ({ view, fact, cell }: GridTileProps) => {
  const { model, affected, dragFor, handlersFor, box } = view;
  return (
    <SpriteTile
      fact={fact}
      cell={cell}
      artwork={model.artwork}
      box={box}
      state={stateOf(model, fact, affected)}
      drag={dragFor(fact.sprite.id)}
      handlers={handlersFor(fact.sprite.id)}
    />
  );
};

export { GridTile };
