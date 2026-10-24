/* @layer renderer-app @kind types */
import type { ProgramMode, SessionMode, SessionView, TrustEntry, TrustLevel } from '@bxel/mcp';
import type { ActivityEntry } from '../../assistant/assistant.type';

type AssistantPanelModel = {
  readonly level: TrustLevel;
  readonly allowAllMode: SessionMode;
  readonly programs: readonly TrustEntry[];
  readonly sessions: readonly SessionView[];
  readonly activity: readonly ActivityEntry[];
  readonly config: string | null;
  readonly setLevel: (level: string) => void;
  readonly setAllowAllMode: (mode: string) => void;
  readonly setProgramMode: (key: string, mode: ProgramMode) => void;
  readonly forget: (key: string) => void;
  readonly forgetAll: () => void;
  readonly disconnect: (sessionId: string) => void;
  readonly setSessionMode: (sessionId: string, mode: SessionMode) => void;
};

type PanelPartProps = { readonly model: AssistantPanelModel };

export type { AssistantPanelModel, PanelPartProps };
