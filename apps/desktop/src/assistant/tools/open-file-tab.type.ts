/* @layer renderer-app @kind types */
import type { OpenTab } from '../../workspace/workspace.type';

type OpenFileHit = { readonly tab: OpenTab; readonly path: string };

export type { OpenFileHit };
