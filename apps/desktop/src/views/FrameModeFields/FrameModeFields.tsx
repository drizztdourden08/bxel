/* @layer renderer-app @kind component */
import { MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import { Field, NumberInput, RadioGroup, Stack } from '@drizztdourden08/tessera';
import { ADD_TEXT, MODE_OPTIONS } from '../../add-frames/add-frames.constants';
import type { FrameModeFieldsProps } from './FrameModeFields.type';

const FrameModeFields = ({ mode, durationMs, onMode, onDuration }: FrameModeFieldsProps) => (
  <Stack gap="md">
    {mode !== null && <RadioGroup label={ADD_TEXT.mode} value={mode} options={MODE_OPTIONS.map((option) => ({ ...option }))} onChange={onMode} />}
    <Field label={ADD_TEXT.duration}>
      <NumberInput size="sm" sizeToContent min={MIN_DURATION_MS} max={MAX_DURATION_MS} step={10} value={durationMs} onChange={onDuration} />
    </Field>
  </Stack>
);

export { FrameModeFields };
