/* @layer renderer-app @kind logic */
import { ChoiceGrid, Text } from '@drizztdourden08/tessera';
import type { ChoiceCell, ToolbarItem } from '@drizztdourden08/tessera';
import { createElement } from 'react';
import { readOption } from '../../../editor/tool-options/read-option';
import { setOption } from '../../../editor/tool-options/set-option';
import type { OptionChoice, OptionSpec } from '../../../editor/tool-options/tool-options.type';
import { BrushPreview } from '../../OptionControls';
import { BRUSH_PICKER } from '../OptionsToolbar.constants';

const tipOf = (value: string): 'square' | 'circle' | 'line' => (value === 'circle' || value === 'line' ? value : 'square');

const cellOf = (choice: OptionChoice): ChoiceCell => ({
  value: choice.value,
  label: choice.label,
  content: createElement(BrushPreview, { size: BRUSH_PICKER.previewSize, shape: tipOf(choice.value), small: true }),
});

const brushPickerItem = (spec: OptionSpec): ToolbarItem => {
  const value = String(readOption(spec));
  const choices = spec.choices ?? [];
  const shown = choices.find((choice) => choice.value === value) ?? choices[0];
  return {
    kind: 'popover',
    id: spec.id,
    label: spec.label,
    description: spec.description,
    icon: shown?.icon ?? createElement(Text, { as: 'span', variant: 'label', numeric: true }, shown?.glyph),
    caption: shown?.label,
    render: (close) =>
      createElement(ChoiceGrid, {
        label: spec.label,
        value,
        columns: BRUSH_PICKER.columns,
        cells: choices.map(cellOf),
        pickOnRelease: true,
        onChange: (next) => {
          setOption(spec, next);
          close();
        },
      }),
  };
};

export { brushPickerItem };
