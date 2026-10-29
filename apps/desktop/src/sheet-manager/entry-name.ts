/* @layer renderer-app @kind logic */
import type { EntryFacts } from './manager.type';

const entryName = (fact: EntryFacts): string => (fact.kind === 'sprite' ? fact.sprite.name : fact.name);

export { entryName };
