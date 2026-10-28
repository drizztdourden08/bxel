/* @layer renderer-app @kind logic */
import type { OptionSpec } from './tool-options.type';

const stored = (spec: OptionSpec): boolean => spec.surface === 'paint' && spec.kind !== 'action';

export { stored };
