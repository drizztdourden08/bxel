/* @layer renderer-app @kind logic */
import { MAX_STEPS } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { runSteps } from '../transactions/run-steps';
import { SNAP_LABEL, SNAP_TEXT } from './snap-platform.constants';
import { snapPlan } from './snap-plan';
import type { SnapOutcome } from './snap-plan.type';
import { snapSteps } from './snap-steps';
import { presetById } from './preset-by-id';

const snapPlatform = (host: DocumentHost, documentId: DocumentId): SnapOutcome => {
  const artwork = host.view(documentId)?.state.artwork;
  const preset = presetById(artwork?.platformId);
  if (!artwork || !preset) return { ok: false, message: SNAP_TEXT.noPlatform };
  const { changes } = snapPlan(artwork, preset);
  if (changes.length === 0) return { ok: false, message: SNAP_TEXT.nothing };
  if (changes.length > MAX_STEPS) return { ok: false, message: SNAP_TEXT.tooMany(changes.length, MAX_STEPS) };
  const done = runSteps(host, documentId, SNAP_LABEL, snapSteps(changes));
  return done.ok ? { ok: true, moved: changes.length } : { ok: false, message: SNAP_TEXT.failed(done.error.message) };
};

export { snapPlatform };
