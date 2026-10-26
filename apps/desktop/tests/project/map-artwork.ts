/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, CommandStep } from '@bxel/document';
import { artworkFromSteps } from './artwork-from-steps';

const step = (name: string, options: unknown, ref?: string): CommandStep => ({ name, targets: null, options, ...(ref ? { ref } : {}) });

const setSteps = (name: string, map: string): CommandStep[] => [
  step(COMMAND_NAME.tilesetCreate, { name, tileWidth: 4, tileHeight: 4 }, name),
  step(COMMAND_NAME.tileAdd, { tileset: { ref: name } }),
  step(COMMAND_NAME.tileAdd, { tileset: { ref: name } }),
  step(COMMAND_NAME.tilemapCreate, { name: map, tileset: { ref: name }, columns: 4, rows: 3 }),
];

const mapArtwork = (): Artwork => artworkFromSteps('Maps', [...setSteps('ground', 'level'), ...setSteps('secret', 'vault')]);

export { mapArtwork };
