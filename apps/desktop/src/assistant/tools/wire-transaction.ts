/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { ChangeSet, PreviewData, TransactionResult } from '@bxel/document';
import { encodeBase64, engineFailure } from '@bxel/mcp';
import type { ToolOutcome } from '@bxel/mcp';

const wireChanges = (changes: ChangeSet) => ({
  artwork: changes.artwork,
  banks: changes.banks,
  sprites: changes.sprites,
  sheets: changes.sheets,
  presets: changes.presets,
  tilesets: changes.tilesets,
  tilemaps: changes.tilemaps,
  animations: changes.animations,
});

const wirePreview = (preview: PreviewData | null) =>
  preview === null
    ? null
    : {
        cels: preview.cels.map((cel) => ({ celId: cel.celId, layerId: cel.layerId, frameId: cel.frameId, rect: cel.rect, pixels: encodeBase64(cel.pixels) })),
        colorUse: preview.colorUse,
        truncated: preview.truncated,
      };

const wireTransaction = (result: TransactionResult): ToolOutcome => {
  if (!result.ok) {
    const stale = result.error.code === ERROR_CODE.STALE_REVISION && result.revision > 0;
    return engineFailure(result.error, stale ? { currentRevision: result.revision } : {});
  }
  return {
    ok: true,
    mode: result.mode,
    baseRevision: result.baseRevision,
    revision: result.revision,
    noop: result.noop,
    changes: wireChanges(result.changes),
    created: result.created,
    report: result.report,
    warnings: result.warnings,
    preview: wirePreview(result.preview),
  };
};

export { wireTransaction };
