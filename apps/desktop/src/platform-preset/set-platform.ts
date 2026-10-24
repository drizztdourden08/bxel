/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { runSteps } from '../transactions/run-steps';
import { NO_PLATFORM, PLATFORM_LABEL, PLATFORM_TEXT } from './platform-preset.constants';
import type { PlatformOutcome } from './platform-preset.type';

const setPlatform = (host: DocumentHost, documentId: DocumentId, value: string): PlatformOutcome => {
  const options = { platformId: value === NO_PLATFORM ? null : value };
  const done = runSteps(host, documentId, PLATFORM_LABEL, [{ name: COMMAND_NAME.artworkUpdate, targets: null, options }]);
  return done.ok ? { ok: true } : { ok: false, message: PLATFORM_TEXT.changeFailed(done.error.message) };
};

export { setPlatform };
