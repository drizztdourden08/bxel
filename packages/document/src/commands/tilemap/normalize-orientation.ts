/* @layer core @kind logic */
import type { MapOrientation, Tileset } from '../../model/tilemap.type';
import { orientationIssue } from '../../read/orientation-issue';
import type { OrientRequest } from '../../schema/command-options.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const normalizeOrientation = (request: OrientRequest | undefined, tileset: Tileset, path: string): MapOrientation | undefined => {
  if (!request || request.kind === 'orthogonal') return undefined;
  const staggerAxis = request.staggerAxis ?? 'y';
  const across = staggerAxis === 'y' ? tileset.tileHeight : tileset.tileWidth;
  const hexSideLength = request.kind === 'hexagonal' ? (request.hexSideLength ?? Math.floor(across / 2)) : 0;
  const orientation: MapOrientation = { kind: request.kind, staggerAxis, staggerIndex: request.staggerIndex ?? 'odd', hexSideLength };
  const issue = orientationIssue(orientation, tileset);
  if (issue !== null) throw fail(ERROR_CODE.INVALID_OPTION, issue, { path });
  return orientation;
};

export { normalizeOrientation };
