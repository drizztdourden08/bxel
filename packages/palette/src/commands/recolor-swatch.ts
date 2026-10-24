/* @layer core @kind logic */
import { BACKGROUND_LABEL } from '@bxel/document';
import type { IdSource, Rgb, Swatch, SwatchId } from '@bxel/document';

const recolorSwatch = (ids: IdSource, existing: Swatch | undefined, rgb: Rgb, background: boolean): Swatch => {
  const name = background ? BACKGROUND_LABEL : rgb;
  if (existing?.kind !== 'color') return { id: ids.next('sw') as SwatchId, kind: 'color', rgb, name };
  return existing.rgb === rgb ? existing : { ...existing, rgb, name };
};

export { recolorSwatch };
