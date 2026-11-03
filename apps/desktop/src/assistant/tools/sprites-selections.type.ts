/* @layer renderer-app @kind types */
import type { SetViewInput } from './app-tool-input.type';

type IncomingSelections = NonNullable<NonNullable<SetViewInput['sprites']>['selections']>;

export type { IncomingSelections };
