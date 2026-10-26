/* @layer renderer-app @kind component */
import { MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import { Checkbox, Field, NumberInput, RadioGroup, Stack, TextInput } from '@drizztdourden08/tessera';
import { DIRECTION_TEXT, FRAMES_MAX, MIRROR_PAIRS, MODE_CHOICES } from '../../../direction-set/direction-set.constants';
import { FACING_TEXT } from '../../../timeline/timeline.constants';
import type { DirectionFormProps } from '../DirectionSetDialog.type';

const DirectionFields = ({ spec, update }: DirectionFormProps) => (
  <Stack gap="md">
    <Field label={DIRECTION_TEXT.name} hint={DIRECTION_TEXT.nameHint} error={spec.tag.trim() === '' ? DIRECTION_TEXT.badName : undefined}>
      <TextInput autoFocus value={spec.tag} onChange={(event) => update({ tag: event.target.value })} />
    </Field>
    <RadioGroup
      label={DIRECTION_TEXT.mode}
      direction="horizontal"
      value={spec.mode}
      options={MODE_CHOICES.map((choice) => ({ ...choice }))}
      onChange={(mode) => update({ mode, mirrored: [] })}
    />
    <Field label={DIRECTION_TEXT.frames}>
      <NumberInput size="sm" sizeToContent min={1} max={FRAMES_MAX} step={1} value={spec.framesPerFacing} onChange={(framesPerFacing) => update({ framesPerFacing })} />
    </Field>
    <Field label={DIRECTION_TEXT.duration}>
      <NumberInput size="sm" sizeToContent min={MIN_DURATION_MS} max={MAX_DURATION_MS} step={10} value={spec.durationMs} onChange={(durationMs) => update({ durationMs })} />
    </Field>
    <Field label={DIRECTION_TEXT.mirrored} hint={DIRECTION_TEXT.mirroredHint}>
      <Stack gap="xs">
        {MIRROR_PAIRS[spec.mode].map((pair) => (
          <Checkbox
            key={pair.mirrored}
            label={DIRECTION_TEXT.mirrorLabel(FACING_TEXT[pair.mirrored], FACING_TEXT[pair.source])}
            checked={spec.mirrored.includes(pair.mirrored)}
            onChange={(on) => update({ mirrored: on ? [...spec.mirrored, pair.mirrored] : spec.mirrored.filter((facing) => facing !== pair.mirrored) })}
          />
        ))}
      </Stack>
    </Field>
  </Stack>
);

export { DirectionFields };
