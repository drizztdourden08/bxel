/* @layer renderer-app @kind types */
import type { LaunchApproval, SessionView } from '@bxel/mcp';
import type { ActivityEntry, SettingsPort } from '../assistant/assistant.type';

interface AssistantState {
  sessions: readonly SessionView[];
  activity: readonly ActivityEntry[];
  launch: readonly LaunchApproval[];
  pairing: number;
  opened: Readonly<Record<string, true>>;
  port: SettingsPort | null;
  setSessions: (sessions: readonly SessionView[]) => void;
  record: (entry: ActivityEntry) => void;
  setLaunch: (launch: readonly LaunchApproval[]) => void;
  setPairing: (delta: number) => void;
  setPort: (port: SettingsPort | null) => void;
  markOpened: (documentId: string) => void;
}

export type { AssistantState };
