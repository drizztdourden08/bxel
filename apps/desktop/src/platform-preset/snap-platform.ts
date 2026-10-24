/* @layer renderer-app @kind logic */
import { MAX_STEPS } from '@bxel/document';
import type { Artwork, DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { runSteps } from '../transactions/run-steps';
import { SNAP_LABEL, SNAP_TEXT } from './snap-platform.constants';
import { snapPlan } from './snap-plan';
import type { SnapOutcome, SnapScope } from './snap-plan.type';
import { snapSteps } from './snap-steps';
import { presetById } from './preset-by-id';

const presetFor = (artwork: Artwork | undefined, scope: SnapScope | undefined) => presetById(scope?.platformId ?? artwork?.platformId);

const snapPlatform = (host: DocumentHost, documentId: DocumentId, scope?: SnapScope): SnapOutcome => {
  const artwork = host.view(documentId)?.state.artwork;
  const preset = presetFor(artwork, scope);
  if (!artwork || !preset) return { ok: false, message: SNAP_TEXT.noPlatform };
  const { changes } = snapPlan(artwork, preset, scope?.bankIds);
  if (changes.length === 0) return { ok: false, message: SNAP_TEXT.nothing };
  if (changes.length > MAX_STEPS) return { ok: false, message: SNAP_TEXT.tooMany(changes.length, MAX_STEPS) };
  const done = runSteps(host, documentId, SNAP_LABEL, snapSteps(changes));
  return done.ok ? { ok: true, moved: changes.length } : { ok: false, message: SNAP_TEXT.failed(done.error.message) };
};

export { snapPlatform };
