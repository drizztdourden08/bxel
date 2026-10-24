/* @layer renderer-app @kind component */
import type { PaletteDefault } from '@bxel/project';
import { Select } from '@drizztdourden08/tessera';
import { APP_ASSET_DEFAULTS, DEFAULTS_TEXT } from '../../../asset-defaults/asset-defaults.constants';
import { paletteChoice } from '../../../asset-defaults/palette-choice';
import { paletteFromChoice } from '../../../asset-defaults/palette-from-choice';
import { PALETTE_PRESETS } from '../../../palette-source/palette-source.constants';
import type { DefaultsEditorProps } from '../DefaultsEditor.type';

const isPalette = (value: unknown): value is PaletteDefault => typeof value === 'object' && value !== null && 'kind' in value;

const PaletteEditor = ({ value, files, onChange }: Pick<DefaultsEditorProps, 'value' | 'files' | 'onChange'>) => {
  const groups = [
    { label: DEFAULTS_TEXT.presetGroup, options: PALETTE_PRESETS.map((preset) => ({ value: paletteChoice({ kind: 'preset', presetId: preset.id }), label: preset.name })) },
    ...(files && files.length > 0 ? [{ label: DEFAULTS_TEXT.fileGroup, options: [...files] }] : []),
  ];
  const current = paletteChoice(isPalette(value) ? value : APP_ASSET_DEFAULTS.palette);
  return (
    <Select
      searchable
      groups={groups}
      value={current}
      onChange={(next) => {
        const palette = paletteFromChoice(next);
        if (palette) onChange(palette);
      }}
      aria-label={DEFAULTS_TEXT.presetGroup}
    />
  );
};

export { PaletteEditor };
