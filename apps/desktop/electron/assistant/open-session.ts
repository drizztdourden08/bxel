/* @layer electron-main @kind logic */
import { programKey } from '@bxel/mcp';
import type { Grant, HelloClient, HelloReply, SessionMode, SessionTrust } from '@bxel/mcp';
import { randomBytes } from 'crypto';
import { MAIN_TEXT } from './assistant.constants';
import type { AssistantMain, SessionLink } from './assistant.type';

const counter = { next: 1 };

const displayNameOf = (client: HelloClient): string => {
  const trimmed = client.name?.trim() ?? '';
  return trimmed === '' ? MAIN_TEXT.unnamed : trimmed;
};

const openSession = (state: AssistantMain, link: SessionLink, paired: { mode: SessionMode; grant: Grant; trust: SessionTrust }): HelloReply => {
  const { mode, grant, trust } = paired;
  const token = randomBytes(32).toString('hex');
  const sessionId = `s${counter.next}`;
  counter.next += 1;
  const now = Date.now();
  const displayName = displayNameOf(link.client);
  const key = programKey(link.client.name);
  if (key !== null && (trust === 'remembered' || trust === 'prompted')) state.synced.set(key, JSON.stringify(grant));
  state.sessions.add({ ...link, token, sessionId, displayName, mode, grant, granted: grant, programKey: key, trust, connectedAt: now, lastCallAt: now });
  state.ctx?.log(`assistant: ${displayName} connected as ${sessionId}, ${mode}, ${trust}`);
  return { ok: true, token, sessionId, mode, grant, trust };
};

export { openSession };
