/* @layer renderer-app @kind component */
import { Box, Slider, Stack } from '@drizztdourden08/tessera';
import type { ChannelSliderProps } from '../PalettePanel.type';

const ChannelSlider = ({ label, value, min, max, step, stops, format, onChange }: ChannelSliderProps) => (
  <Stack gap="2xs" className="channel-slider">
    <Box className="channel-slider__track" aria-hidden style={{ backgroundImage: `linear-gradient(to right, ${stops.join(', ')})` }} />
    <Slider size="sm" label={label} value={value} min={min} max={max} step={step} input showValue formatValue={format} onChange={onChange} />
  </Stack>
);

export { ChannelSlider };
