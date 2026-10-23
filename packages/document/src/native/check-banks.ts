/* @layer core @kind logic */
import type { PaletteBank } from '../model/palette.type';
import type { DocumentJson } from './document-json.type';
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';
import { missingReference } from './missing-reference';

const slotIssues = (bank: PaletteBank, base: string): readonly LoadIssue[] => {
  const transparent = bank.slots.flatMap((slot, index) => (slot.kind === 'transparent' ? [index] : []));
  const expected = bank.transparent ? [0] : [];
  if (transparent.length === expected.length && transparent.every((slot, index) => slot === expected[index])) return [];
  const message = bank.transparent
    ? 'A transparent bank has the transparent swatch in slot 0 and nowhere else.'
    : 'An opaque bank has no transparent swatch.';
  return [makeIssue(LOAD_ERROR.DOCUMENT_INVALID, message, `${base}.slots`)];
};

const rampIssues = (bank: PaletteBank, base: string): readonly LoadIssue[] => {
  const swatches = new Set<string>(bank.slots.map((slot) => slot.id));
  return bank.ramps.flatMap((ramp, index) =>
    ramp.swatches.flatMap((id, swatchIndex) =>
      missingReference(swatches, id, 'swatch', `${base}.ramps[${index}].swatches[${swatchIndex}]`),
    ),
  );
};

const checkBanks = (document: DocumentJson): readonly LoadIssue[] =>
  document.banks.flatMap((bank, index) => {
    const base = `$.banks[${index}]`;
    return [...slotIssues(bank, base), ...rampIssues(bank, base)];
  });

export { checkBanks };
