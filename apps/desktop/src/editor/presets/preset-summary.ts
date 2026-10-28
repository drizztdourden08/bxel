/* @layer renderer-app @kind logic */
import { optionById } from '../tool-options/option-by-id';
import { valueWords } from '../tool-options/value-words';
import type { ToolPreset } from './tool-preset.type';

const presetSummary = (preset: ToolPreset): string =>
  Object.entries(preset.fields)
    .flatMap(([id, value]) => {
      const spec = optionById(id);
      if (!spec) return [];
      if (spec.kind === 'toggle') return value === true ? [spec.label] : [];
      return [spec.kind === 'number' ? `${valueWords(spec, value)} px` : valueWords(spec, value)];
    })
    .join(', ');

export { presetSummary };
