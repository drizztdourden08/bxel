/* @layer renderer-app @kind logic */
import { alphaToUnit } from '../../../palette-bank/alpha-to-unit';
import type { DraftFields, SwatchDraft } from '../PalettePanel.type';

const draftFields = (draft: SwatchDraft | null): DraftFields =>
  draft
    ? { index: draft.index, value: draft.value, original: draft.original, alpha: alphaToUnit(draft.alpha), name: draft.name }
    : { index: null, value: '', original: '', alpha: 1, name: '' };

export { draftFields };
