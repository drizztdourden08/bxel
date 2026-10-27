/* @layer renderer-app @kind types */
import type { Grant, SessionMode, SessionView, TrustEntry, TrustLevel } from '@bxel/mcp';
import type { ActivityEntry } from '../../assistant/assistant.type';
import type { PresetChoice } from './behavior/grant-rows.type';

type AssistantPanelModel = {
  readonly level: TrustLevel;
  readonly allowAllMode: SessionMode;
  readonly programs: readonly TrustEntry[];
  readonly sessions: readonly SessionView[];
  readonly activity: readonly ActivityEntry[];
  readonly config: string | null;
  readonly permissionsKey: string | null;
  readonly setLevel: (level: string) => void;
  readonly setAllowAllMode: (mode: string) => void;
  readonly setProgramGrant: (key: string, grant: Grant) => void;
  readonly setProgramPreset: (key: string, choice: PresetChoice) => void;
  readonly togglePermissions: (key: string) => void;
  readonly forget: (key: string) => void;
  readonly forgetAll: () => void;
  readonly disconnect: (sessionId: string) => void;
  readonly setSessionMode: (sessionId: string, mode: SessionMode) => void;
};

type PanelPartProps = { readonly model: AssistantPanelModel };

export type { AssistantPanelModel, PanelPartProps };
