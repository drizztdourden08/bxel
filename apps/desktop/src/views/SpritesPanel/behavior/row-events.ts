/* @layer renderer-app @kind logic */
import { MARQUEE_KEY_ATTRIBUTE } from '@drizztdourden08/tessera';
import type { SyntheticEvent } from 'react';
import type { SpriteHandlers } from '../SpritesPanel.type';
import { MARQUEE_ITEM } from '../SpritesPanel.constants';

const rowIdOf = (event: SyntheticEvent): string | null =>
  event.target instanceof Element ? (event.target.closest(MARQUEE_ITEM)?.getAttribute(MARQUEE_KEY_ATTRIBUTE) ?? null) : null;

const rowEvents = (handlersFor: (id: string) => SpriteHandlers, known: ReadonlyMap<string, unknown>) => {
  const run = (event: SyntheticEvent, pick: (handlers: SpriteHandlers) => () => void): void => {
    const id = rowIdOf(event);
    if (id !== null && known.has(id)) pick(handlersFor(id))();
  };
  return {
    onDoubleClick: (event: SyntheticEvent): void => run(event, (handlers) => handlers.onEdit),
    onContextMenu: (event: SyntheticEvent): void => run(event, (handlers) => handlers.onMenu),
  };
};

export { rowEvents };
