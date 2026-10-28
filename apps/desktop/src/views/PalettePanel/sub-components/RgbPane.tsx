/* @layer renderer-app @kind component */
import { formatHex, parseHex } from '@bxel/palette';
import { Stack } from '@drizztdourden08/tessera';
import { rgbStops } from '../behavior/rgb-stops';
import { CHANNEL_TOP, RGB_CHANNELS } from '../PalettePanel.constants';
import type { ModelPaneProps } from '../PalettePanel.type';
import { ChannelSlider } from './ChannelSlider';

const RgbPane = ({ value, onChange }: ModelPaneProps) => {
  const packed = parseHex(value.slice(0, 7)) ?? 0;
  const rgb = [(packed >> 16) & CHANNEL_TOP, (packed >> 8) & CHANNEL_TOP, packed & CHANNEL_TOP];
  const change = (channel: number, next: number) => {
    const [r = 0, g = 0, b = 0] = rgb.map((each, at) => (at === channel ? Math.round(next) : each));
    onChange(formatHex((r << 16) | (g << 8) | b));
  };
  return (
    <Stack gap="xs">
      {RGB_CHANNELS.map((label, channel) => (
        <ChannelSlider
          key={label}
          label={label}
          value={rgb[channel] ?? 0}
          min={0}
          max={CHANNEL_TOP}
          step={1}
          stops={rgbStops(rgb, channel)}
          format={(next) => `${Math.round(next)}`}
          onChange={(next) => change(channel, next)}
        />
      ))}
    </Stack>
  );
};

export { RgbPane };
