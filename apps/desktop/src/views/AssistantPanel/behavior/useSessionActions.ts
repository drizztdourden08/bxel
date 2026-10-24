/* @layer renderer-app @kind hook */
import { programKey } from '@bxel/mcp';
import type { SessionMode } from '@bxel/mcp';
import { channelApi } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { APP_CHANNELS } from '../../../ipc/contract.constants';
import { useAssistantStore } from '../../../stores/useAssistantStore';

const useSessionActions = () => {
  const disconnect = useCallback((sessionId: string) => {
    void channelApi(APP_CHANNELS).assistantDisconnect(sessionId);
  }, []);
  const setSessionMode = useCallback((sessionId: string, mode: SessionMode) => {
    void channelApi(APP_CHANNELS).assistantSetMode(sessionId, mode);
  }, []);
  const endProgram = useCallback(
    (key: string | null) => {
      for (const session of useAssistantStore.getState().sessions) {
        if (key === null || programKey(session.client.name) === key) disconnect(session.sessionId);
      }
    },
    [disconnect],
  );
  return { disconnect, setSessionMode, endProgram };
};

export { useSessionActions };
