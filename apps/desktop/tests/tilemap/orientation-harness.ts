/* @layer renderer-app @kind helper */
import { COMMAND_NAME } from '@bxel/document';
import type { OrientRequest } from '@bxel/document';
import { runDocument } from '../../src/sheet/run-document';
import { mapNow } from './map-harness';

const setMapOrientation = (orientation: OrientRequest): void => {
  const done = runDocument('Set orientation', [{ name: COMMAND_NAME.tilemapOrient, targets: null, options: { tilemap: mapNow().id, orientation } }]);
  if (!done) throw new Error('could not set the orientation');
};

export { setMapOrientation };
