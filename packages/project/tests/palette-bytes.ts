/* @layer tests @kind test */
import type { AssetSlice, BankId, SwatchId } from '@bxel/document';
import { encodePalette } from '@bxel/document/native';

const slice = (): AssetSlice => ({
  kind: 'palette',
  id: 'bnk_000001',
  name: 'Tiny',
  artwork: {
    banks: [
      {
        id: 'bnk_000001' as BankId,
        name: 'Tiny',
        cap: 2,
        transparent: false,
        slots: [
          { id: 'sw_000001' as SwatchId, kind: 'color', rgb: '#000000', name: 'Black' },
          { id: 'sw_000002' as SwatchId, kind: 'color', rgb: '#ffffff', name: 'White' },
        ],
        ramps: [],
      },
    ],
  },
  links: [],
});

const paletteBytes = (): Uint8Array => encodePalette(slice(), null, () => 0);

export { paletteBytes };
