/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const focusedRegion = (session: Session): Promise<string> =>
  session.page.evaluate(() => {
    const region = document.activeElement?.closest('[role="toolbar"], [role="application"], [role="region"], [role="tablist"]');
    const labelId = region?.getAttribute('aria-labelledby');
    return region?.getAttribute('aria-label') ?? (labelId ? (document.getElementById(labelId)?.textContent ?? '') : '');
  });

export { focusedRegion };
