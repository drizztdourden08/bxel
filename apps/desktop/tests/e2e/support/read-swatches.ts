/* @layer renderer-app @kind logic */
import { SWATCH_PATTERN } from './e2e.constants';
import type { Session, Swatches } from './e2e.type';

const readSwatches = async (session: Session): Promise<Swatches> => {
  const buttons = session.page.getByRole('button', { name: /^Swatch \d+/ });
  const names = await buttons.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-label') ?? ''));
  const swatches: (string | null)[] = [];
  for (const name of names) {
    const match = SWATCH_PATTERN.exec(name);
    swatches[Number(match?.[1] ?? swatches.length)] = match?.[2]?.toLowerCase() ?? null;
  }
  return swatches;
};

export { readSwatches };
