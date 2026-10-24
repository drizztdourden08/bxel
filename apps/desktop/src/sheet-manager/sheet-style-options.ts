/* @layer renderer-app @kind logic */
import type { Sheet } from '@bxel/document';
import type { SheetStyle } from './manager.type';

const gridRequest = (sheet: Sheet, style: SheetStyle): object => {
  const keep = sheet.layout.kind === 'grid' ? sheet.layout : null;
  return {
    kind: 'grid',
    columns: style.columns ?? keep?.columns,
    cellWidth: keep?.cellWidth,
    cellHeight: keep?.cellHeight,
    order: keep?.order,
  };
};

const layoutRequest = (sheet: Sheet, style: SheetStyle): object => {
  const kind = style.layout ?? sheet.layout.kind;
  if (kind === 'grid') return gridRequest(sheet, style);
  if (kind === 'packed') {
    const keep = sheet.layout.kind === 'packed' ? sheet.layout.maxWidth : undefined;
    return { kind, maxWidth: style.maxWidth ?? keep };
  }
  return { kind: 'manual' };
};

const wantsLayout = (style: SheetStyle): boolean =>
  style.layout !== undefined || style.columns !== undefined || style.maxWidth !== undefined;

const sheetStyleOptions = (sheet: Sheet, style: SheetStyle): object => ({
  sheet: sheet.id,
  ...(wantsLayout(style) ? { layout: layoutRequest(sheet, style) } : {}),
  ...(style.spacing === undefined ? {} : { spacing: { x: style.spacing, y: style.spacing } }),
  ...(style.margin === undefined ? {} : { margin: style.margin }),
});

export { sheetStyleOptions };
