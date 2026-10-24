/* @layer renderer-app @kind hook */
import type { SessionView } from '@bxel/mcp';
import type { MenuEntry, TitleBarItemSpec } from '@drizztdourden08/brock-react';
import { channelApi } from '@drizztdourden08/brock-react';
import { CHIP_TEXT } from '../assistant/assistant.constants';
import { APP_CHANNELS } from '../ipc/contract.constants';
import { useAssistantStore } from '../stores/useAssistantStore';

const chipLabel = (sessions: readonly SessionView[], editing: boolean): string => {
  const [only] = sessions;
  if (sessions.length > 1 || !only) return CHIP_TEXT.many(sessions.length);
  return CHIP_TEXT.one(only.displayName, editing);
};

const sessionItems = (session: SessionView): MenuEntry[] => [
  {
    key: `mode-${session.sessionId}`,
    label: session.mode === 'edit' ? CHIP_TEXT.makeReadOnly(session.displayName) : CHIP_TEXT.allowEditing(session.displayName),
    onClick: () => void channelApi(APP_CHANNELS).assistantSetMode(session.sessionId, session.mode === 'edit' ? 'read' : 'edit'),
  },
  {
    key: `off-${session.sessionId}`,
    label: CHIP_TEXT.disconnect(session.displayName),
    onClick: () => void channelApi(APP_CHANNELS).assistantDisconnect(session.sessionId),
  },
];

const useAssistantItem = (): TitleBarItemSpec | null => {
  const sessions = useAssistantStore((state) => state.sessions);
  const pairing = useAssistantStore((state) => state.pairing);
  if (sessions.length === 0 && pairing === 0) return null;
  const editing = sessions.some((session) => session.mode === 'edit');
  const label = sessions.length === 0 ? CHIP_TEXT.waiting : chipLabel(sessions, editing);
  return {
    kind: 'menu',
    label,
    icon: 'plug-zap',
    tone: editing ? 'warning' : 'info',
    items: [...sessions.flatMap(sessionItems), 'separator', { key: 'settings', label: CHIP_TEXT.settings, bucket: 'app', page: 'assistant-programs' }],
  };
};

export { useAssistantItem };
