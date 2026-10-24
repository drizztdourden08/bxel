/* @layer renderer-app @kind logic */
import { normalizeTrustStore } from '@bxel/mcp';
import type { TrustStore } from '@bxel/mcp';
import type { AssistantSettings } from './assistant.type';

const trustStoreOf = (settings: AssistantSettings): TrustStore =>
  normalizeTrustStore({
    level: settings.assistantLevel,
    allowAllMode: settings.assistantAllowAllMode,
    programs: settings.assistantPrograms,
  });

export { trustStoreOf };
