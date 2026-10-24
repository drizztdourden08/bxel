/* @layer renderer-app @kind logic */
import type { QuitDecision } from '@drizztdourden08/brock-core';
import type { QuitDeps } from './recovery.type';
import { saveAll } from './save-all';

const quietly = (run: () => Promise<void>): Promise<void> => run().catch(() => undefined);

const decideQuit = async (deps: QuitDeps): Promise<QuitDecision> => {
  const documents = deps.dirty();
  if (documents.length === 0) return 'quit';
  await quietly(deps.flush);
  const answer = await deps.ask(documents.map((each) => each.name).join(', '));
  if (answer === 'cancel') return 'stay';
  const ids = documents.map((each) => each.documentId);
  if (answer === 'save') return (await saveAll(deps, ids)) ? 'quit' : 'stay';
  await Promise.all(ids.map((documentId) => quietly(() => deps.discard(documentId))));
  return 'quit';
};

export { decideQuit };
