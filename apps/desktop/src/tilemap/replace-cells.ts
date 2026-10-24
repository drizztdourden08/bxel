/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { layerOptions } from './layer-options';
import { readyStamp } from './ready-stamp';
import { runMap } from './run-map';
import { selectedMap } from './selected-map';
import { TILE_LABEL } from './tilemap.constants';

const replaceCells = (everywhere: boolean): boolean => {
  const picked = selectedMap();
  const stamp = picked ? readyStamp(picked.target) : null;
  const to = stamp?.keys.find((key) => key !== 0);
  if (!picked || to === undefined) return false;
  const { target, selection } = picked;
  const options = { ...layerOptions(target), from: selection.from, to, ...(everywhere ? {} : { rect: selection.rect }) };
  return runMap(TILE_LABEL.replace, [{ name: COMMAND_NAME.mapReplace, targets: null, options }]);
};

export { replaceCells };
