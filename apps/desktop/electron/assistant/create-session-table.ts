/* @layer electron-main @kind logic */
import type { LiveSession, SessionTable } from './assistant.type';

const viewOf = ({ sessionId, mode, trust, client, displayName, connectedAt, lastCallAt }: LiveSession) => ({
  sessionId,
  mode,
  trust,
  client,
  displayName,
  connectedAt,
  lastCallAt,
});

const createSessionTable = (onChange: () => void): SessionTable => {
  const live = new Map<string, LiveSession>();
  const revoked = new Set<string>();
  const end = (token: string): LiveSession | undefined => {
    const session = live.get(token);
    if (session && live.delete(token)) onChange();
    return session;
  };
  const find = (sessionId: string) => [...live.values()].find((session) => session.sessionId === sessionId);
  return {
    add: (session) => {
      live.set(session.token, session);
      onChange();
    },
    byToken: (token) => live.get(token),
    isRevoked: (token) => revoked.has(token),
    end,
    endConnection: (connectionId) =>
      [...live.values()].filter((session) => session.connectionId === connectionId).flatMap((session) => end(session.token) ?? []),
    revoke: (sessionId) => {
      const session = find(sessionId);
      if (!session) return false;
      revoked.add(session.token);
      end(session.token);
      return true;
    },
    revokeAll: () => {
      for (const token of live.keys()) revoked.add(token);
      live.clear();
      onChange();
    },
    setMode: (sessionId, mode) => {
      const session = find(sessionId);
      if (!session) return false;
      live.set(session.token, { ...session, mode });
      onChange();
      return true;
    },
    views: () => [...live.values()].map(viewOf),
    size: () => live.size,
  };
};

export { createSessionTable };
