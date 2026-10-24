/* @layer core @kind logic */
import { ASSET_FORMAT, LEGACY_FORMAT } from '../../model/asset-format.constants';
import type { DetectedKind } from './detected-kind.type';
import { KINDS } from './mime-kind.constants';

const mimeKind = (mime: string): DetectedKind | null => {
  if (mime === LEGACY_FORMAT.mime) return 'legacy';
  return KINDS.find((kind) => ASSET_FORMAT[kind].mime === mime) ?? null;
};

export { mimeKind };
