/* @layer renderer-app @kind types */
import type { SetViewInput } from './app-tool-input.type';

type Shape = NonNullable<SetViewInput['selection']>['shape'];

export type { Shape };
