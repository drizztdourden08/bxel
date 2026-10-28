/* @layer renderer-app @kind logic */
import { readOrphanPid } from './read-orphan-pid';
import { waitProcessGone } from './wait-process-gone';

const GONE_WAIT_MS = 15_000;

const stopOrphan = async (discoveryFile: string): Promise<void> => {
  const pid = await readOrphanPid(discoveryFile);
  if (pid === null) return;
  try {
    process.kill(pid);
  } catch (error) {
    process.stderr.write(`the headless Bxel ${pid} was already gone: ${String(error)}\n`);
  }
  await waitProcessGone(pid, GONE_WAIT_MS);
};

export { stopOrphan };
