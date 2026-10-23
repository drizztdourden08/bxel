/* @layer core @kind logic */
import { FORMAT_VERSION } from './container.constants';
import { LOAD_ERROR } from './load-error.constants';
import type { Manifest } from './manifest.type';
import { makeIssue } from './make-issue';
import type { VersionGate } from './version-gate.type';

const versionGate = (manifest: Manifest): VersionGate => {
  if (manifest.minReaderVersion > FORMAT_VERSION) {
    const message = `This file needs reader version ${manifest.minReaderVersion}; this app reads up to ${FORMAT_VERSION}.`;
    return { issue: makeIssue(LOAD_ERROR.VERSION_TOO_NEW, message), readOnly: true, notice: null };
  }
  if (manifest.formatVersion > FORMAT_VERSION) {
    const notice = 'This file was saved by a newer Bxel. It opens read-only.';
    return { issue: null, readOnly: true, notice };
  }
  return { issue: null, readOnly: false, notice: null };
};

export { versionGate };
