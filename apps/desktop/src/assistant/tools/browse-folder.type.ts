/* @layer renderer-app @kind types */
import type { SetViewInput } from './app-tool-input.type';

type BrowseFolder = NonNullable<SetViewInput['browse']>['folder'];

export type { BrowseFolder };
