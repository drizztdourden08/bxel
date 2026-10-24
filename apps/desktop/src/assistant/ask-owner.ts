/* @layer renderer-app @kind logic */
import type { HelloClient, ProgramMode } from '@bxel/mcp';
import { confirmChoice } from '@drizztdourden08/brock-react';
import { useAssistantStore } from '../stores/useAssistantStore';
import { ASSISTANT_TEXT } from './assistant.constants';

const askOwner = async (client: HelloClient): Promise<ProgramMode> => {
  useAssistantStore.getState().setPairing(1);
  try {
    const picked = await confirmChoice<'read' | 'edit'>({
      title: ASSISTANT_TEXT.pairTitle,
      message: ASSISTANT_TEXT.pairMessage(client.name ?? ASSISTANT_TEXT.unnamed),
      confirmLabel: ASSISTANT_TEXT.pairAllow,
      cancelLabel: ASSISTANT_TEXT.pairDeny,
      choices: [
        { value: 'read', label: ASSISTANT_TEXT.readOnly, description: ASSISTANT_TEXT.readOnlyHint },
        { value: 'edit', label: ASSISTANT_TEXT.editing, description: ASSISTANT_TEXT.editingHint },
      ],
      initial: 'read',
      look: 'radio',
    });
    return picked ?? 'blocked';
  } finally {
    useAssistantStore.getState().setPairing(-1);
  }
};

export { askOwner };
