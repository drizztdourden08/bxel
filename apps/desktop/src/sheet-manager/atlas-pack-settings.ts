/* @layer renderer-app @kind logic */
import type { PackItem, PackSettings } from '@bxel/formats';
import type { Sheet } from '@bxel/document';

const atlasPackSettings = (sheet: Sheet, items: readonly PackItem[], extrude: number, powerOfTwo: boolean): PackSettings | null => {
  const { layout, spacing, margin } = sheet;
  if (layout.kind === 'manual') return null;
  const widest = Math.max(1, ...items.map((item) => item.width));
  const tallest = Math.max(1, ...items.map((item) => item.height));
  if (layout.kind === 'grid') {
    return {
      layout: {
        kind: 'grid',
        columns: layout.columns,
        cellWidth: Math.max(layout.cellWidth, widest + 2 * extrude),
        cellHeight: Math.max(layout.cellHeight, tallest + 2 * extrude),
        spacingX: spacing.x,
        spacingY: spacing.y,
        order: layout.order,
      },
      margin,
      extrude,
      powerOfTwo,
    };
  }
  return {
    layout: { kind: 'packed', maxWidth: Math.max(layout.maxWidth, widest + 2 * (extrude + margin)), padding: spacing.x },
    margin,
    extrude,
    powerOfTwo,
  };
};

export { atlasPackSettings };
