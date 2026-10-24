/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { Parsed } from '../parsed.type';
import { readAsset } from './read-asset';
import type { ReadTileset } from './read-tileset-file.type';
import { validateTilesetFile } from './validate-tileset-file';

const readTilesetFile = (bytes: Uint8Array): Parsed<ReadTileset> => {
  const read = readAsset(bytes, ASSET_KIND.tileset);
  if (!read.ok) return read;
  const { opened, check, json } = read.value;
  const file = validateTilesetFile(json, opened.manifest);
  return file.ok ? { ok: true, value: { opened, check, file: file.value } } : file;
};

export { readTilesetFile };
