/* @layer core @kind logic */
import { BACKGROUND_LABEL, formatSwatchColor, swatchAlpha, swatchFields } from '@bxel/document';
import type { IdSource, Swatch, SwatchColorValue, SwatchId } from '@bxel/document';

const recolorSwatch = (ids: IdSource, existing: Swatch | undefined, color: SwatchColorValue, background: boolean): Swatch => {
  const text = formatSwatchColor(color.rgb, color.alpha);
  const name = background ? BACKGROUND_LABEL : text;
  const fields = swatchFields(color.rgb, color.alpha);
  if (existing?.kind !== 'color') return { id: ids.next('sw') as SwatchId, kind: 'color', ...fields, name };
  return existing.rgb === color.rgb && swatchAlpha(existing) === color.alpha ? existing : { id: existing.id, kind: 'color', ...fields, name };
};

export { recolorSwatch };
