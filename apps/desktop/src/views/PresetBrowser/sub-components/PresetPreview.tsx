/* @layer renderer-app @kind component */
import { Flex, Stack, Text } from '@drizztdourden08/tessera';
import { PREVIEW_TEXT } from '../../../platform-preset/preset-facts.constants';
import { presetPalette } from '../../../platform-preset/preset-palette';
import { previewSizes } from '../../../platform-preset/preview-sizes';
import { samplePalette } from '../../../platform-preset/sample-palette';
import type { PresetPaneProps } from '../PresetBrowser.type';
import { PaletteStrip } from './PaletteStrip';
import { SizeSample } from './SizeSample';

const PresetPreview = ({ preset }: PresetPaneProps) => {
  const palette = presetPalette(preset);
  const colours = samplePalette(palette);
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text variant="label">{PREVIEW_TEXT.paletteTitle}</Text>
        {palette.length > 0 ? <PaletteStrip colours={palette} /> : <Text variant="caption" tone="muted">{PREVIEW_TEXT.freePalette}</Text>}
      </Stack>
      <Stack gap="xs">
        <Text variant="label">{PREVIEW_TEXT.samplesTitle}</Text>
        <Flex gap="md" wrap align="end">
          {previewSizes(preset).map((size) => (
            <SizeSample key={size.join('x')} sample={{ size, tile: preset.sizes.tile, colours }} />
          ))}
        </Flex>
      </Stack>
    </Stack>
  );
};

export { PresetPreview };
