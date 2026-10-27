/* @layer renderer-app @kind hook */
import { forgetAllPrograms, forgetProgram, setProgramGrant, TRUST_LEVELS } from '@bxel/mcp';
import type { Grant, SessionMode, TrustLevel } from '@bxel/mcp';
import { confirmAction, useSettings } from '@drizztdourden08/brock-react';
import { useCallback, useState } from 'react';
import { trustStoreOf } from '../../../assistant/trust-store-of';
import type { AppSettings } from '../../../settings.type';
import { useAssistantStore } from '../../../stores/useAssistantStore';
import { PANEL_TEXT } from '../AssistantPanel.constants';
import type { AssistantPanelModel } from '../AssistantPanel.type';
import type { PresetChoice } from './grant-rows.type';
import { presetGrant } from './preset-grant';
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
  const [permissionsKey, setPermissionsKey] = useState<string | null>(null);
  const setGrant = (key: string, grant: Grant) => patch({ assistantPrograms: setProgramGrant(store, key, grant).programs });
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
    permissionsKey: store.programs.some((program) => program.key === permissionsKey) ? permissionsKey : null,
    setProgramGrant: setGrant,
    setProgramPreset: (key: string, choice: PresetChoice) => {
      const grant = presetGrant(choice);
      if (grant !== null) setGrant(key, grant);
    },
    togglePermissions: (key: string) => setPermissionsKey((current) => (current === key ? null : key)),
    forget,
    forgetAll,
    disconnect: actions.disconnect,
    setSessionMode: (sessionId: string, mode: SessionMode) => actions.setSessionMode(sessionId, mode),
  };
};

export { useAssistantPanel };
