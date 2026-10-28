/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';
import type { EditorTarget, PathSpec } from './editor.type';
import type { PathTool } from './tool.type';

type PathStart = { readonly target: EditorTarget; readonly tool: PathTool; readonly spec: PathSpec; readonly at: Point };

export type { PathStart };
