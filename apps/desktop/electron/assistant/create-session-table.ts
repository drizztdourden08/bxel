/* @layer electron-main @kind logic */
import { canWriteDocuments, MIGRATED_EDIT_GRANT, PRESETS, sessionModeOf } from '@bxel/mcp';
import type { Grant, SessionMode } from '@bxel/mcp';
import type { LiveSession, SessionTable } from './assistant.type';

const viewOf = ({ sessionId, mode, grant, trust, client, displayName, connectedAt, lastCallAt }: LiveSession) => ({
  sessionId,
  mode,
  grant,
  trust,
  client,
  displayName,
  connectedAt,
  lastCallAt,
});

const grantOfSessionMode = (session: LiveSession, mode: SessionMode): Grant => {
  if (mode === 'read') return PRESETS.read_only.grant;
  return canWriteDocuments(session.granted) ? session.granted : MIGRATED_EDIT_GRANT;
};

const createSessionTable = (onChange: () => void, onGrant: (session: LiveSession) => void): SessionTable => {
  const live = new Map<string, LiveSession>();
  const revoked = new Set<string>();
  const end = (token: string): LiveSession | undefined => {
    const session = live.get(token);
    if (session && live.delete(token)) onChange();
    return session;
  };
  const find = (sessionId: string) => [...live.values()].find((session) => session.sessionId === sessionId);
  const setGrant: SessionTable['setGrant'] = (sessionId, grant, stored) => {
    const session = find(sessionId);
    if (!session) return false;
    const next = { ...session, grant, mode: sessionModeOf(grant), granted: stored ? grant : session.granted };
    live.set(session.token, next);
    onChange();
    onGrant(next);
    return true;
  };
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
      return session ? setGrant(sessionId, grantOfSessionMode(session, mode), false) : false;
    },
    setGrant,
    list: () => [...live.values()],
    views: () => [...live.values()].map(viewOf),
    size: () => live.size,
  };
};

export { createSessionTable };
