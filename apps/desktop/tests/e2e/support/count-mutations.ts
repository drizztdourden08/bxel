/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const watchFor = (span: number): Promise<number> =>
  new Promise<number>((resolve) => {
    let count = 0;
    const watch = new MutationObserver((list) => {
      count += list.length;
    });
    watch.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
    setTimeout(() => {
      watch.disconnect();
      resolve(count);
    }, span);
  });

const countMutations = (session: Session, ms: number): Promise<number> => session.page.evaluate(watchFor, ms);

export { countMutations };
