/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import { targetGeometry } from './target-geometry';

const cellOf = (at: Point, target: Pick<MapTarget, 'tilemap' | 'tileset'>): Point => targetGeometry(target).cellAt(at.x, at.y);

export { cellOf };
