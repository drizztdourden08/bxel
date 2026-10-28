/* @layer renderer-app @kind component */
import { Slider, Stack, TextInput } from '@drizztdourden08/tessera';
import { ColorPicker } from '@drizztdourden08/tessera/color-picker';
import { EDITOR_TEXT, PERCENT } from '../PalettePanel.constants';
import type { EditorFieldsProps } from '../PalettePanel.type';
import { HexField } from './HexField';
import { OklchPane } from './OklchPane';
import { RgbPane } from './RgbPane';

const EditorFields = ({ model, editor }: EditorFieldsProps) => (
  <Stack gap="xs">
    {model === 'hsv' && <ColorPicker value={editor.value || '#000000'} onChange={editor.change} disableAlpha />}
    {model === 'oklch' && <OklchPane value={editor.value} onChange={editor.change} />}
    {model === 'rgb' && <RgbPane value={editor.value} onChange={editor.change} />}
    {model !== 'hsv' && <HexField value={editor.value} onChange={editor.change} />}
    <Slider size="sm" label={EDITOR_TEXT.alpha} min={0} max={PERCENT} step={1} input showValue value={Math.round(editor.alpha * PERCENT)} formatValue={(value) => `${value}%`} onChange={(value) => editor.changeAlpha(value / PERCENT)} />
    <TextInput size="sm" aria-label={EDITOR_TEXT.name} placeholder={EDITOR_TEXT.name} value={editor.name} onChange={(event) => editor.rename(event.target.value)} />
  </Stack>
);

export { EditorFields };
