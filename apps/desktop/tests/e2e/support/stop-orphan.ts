/* @layer renderer-app @kind logic */
import { readFile } from 'node:fs/promises';

const pidOf = (text: string): number | null => {
  const parsed: unknown = JSON.parse(text);
  const pid = typeof parsed === 'object' && parsed !== null && 'pid' in parsed ? parsed.pid : null;
  return typeof pid === 'number' ? pid : null;
};

const stopOrphan = async (discoveryFile: string): Promise<void> => {
  const text = await readFile(discoveryFile, 'utf8').catch(() => null);
  const pid = text === null ? null : pidOf(text);
  if (pid === null) return;
  try {
    process.kill(pid);
  } catch (error) {
    process.stderr.write(`the headless Bxel ${pid} was already gone: ${String(error)}\n`);
  }
};

export { stopOrphan };
