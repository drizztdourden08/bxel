/* @layer renderer-app @kind component */
import { Box, Flex, NumberInput, Slider, Stack, Text } from '@drizztdourden08/tessera';
import type { ChannelSliderProps } from '../PalettePanel.type';

const ChannelSlider = ({ label, value, min, max, step, stops, format, onChange }: ChannelSliderProps) => (
  <Stack gap="2xs" className="channel-slider">
    <Flex align="center" justify="between" gap="xs">
      <Text variant="label">{label}</Text>
      <NumberInput size="sm" sizeToContent aria-label={label} min={min} max={max} step={step} value={value} onChange={onChange} />
    </Flex>
    <Box className="channel-slider__lane">
      <Box className="channel-slider__track" aria-hidden style={{ backgroundImage: `linear-gradient(to right, ${stops.join(', ')})` }} />
      <Slider size="sm" aria-label={label} min={min} max={max} step={step} value={value} showValue={false} formatValue={format} onChange={onChange} className="channel-slider__slider" />
    </Box>
  </Stack>
);

export { ChannelSlider };
