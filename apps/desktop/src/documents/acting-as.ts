/* @layer renderer-app @kind logic */
import { acting } from './acting-as.constants';
import type { ActingAs } from './acting-as.type';

const actAs = async <T>(who: ActingAs, run: () => T | Promise<T>): Promise<T> => {
  const before = acting.current;
  acting.current = who;
  try {
    return await run();
  } finally {
    acting.current = before;
  }
};

export { actAs };
