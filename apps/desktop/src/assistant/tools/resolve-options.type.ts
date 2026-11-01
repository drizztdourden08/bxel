/* @layer renderer-app @kind types */
import type { OptionSpec, OptionValue } from '../../editor/tool-options/tool-options.type';

type Resolved = { readonly key: string; readonly spec: OptionSpec; readonly value: OptionValue };

export type { Resolved };
