/* @layer renderer-app @kind logic */
import type { Selection } from './project-browser.type';

const pickAll = (order: readonly string[]): Selection => ({ ids: order, anchor: order[0] ?? null });

export { pickAll };
