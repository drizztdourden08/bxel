/* @layer renderer-app @kind types */
import type { OptionSpec } from '../editor/tool-options/tool-options.type';

interface OptionTarget {
  spec: OptionSpec;
  value: unknown;
}

export type { OptionTarget };
