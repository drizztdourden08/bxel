/* @layer renderer-app @kind logic */
import type { EntryFacts } from './manager.type';

const entryId = (fact: EntryFacts): string => (fact.kind === 'sprite' ? fact.sprite.id : fact.key);

export { entryId };
