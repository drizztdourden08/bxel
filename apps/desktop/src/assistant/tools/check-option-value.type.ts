/* @layer renderer-app @kind types */
import type { OptionValue } from '../../editor/tool-options/tool-options.type';

type Checked = { readonly value: OptionValue } | { readonly problem: string };

export type { Checked };
