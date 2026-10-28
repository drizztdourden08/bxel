/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { createOverlay } from './create-overlay';
import type { EditorTarget, PathSession, PathSpec } from './editor.type';
import { paintPath } from './paint-path';
import type { PathTool } from './tool.type';

type PathStart = { readonly target: EditorTarget; readonly tool: PathTool; readonly spec: PathSpec; readonly at: Point };

const beginPath = ({ target, tool, spec, at }: PathStart): PathSession => {
  const session: PathSession = { ...createOverlay(target), kind: 'path', tool, spec, vertices: [at], hover: at, phase: 'draw' };
  paintPath(session);
  return session;
};

export { beginPath };
