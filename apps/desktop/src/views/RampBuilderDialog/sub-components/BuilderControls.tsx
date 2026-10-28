/* @layer renderer-app @kind component */
import { RAMP_LIMITS } from '@bxel/palette';
import { Field, Grid, SegmentedControl, Slider, Stack, TextInput, Toggle } from '@drizztdourden08/tessera';
import { BUILDER_TEXT, HUE_MODES, SPAN_SCALE } from '../RampBuilderDialog.constants';
import type { BuilderPartProps } from '../RampBuilderDialog.type';
import { BasePicker } from './BasePicker';

const BuilderControls = ({ state }: BuilderPartProps) => {
  const { settings, change } = state;
  return (
    <Stack gap="sm">
      <BasePicker state={state} />
      <Grid columns={2} gap="sm">
        <Slider size="sm" label={BUILDER_TEXT.dark} min={0} max={RAMP_LIMITS.maxSide} step={1} input showValue value={settings.dark} onChange={(dark) => change({ dark })} />
        <Slider size="sm" label={BUILDER_TEXT.light} min={0} max={RAMP_LIMITS.maxSide} step={1} input showValue value={settings.light} onChange={(light) => change({ light })} />
      </Grid>
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
      <Grid columns={2} gap="sm">
        <Slider size="sm" label={BUILDER_TEXT.spanDark} min={0} max={SPAN_SCALE} step={1} input showValue value={settings.span[0]} onChange={(dark) => change({ span: [Math.min(dark, settings.span[1]), settings.span[1]] })} />
        <Slider size="sm" label={BUILDER_TEXT.spanLight} min={0} max={SPAN_SCALE} step={1} input showValue value={settings.span[1]} onChange={(light) => change({ span: [settings.span[0], Math.max(light, settings.span[0])] })} />
      </Grid>
      <Toggle size="sm" label={BUILDER_TEXT.chroma} checked={settings.chromaCurve} onChange={(chromaCurve) => change({ chromaCurve })} />
      <Toggle size="sm" label={BUILDER_TEXT.snap} checked={settings.snap} onChange={(snap) => change({ snap })} />
      <Field label={BUILDER_TEXT.name} size="sm">
        <TextInput size="sm" aria-label={BUILDER_TEXT.name} value={settings.name} onChange={(event) => change({ name: event.target.value })} />
      </Field>
    </Stack>
  );
};

export { BuilderControls };
