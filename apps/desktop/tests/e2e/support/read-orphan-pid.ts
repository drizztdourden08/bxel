/* @layer renderer-app @kind logic */
import { readFile } from 'node:fs/promises';

const readOrphanPid = async (discoveryFile: string): Promise<number | null> => {
  const text = await readFile(discoveryFile, 'utf8').catch(() => null);
  if (text === null) return null;
  const parsed: unknown = JSON.parse(text);
  const pid = typeof parsed === 'object' && parsed !== null && 'pid' in parsed ? parsed.pid : null;
  return typeof pid === 'number' ? pid : null;
};

export { readOrphanPid };
