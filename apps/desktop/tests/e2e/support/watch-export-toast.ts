/* @layer renderer-app @kind logic */
import type { Page } from 'playwright-core';
import { EXPORT_DONE_MS } from './e2e.constants';

const WATCH_PATTERN = 'Exported \\d+ files? to [^\\n]*|Export failed[^\\n]*';

const watchExportToast = async (page: Page, folderName: string): Promise<() => Promise<string>> => {
  const handle = await page.evaluateHandle(
    ({ source, folder, limit }) =>
      new Promise<string>((resolve) => {
        const pattern = new RegExp(source, 'g');
        const timer = setTimeout(() => resolve(`Timed out after ${limit} ms without an export toast`), limit);
        const observer = new MutationObserver((mutations) => {
          const nodes = mutations.flatMap((mutation) => [mutation.target, ...Array.from(mutation.addedNodes)]);
          const hits = nodes.flatMap((node) => Array.from((node.textContent ?? '').matchAll(pattern), (match) => match[0]));
          const hit = hits.find((text) => !text.startsWith('Exported') || text.includes(folder));
          if (hit === undefined) return;
          clearTimeout(timer);
          observer.disconnect();
          resolve(hit);
        });
        observer.observe(document.body, { childList: true, characterData: true, subtree: true });
      }),
    { source: WATCH_PATTERN, folder: folderName, limit: EXPORT_DONE_MS },
  );
  return async () => {
    const message = await handle.jsonValue();
    await handle.dispose();
    if (!message.startsWith('Exported')) throw new Error(message);
    return message;
  };
};

export { watchExportToast };
