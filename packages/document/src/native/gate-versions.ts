/* @layer core @kind logic */
import { LOAD_ERROR } from './load-error.constants';
import { makeIssue } from './make-issue';
import type { Versions } from './gate-versions.type';
import type { VersionGate } from './version-gate.type';

const gateVersions = (versions: Versions, supported: number): VersionGate => {
  if (versions.minReaderVersion > supported) {
    const message = `This file needs reader version ${versions.minReaderVersion}; this app reads up to ${supported}.`;
    return { issue: makeIssue(LOAD_ERROR.VERSION_TOO_NEW, message), readOnly: true, notice: null };
  }
  if (versions.formatVersion > supported) {
    const notice = 'This file was saved by a newer Bxel. It opens read-only.';
    return { issue: null, readOnly: true, notice };
  }
  return { issue: null, readOnly: false, notice: null };
};

export { gateVersions };
