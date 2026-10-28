/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { oklchStops } from '../behavior/oklch-stops';
import { useOklchDraft } from '../behavior/useOklchDraft';
import { EDITOR_TEXT, OKLCH_RANGE, PERCENT } from '../PalettePanel.constants';
import type { ModelPaneProps } from '../PalettePanel.type';
import { ChannelSlider } from './ChannelSlider';

const OklchPane = ({ value, onChange }: ModelPaneProps) => {
  const [colour, change] = useOklchDraft(value, onChange);
  return (
    <Stack gap="xs">
      <ChannelSlider
        label={EDITOR_TEXT.lightness}
        value={colour.l}
        min={0}
        max={OKLCH_RANGE.l}
        step={0.005}
        stops={oklchStops(colour, 'l', OKLCH_RANGE.l)}
        format={(next) => `${Math.round(next * PERCENT)}%`}
        onChange={(next) => change('l', next)}
      />
      <ChannelSlider
        label={EDITOR_TEXT.chroma}
        value={colour.c}
        min={0}
        max={OKLCH_RANGE.c}
        step={0.002}
        stops={oklchStops(colour, 'c', OKLCH_RANGE.c)}
        format={(next) => next.toFixed(3)}
        onChange={(next) => change('c', next)}
      />
      <ChannelSlider
        label={EDITOR_TEXT.hue}
        value={colour.h}
        min={0}
        max={OKLCH_RANGE.h}
        step={1}
        stops={oklchStops(colour, 'h', OKLCH_RANGE.h)}
        format={(next) => `${Math.round(next)}`}
        onChange={(next) => change('h', next)}
      />
    </Stack>
  );
};

export { OklchPane };
