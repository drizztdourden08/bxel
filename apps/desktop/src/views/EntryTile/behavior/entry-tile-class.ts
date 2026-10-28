/* @layer renderer-app @kind logic */
import type { EntryTileState } from '../EntryTile.type';
import { BASE } from './entry-tile-class.constants';

const entryTileClass = (state: EntryTileState): string =>
  [
    BASE,
    state.active ? `${BASE}--active` : '',
    state.affected ? `${BASE}--affected` : '',
    state.loose ? `${BASE}--loose` : '',
    state.mark ? `${BASE}--mark-${state.mark}` : '',
  ]
    .filter(Boolean)
    .join(' ');

export { entryTileClass };
