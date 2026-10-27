/* @layer renderer-app @kind types */
import type { Artwork } from '@bxel/document';
import type { Workspace } from '../../workspace/workspace.type';

type Search = { readonly workspace: Workspace; readonly artwork: Artwork; readonly hidden: ReadonlySet<string>; readonly named: ReadonlySet<string> };

export type { Search };
