/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { ExportPreset } from '../../model/export-preset.type';
import type { PresetId } from '../../model/ids.type';
import type { EntityRef } from '../../schema/entity-ref.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { resolveRefId } from '../tilemap/resolve-ref-id';

const pickPreset = (draft: Draft, ref: EntityRef<PresetId>): ExportPreset => {
  const id = resolveRefId(draft, ref, 'options.preset');
  const found = draft.artwork.presets.find((preset) => preset.id === id);
  if (!found) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Preset ${id} does not exist.`, { path: 'options.preset' });
  return found;
};

export { pickPreset };
