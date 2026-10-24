/* @layer renderer-app @kind hook */
import { forgetAllPrograms, forgetProgram, setProgramMode, TRUST_LEVELS } from '@bxel/mcp';
import type { SessionMode, TrustLevel } from '@bxel/mcp';
import { confirmAction, useSettings } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { trustStoreOf } from '../../../assistant/trust-store-of';
import type { AppSettings } from '../../../settings.type';
import { useAssistantStore } from '../../../stores/useAssistantStore';
import { PANEL_TEXT } from '../AssistantPanel.constants';
import type { AssistantPanelModel } from '../AssistantPanel.type';
import { useClientConfig } from './useClientConfig';
import { useSessionActions } from './useSessionActions';

const isLevel = (value: string): value is TrustLevel => (TRUST_LEVELS as readonly string[]).includes(value);

const askAllowAll = (): Promise<boolean> =>
  confirmAction({ title: PANEL_TEXT.confirmTitle, message: PANEL_TEXT.warning, confirmLabel: PANEL_TEXT.confirmLabel, variant: 'danger' });

const useAssistantPanel = (): AssistantPanelModel => {
  const { settings, patch } = useSettings<AppSettings>();
  const sessions = useAssistantStore((state) => state.sessions);
  const activity = useAssistantStore((state) => state.activity);
  const config = useClientConfig();
  const actions = useSessionActions();
  const store = trustStoreOf(settings);
  const setLevel = useCallback(
    (value: string) => {
      if (!isLevel(value)) return;
      if (value !== 'allow_all') return patch({ assistantLevel: value });
      void askAllowAll().then((sure) => sure && patch({ assistantLevel: value }));
      return undefined;
    },
    [patch],
  );
  const setAllowAllMode = (value: string) => patch({ assistantAllowAllMode: value === 'edit' ? 'edit' : 'read' });
  const forget = (key: string) => {
    patch({ assistantPrograms: forgetProgram(store, key).programs });
    actions.endProgram(key);
  };
  const forgetAll = () => {
    patch({ assistantPrograms: forgetAllPrograms(store).programs });
    actions.endProgram(null);
  };
  return {
    level: store.level,
    allowAllMode: store.allowAllMode,
    programs: store.programs,
    sessions,
    activity,
    config,
    setLevel,
    setAllowAllMode,
    setProgramMode: (key, mode) => patch({ assistantPrograms: setProgramMode(store, key, mode).programs }),
    forget,
    forgetAll,
    disconnect: actions.disconnect,
    setSessionMode: (sessionId: string, mode: SessionMode) => actions.setSessionMode(sessionId, mode),
  };
};

export { useAssistantPanel };
