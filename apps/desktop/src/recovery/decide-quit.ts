/* @layer renderer-app @kind logic */
import type { QuitDecision } from '@drizztdourden08/brock-core';
import { askEach } from './ask-each';
import type { QuitDeps } from './recovery.type';
import { saveAll } from './save-all';

const quietly = (run: () => Promise<void>): Promise<void> => run().catch(() => undefined);

const decideQuit = async (deps: QuitDeps): Promise<QuitDecision> => {
  const documents = deps.dirty();
  if (documents.length === 0) return 'quit';
  await quietly(deps.flush);
  const choices = await askEach(deps, documents);
  if (choices === null) return 'stay';
  if (!(await saveAll(deps, choices.save))) return 'stay';
  await Promise.all(choices.discard.map((documentId) => quietly(() => deps.discard(documentId))));
  return 'quit';
};

export { decideQuit };
