/* @layer renderer-app @kind component */
import { Box, ColorSwatch } from '@drizztdourden08/tessera';
import { PREVIEW_TEXT } from '../../../asset-preview/asset-preview.constants';
import type { SwatchGridProps } from '../AssetPreview.type';

const SwatchGrid = ({ colours, name }: SwatchGridProps) => (
  <Box className="asset-preview__swatches" role="group" aria-label={`${name}, ${PREVIEW_TEXT.swatches(colours.length)}`}>
    {colours.map((colour, at) => (
      <ColorSwatch
        key={colour.id}
        size="md"
        color={colour.transparent ? 'transparent' : colour.rgb}
        transparent={colour.transparent}
        disabled
        tabIndex={-1}
        aria-label={colour.transparent ? PREVIEW_TEXT.transparentSlot(at) : PREVIEW_TEXT.slot(at, colour.name, colour.rgb)}
      />
    ))}
  </Box>
);

export { SwatchGrid };
