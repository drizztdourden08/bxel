/* @layer renderer-app @kind logic */
import type { SpriteState } from '../SpritesPanel.type';

const tileClass = (base: string, state: SpriteState): string =>
  [
    base,
    state.active ? `${base}--active` : '',
    state.affected ? `${base}--affected` : '',
    state.loose ? `${base}--loose` : '',
  ]
    .filter(Boolean)
    .join(' ');

export { tileClass };
