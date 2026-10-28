/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const readHeap = (): number => {
  const { memory } = performance as Performance & { memory?: { usedJSHeapSize: number } };
  return (memory?.usedJSHeapSize ?? 0) / 1048576;
};

const heapMb = (session: Session): Promise<number> => session.page.evaluate(readHeap);

export { heapMb };
