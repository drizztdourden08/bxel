/* @layer renderer-app @kind logic */
import { addTile } from './add-tile';
import { setLayout } from './set-layout';

const addTileAt = (index: number): boolean => {
  const key = addTile();
  return key === null ? false : setLayout({ move: [{ key, to: index }] });
};

export { addTileAt };
