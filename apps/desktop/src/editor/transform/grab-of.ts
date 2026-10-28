/* @layer renderer-app @kind logic */
import type { Point, Rect } from '@bxel/raster';
import { specQuad } from './spec-quad';
import type { Grab, GrabMode, Handle, HeldKeys, TransformSpec } from './transform.type';

interface GrabRequest {
  box: Rect;
  spec: TransformSpec;
  point: Point;
  handle: Handle;
}

const modeOf = (handle: Handle, keys: HeldKeys, distorted: boolean): GrabMode => {
  if (distorted || (keys.ctrlKey && handle.kind === 'corner')) return 'distort';
  return keys.ctrlKey && handle.kind === 'edge' ? 'skew' : 'scale';
};

const grabOf = (request: GrabRequest, keys: HeldKeys): Grab => {
  const { box, spec, point, handle } = request;
  const mode = modeOf(handle, keys, spec.corners !== null);
  const ready = mode === 'distort' && !spec.corners ? { ...spec, corners: specQuad(box, spec) } : spec;
  return { handle, mode, start: point, spec: ready, box };
};

export { grabOf };
export type { GrabRequest };
