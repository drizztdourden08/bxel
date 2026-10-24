/* @layer core @kind logic */
import { strToU8 } from 'fflate';
import type { Clock } from '../clock.type';
import type { AssetExtras, AssetHeader } from './asset-parts.type';
import { canonicalJson } from './canonical-json';
import { writeAssetContainer } from './write-asset-container';

const encodeAssetFile = (header: AssetHeader, file: unknown, extras: AssetExtras, clock: Clock): Uint8Array =>
  writeAssetContainer({ header, savedAt: clock(), documentBytes: strToU8(canonicalJson(file)), ...extras });

export { encodeAssetFile };
