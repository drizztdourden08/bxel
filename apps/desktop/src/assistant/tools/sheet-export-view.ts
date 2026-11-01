/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { atlasExportSettings } from '../../sheet-manager/atlas-export-settings';
import { atlasModel } from '../../sheet-manager/atlas-model';
import { useManagerStore } from '../../stores/useManagerStore';
import { definedOnly } from './defined-only';
import { SHEET_EXPORT_DEFAULTS } from './sheet-export-view.constants';

const sheetExportView = (artwork: Artwork, sheet: Sheet) => {
  const { atlas } = useManagerStore.getState();
  const settings = atlasExportSettings(sheet, atlas);
  const model = atlasModel({ sheet, artwork, page: atlas.page, extrude: atlas.extrude, trim: atlas.trim, powerOfTwo: atlas.powerOfTwo, rotate: atlas.rotate, pageSide: atlas.pageSide });
  return {
    page: { index: model.page, count: model.pageCount, width: model.width, height: model.height, empty: model.empty, failure: model.failure },
    export: {
      ...SHEET_EXPORT_DEFAULTS,
      ...definedOnly({
        layout: settings.layout,
        columns: settings.columns,
        maxWidth: settings.maxWidth,
        padding: settings.padding,
        margin: settings.margin,
        extrusion: settings.extrusion,
        trim: settings.trim,
        powerOfTwo: settings.powerOfTwo,
        rotate: settings.rotate,
        pageSide: settings.pageSide,
      }),
      presets: artwork.presets.filter((preset) => preset.sheetId === sheet.id).map((preset) => ({ presetId: preset.id, name: preset.name, format: preset.format })),
    },
  };
};

export { sheetExportView };
