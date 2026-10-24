/* @layer core @kind logic */
import { FORMAT_VERSION } from './container.constants';
import { gateVersions } from './gate-versions';
import type { Manifest } from './manifest.type';
import type { VersionGate } from './version-gate.type';

const versionGate = (manifest: Manifest): VersionGate => gateVersions(manifest, FORMAT_VERSION);

export { versionGate };
