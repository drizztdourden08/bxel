/* @layer renderer-app @kind logic */
import { extractPalette } from '@bxel/palette';
import type { PaletteBank } from '@bxel/document';
import { baseName } from '../files/base-name';
import { opaqueSlots } from '../palette-limit/opaque-slots';
import { bankPlan } from '../palette-source/bank-plan';
import { FALLBACK_BACKGROUND } from '../palette-source/palette-source.constants';
import type { BankDraft } from '../palette-source/palette-source.type';
import { alphaThreshold } from './alpha-threshold';
import { analysisImage } from './analysis-image';
import { FALLBACK_SLOT, NAME_ROOM } from './image-import.constants';
import type { ColorsForm, ReductionPlan, SourceImage } from './image-import.type';

const slotStrings = (draft: BankDraft): string[] => [
  ...(draft.transparent ? [FALLBACK_SLOT] : []),
  ...draft.colors.map((color) => color.rgb),
];

const fromBank = (bank: PaletteBank): ReductionPlan => ({
  palette: bank.slots.map((slot) => (slot.kind === 'color' ? slot.rgb : FALLBACK_SLOT)),
  transparent: bank.transparent,
  limit: bank.cap,
  bank: null,
  bankId: bank.id,
  dropped: 0,
});

const fromDraft = (draft: BankDraft, dropped: number): ReductionPlan => ({
  palette: slotStrings(draft),
  transparent: draft.transparent,
  limit: draft.cap,
  bank: draft,
  bankId: null,
  dropped,
});

const extracted = (form: ColorsForm, image: SourceImage): ReductionPlan => {
  const found = extractPalette(analysisImage(image), {
    maxColors: opaqueSlots(form.limit, form.transparent),
    alphaThreshold: alphaThreshold(form.alphaPercent),
  });
  const colors = found.map((rgb) => ({ rgb, name: rgb }));
  const draft = {
    name: `${baseName(image.fileName).slice(0, NAME_ROOM)} palette`,
    cap: form.limit,
    transparent: form.transparent,
    colors: colors.length === 0 && !form.transparent ? [FALLBACK_BACKGROUND] : colors,
  };
  return fromDraft(draft, 0);
};

const reductionPlan = (form: ColorsForm, image: SourceImage, bank: PaletteBank | null): ReductionPlan | null => {
  if (form.reduce === 'map') return bank ? fromBank(bank) : null;
  if (form.reduce === 'extract') return extracted(form, image);
  if (form.reduce !== 'palette' || (form.source.kind === 'file' && form.source.file === null)) return null;
  const planned = bankPlan(form.source, form.limit, form.transparent);
  return fromDraft(planned.bank, planned.dropped);
};

export { reductionPlan };
