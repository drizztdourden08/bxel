/* @layer renderer-app @kind constants */
import type { FlushReport, PairOutcome, PairRequest, ProgramMode, SessionMode, SessionView, ToolCall, ToolReply } from '@bxel/mcp';
import { ask, defineChannels, event, invoke } from '@drizztdourden08/brock-core';
import type { AssistantSetup, ClientConfig } from '../assistant/assistant.type';

const APP_CHANNELS = defineChannels({
  assistantSessions: invoke<() => Promise<SessionView[]>>()('assistant:sessions'),
  assistantDisconnect: invoke<(sessionId: string) => Promise<boolean>>()('assistant:disconnect'),
  assistantSetMode: invoke<(sessionId: string, mode: SessionMode) => Promise<boolean>>()('assistant:set-mode'),
  assistantClientConfig: invoke<() => Promise<ClientConfig>>()('assistant:client-config'),
  assistantSetup: invoke<(setup: AssistantSetup) => Promise<void>>()('assistant:setup'),
  assistantNativePair: invoke<(program: string | null) => Promise<ProgramMode>>()('assistant:native-pair'),
  assistantSessionsChanged: event<(sessions: SessionView[]) => void>()('assistant:sessions-changed'),
  assistantPair: ask<(request: PairRequest) => Promise<PairOutcome>>()('assistant:pair'),
  assistantTool: ask<(call: ToolCall) => Promise<ToolReply>>()('assistant:tool'),
  assistantFlush: ask<(mode: 'recover' | 'discard' | 'check') => Promise<FlushReport>>()('assistant:flush'),
});

const APP_INVOKE_MAP = APP_CHANNELS.maps.invoke;

const APP_SEND_MAP = APP_CHANNELS.maps.send;

const APP_EVENT_MAP = APP_CHANNELS.maps.events;

export { APP_CHANNELS, APP_EVENT_MAP, APP_INVOKE_MAP, APP_SEND_MAP };
