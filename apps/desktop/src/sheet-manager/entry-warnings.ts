/* @layer renderer-app @kind logic */
import type { SpriteFacts } from './manager.type';
import { ENTRY_WARNING_TEXT } from './entry-warnings.constants';

const mainBank = (facts: readonly SpriteFacts[]): { id: string; name: string } | null => {
  const counts = new Map<string, { name: string; count: number }>();
  for (const fact of facts) {
    const seen = counts.get(fact.sprite.bankId);
    counts.set(fact.sprite.bankId, { name: fact.bank, count: (seen?.count ?? 0) + 1 });
  }
  let best: { id: string; name: string; count: number } | null = null;
  for (const [id, seen] of counts) if (best === null || seen.count > best.count) best = { id, ...seen };
  return best;
};

const entryWarnings = (facts: readonly SpriteFacts[], pageSide: number): ReadonlyMap<string, string> => {
  const onSheet = facts.filter((fact) => fact.onSheet);
  const main = mainBank(onSheet);
  const warnings = new Map<string, string>();
  for (const fact of onSheet) {
    const { width, height, id, bankId } = fact.sprite;
    const reasons = [
      ...(main !== null && bankId !== main.id ? [ENTRY_WARNING_TEXT.palette(fact.bank, main.name)] : []),
      ...(pageSide > 0 && (width > pageSide || height > pageSide) ? [ENTRY_WARNING_TEXT.page(width, height, pageSide)] : []),
    ];
    if (reasons.length > 0) warnings.set(id, reasons.join('. '));
  }
  return warnings;
};

export { entryWarnings };
