/* @layer core @kind logic */
import { strToU8 } from 'fflate';
import type { Clock } from '../clock.type';
import type { AssetExtras, AssetHeader, AssetParts } from './asset-parts.type';
import { canonicalJson } from './canonical-json';

const assetParts = (header: AssetHeader, file: unknown, extras: AssetExtras, clock: Clock): AssetParts => ({
  header,
  savedAt: clock(),
  ...(extras.readerVersion === undefined ? {} : { readerVersion: extras.readerVersion }),
  documentBytes: strToU8(canonicalJson(file)),
  preview: extras.preview,
  blobs: extras.blobs,
});

export { assetParts };
