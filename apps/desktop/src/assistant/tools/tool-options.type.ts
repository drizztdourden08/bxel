/* @layer renderer-app @kind types */
import type { ToolState } from '../../stores/tool-store.type';
import type { SetViewInput } from './app-tool-input.type';

type Options = NonNullable<NonNullable<SetViewInput['tool']>['options']>;

type OptionSetter = (store: ToolState, options: Options) => void;

export type { OptionSetter };
