/* @layer renderer-app @kind logic */
import type { OptionSpec } from '../editor/tool-options/tool-options.type';

const generated = (spec: OptionSpec): boolean => spec.surface === 'paint' && spec.kind !== 'action';

const optionCommandOf = (spec: OptionSpec): string | undefined => (generated(spec) ? (spec.command ?? `options.${spec.id}`) : (spec.command ?? spec.shortcuts?.[0]?.command));

export { optionCommandOf };
