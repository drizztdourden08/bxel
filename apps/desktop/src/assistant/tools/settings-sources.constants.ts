/* @layer renderer-app @kind constants */
import type { ConfigSource } from '../../config-source/config-source.type';

const SETTINGS_SOURCES: { asset: ConfigSource | null; project: ConfigSource | null } = { asset: null, project: null };

export { SETTINGS_SOURCES };
