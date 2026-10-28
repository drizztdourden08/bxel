/* @layer renderer-app @kind logic */
import type { EntryFacts } from './manager.type';

const entryId = (fact: EntryFacts): string => (fact.kind === 'sprite' ? fact.sprite.id : fact.key);

const entryName = (fact: EntryFacts): string => (fact.kind === 'sprite' ? fact.sprite.name : fact.name);

export { entryId, entryName };
