/* @layer renderer-app @kind logic */
import { MARQUEE_KEY_ATTRIBUTE } from '@drizztdourden08/tessera';
import type { SyntheticEvent } from 'react';
import type { SpriteId } from '@bxel/document';
import type { SpriteHandlers } from '../SpritesPanel.type';
import { MARQUEE_ITEM } from '../SpritesPanel.constants';

const rowIdOf = (event: SyntheticEvent): string | null =>
  event.target instanceof Element ? (event.target.closest(MARQUEE_ITEM)?.getAttribute(MARQUEE_KEY_ATTRIBUTE) ?? null) : null;

const rowEvents = (handlersFor: (id: SpriteId) => SpriteHandlers, known: ReadonlyMap<string, SpriteId>) => {
  const run = (event: SyntheticEvent, pick: (handlers: SpriteHandlers) => () => void): void => {
    const id = known.get(rowIdOf(event) ?? '');
    if (id !== undefined) pick(handlersFor(id))();
  };
  return {
    onDoubleClick: (event: SyntheticEvent): void => run(event, (handlers) => handlers.onRename),
    onContextMenu: (event: SyntheticEvent): void => run(event, (handlers) => handlers.onMenu),
  };
};

export { rowEvents };
