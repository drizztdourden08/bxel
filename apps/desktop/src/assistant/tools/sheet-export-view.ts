/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { atlasExportSettings } from '../../sheet-manager/atlas-export-settings';
import { atlasModel } from '../../sheet-manager/atlas-model';
import { useManagerStore } from '../../stores/useManagerStore';

const sheetExportView = (artwork: Artwork, sheet: Sheet) => {
  const { atlas } = useManagerStore.getState();
  const settings = atlasExportSettings(sheet, atlas);
  const model = atlasModel({ sheet, artwork, page: atlas.page, extrude: atlas.extrude, trim: atlas.trim, powerOfTwo: atlas.powerOfTwo, rotate: atlas.rotate, pageSide: atlas.pageSide });
  return {
    page: { index: model.page, count: model.pageCount, width: model.width, height: model.height, empty: model.empty, failure: model.failure },
    export: {
      layout: settings.layout ?? 'grid',
      columns: settings.columns ?? 0,
      maxWidth: settings.maxWidth ?? 0,
      padding: settings.padding ?? 0,
      margin: settings.margin ?? 0,
      extrusion: settings.extrusion ?? 0,
      trim: settings.trim ?? false,
      powerOfTwo: settings.powerOfTwo ?? false,
      rotate: settings.rotate ?? false,
      pageSide: settings.pageSide ?? 0,
      presets: artwork.presets.filter((preset) => preset.sheetId === sheet.id).map((preset) => ({ presetId: preset.id, name: preset.name, format: preset.format })),
    },
  };
};

export { sheetExportView };
