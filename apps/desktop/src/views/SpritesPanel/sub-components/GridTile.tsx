/* @layer renderer-app @kind component */
import { entryId } from '../../../sheet-manager/entry-id';
import { EntryTile } from '../../EntryTile';
import { stateOf } from '../behavior/state-of';
import type { GridTileProps } from '../SpritesPanel.type';

const GridTile = ({ view, fact, cell, warning }: GridTileProps) => {
  const { model, affected, dragFor, handlersFor, box, marks } = view;
  const id = entryId(fact);
  return (
    <EntryTile
      fact={fact}
      cell={cell}
      artwork={model.artwork}
      box={box}
      state={{ ...stateOf(model, fact, affected, marks.get(id) ?? null), ...(warning === undefined ? {} : { warning }) }}
      drag={dragFor(id)}
      handlers={handlersFor(id)}
    />
  );
};

export { GridTile };
