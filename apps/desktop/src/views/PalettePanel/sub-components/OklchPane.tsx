/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { oklchStops } from '../behavior/oklch-stops';
import { tenths } from '../behavior/tenths';
import { useOklchDraft } from '../behavior/useOklchDraft';
import { OKLCH_CHANNELS } from '../PalettePanel.constants';
import type { ModelPaneProps } from '../PalettePanel.type';
import { ChannelSlider } from './ChannelSlider';

const OklchPane = ({ value, onChange }: ModelPaneProps) => {
  const [colour, change] = useOklchDraft(value, onChange);
  return (
    <Stack gap="xs">
      {OKLCH_CHANNELS.map((channel) => (
        <ChannelSlider
          key={channel.key}
          label={channel.label}
          value={tenths(colour[channel.key] * channel.scale)}
          min={0}
          max={channel.max * channel.scale}
          step={channel.step}
          stops={oklchStops(colour, channel.key, channel.max)}
          format={(next) => `${next}`}
          onChange={(next) => change(channel.key, next / channel.scale)}
        />
      ))}
    </Stack>
  );
};

export { OklchPane };
