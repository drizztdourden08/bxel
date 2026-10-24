/* @layer electron-main @kind logic */
import type { HelloClient, HelloReply, SessionMode, SessionTrust } from '@bxel/mcp';
import { randomBytes } from 'crypto';
import { MAIN_TEXT } from './assistant.constants';
import type { AssistantMain, SessionLink } from './assistant.type';

const counter = { next: 1 };

const displayNameOf = (client: HelloClient): string => {
  const trimmed = client.name?.trim() ?? '';
  return trimmed === '' ? MAIN_TEXT.unnamed : trimmed;
};

const openSession = (state: AssistantMain, link: SessionLink, mode: SessionMode, trust: SessionTrust): HelloReply => {
  const token = randomBytes(32).toString('hex');
  const sessionId = `s${counter.next}`;
  counter.next += 1;
  const now = Date.now();
  const displayName = displayNameOf(link.client);
  state.sessions.add({ ...link, token, sessionId, displayName, mode, trust, connectedAt: now, lastCallAt: now });
  state.ctx?.log(`assistant: ${displayName} connected as ${sessionId}, ${mode}, ${trust}`);
  return { ok: true, token, sessionId, mode, trust };
};

export { openSession };
