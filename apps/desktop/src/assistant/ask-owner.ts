/* @layer renderer-app @kind logic */
import type { HelloClient, PairChoice } from '@bxel/mcp';
import { channelApi, confirmChoice } from '@drizztdourden08/brock-react';
import { APP_CHANNELS } from '../ipc/contract.constants';
import { useAssistantStore } from '../stores/useAssistantStore';
import { ASSISTANT_TEXT } from './assistant.constants';

const askOwner = async (client: HelloClient, headless: boolean): Promise<PairChoice> => {
  useAssistantStore.getState().setPairing(1);
  try {
    if (headless) return await channelApi(APP_CHANNELS).assistantNativePair(client.name);
    const picked = await confirmChoice<'read' | 'edit' | 'full'>({
      title: ASSISTANT_TEXT.pairTitle,
      message: ASSISTANT_TEXT.pairMessage(client.name ?? ASSISTANT_TEXT.unnamed),
      confirmLabel: ASSISTANT_TEXT.pairAllow,
      cancelLabel: ASSISTANT_TEXT.pairDeny,
      choices: [
        { value: 'read', label: ASSISTANT_TEXT.readOnly, description: ASSISTANT_TEXT.readOnlyHint },
        { value: 'edit', label: ASSISTANT_TEXT.editing, description: ASSISTANT_TEXT.editingHint },
        { value: 'full', label: ASSISTANT_TEXT.fullControl, description: ASSISTANT_TEXT.fullControlHint },
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
