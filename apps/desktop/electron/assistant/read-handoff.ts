/* @layer electron-main @kind logic */
import { readGrant } from '@bxel/mcp';
import { fieldOf } from '../../src/assistant-bridge/field-of';
import { HANDOFF_KIND } from './restart-handoff.constants';
import type { RestartHandoff } from './restart-handoff.type';

const readHandoff = (raw: unknown): RestartHandoff | null => {
  if (fieldOf(raw, 'kind') !== HANDOFF_KIND) return null;
  const key = fieldOf(raw, 'key');
  const at = fieldOf(raw, 'at');
  const grant = readGrant(fieldOf(raw, 'grant'));
  if (typeof key !== 'string' || typeof at !== 'number' || grant === null || grant.blocked) return null;
  return { key, grant, at };
};

export { readHandoff };
