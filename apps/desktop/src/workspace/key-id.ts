/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import { KEY_SEPARATOR } from './workspace.constants';

const keyId = (key: AssetKey): string => `${key.kind}${KEY_SEPARATOR}${key.id}`;

export { keyId };
