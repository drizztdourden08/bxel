/* @layer renderer-app @kind component */
import { ColorSwatch, Flex } from '@drizztdourden08/tessera';
import { OVERVIEW_TEXT } from '../../../asset-overview/asset-overview.constants';
import type { PreviewColour } from '../../../asset-overview/asset-overview.type';

const SwatchPreview = ({ colours, name }: { readonly colours: readonly PreviewColour[]; readonly name: string }) => (
  <Flex gap="xs" wrap role="group" aria-label={OVERVIEW_TEXT.previewLabel(name)}>
    {colours.map((colour) => (
      <ColorSwatch
        key={colour.id}
        size="md"
        color={colour.transparent ? 'transparent' : colour.rgb}
        transparent={colour.transparent}
        disabled
        tabIndex={-1}
        aria-label={colour.transparent ? OVERVIEW_TEXT.transparentSwatch : OVERVIEW_TEXT.swatchLabel(colour.name, colour.rgb)}
      />
    ))}
  </Flex>
);

export { SwatchPreview };
