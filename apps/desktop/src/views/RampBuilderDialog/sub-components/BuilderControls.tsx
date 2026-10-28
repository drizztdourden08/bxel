/* @layer renderer-app @kind component */
import { RAMP_LIMITS } from '@bxel/palette';
import { Field, SegmentedControl, Slider, Stack, TextInput, Toggle } from '@drizztdourden08/tessera';
import { numberSliders } from '../behavior/number-sliders';
import { BUILDER_TEXT, HUE_MODES } from '../RampBuilderDialog.constants';
import type { BuilderPartProps } from '../RampBuilderDialog.type';
import { BasePicker } from './BasePicker';

const BuilderControls = ({ state }: BuilderPartProps) => {
  const { settings, change } = state;
  return (
    <Stack gap="sm">
      <BasePicker state={state} />
      {numberSliders(state).map((slider) => (
        <Slider key={slider.label} size="sm" label={slider.label} min={0} max={slider.max} step={1} input showValue value={slider.value} onChange={slider.set} />
      ))}
      <SegmentedControl size="sm" label={BUILDER_TEXT.shiftMode} value={settings.hueMode} options={HUE_MODES} onChange={(hueMode) => change({ hueMode })} />
      <Slider
        size="sm"
        label={BUILDER_TEXT.shift}
        min={0}
        max={RAMP_LIMITS.maxHueShift}
        step={1}
        input
        showValue
        disabled={settings.hueMode === 'straight'}
        value={settings.hueShift}
        formatValue={BUILDER_TEXT.degrees}
        onChange={(hueShift) => change({ hueShift })}
      />
      <Toggle size="sm" label={BUILDER_TEXT.chroma} checked={settings.chromaCurve} onChange={(chromaCurve) => change({ chromaCurve })} />
      <Toggle size="sm" label={BUILDER_TEXT.snap} checked={settings.snap} onChange={(snap) => change({ snap })} />
      <Field label={BUILDER_TEXT.name} size="sm">
        <TextInput size="sm" aria-label={BUILDER_TEXT.name} value={settings.name} onChange={(event) => change({ name: event.target.value })} />
      </Field>
    </Stack>
  );
};

export { BuilderControls };
