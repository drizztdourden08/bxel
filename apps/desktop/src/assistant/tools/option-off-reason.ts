/* @layer renderer-app @kind logic */
import type { OptionSpec } from '../../editor/tool-options/tool-options.type';
import { useToolStore } from '../../stores/useToolStore';

const optionOffReason = (spec: OptionSpec): string | undefined => {
  if (spec.tool !== useToolStore.getState().tool) return undefined;
  if (spec.appliesWhen?.() === false) return 'Another option makes it irrelevant.';
  return spec.disabledReason?.();
};

export { optionOffReason };
