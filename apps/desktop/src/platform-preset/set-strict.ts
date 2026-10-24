/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { runSteps } from '../transactions/run-steps';
import { STRICT_LABEL, STRICT_TEXT } from './platform-preset.constants';
import type { PlatformOutcome } from './platform-preset.type';

const setStrict = (host: DocumentHost, documentId: DocumentId, value: boolean): PlatformOutcome => {
  const options = { platformStrict: value };
  const done = runSteps(host, documentId, STRICT_LABEL, [{ name: COMMAND_NAME.artworkUpdate, targets: null, options }]);
  return done.ok ? { ok: true } : { ok: false, message: STRICT_TEXT.failed(done.error.message) };
};

export { setStrict };
