/* @layer renderer-app @kind logic */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

type Program = { grant?: { special?: { mayRestart?: boolean } } };

const setOn = (programs: Program[], on: boolean): boolean => {
  const withGrant = programs.filter((program) => program.grant);
  for (const program of withGrant) program.grant = { ...program.grant, special: { mayRestart: on } };
  return withGrant.length > 0;
};

const edit = (value: unknown, on: boolean): boolean => {
  if (typeof value !== 'object' || value === null) return false;
  const found = Object.entries(value).map(([key, child]) => (key === 'assistantPrograms' && Array.isArray(child) ? setOn(child as Program[], on) : edit(child, on)));
  return found.some(Boolean);
};

const setProgramRestart = async (userData: string, on: boolean): Promise<void> => {
  const entries = await readdir(userData, { recursive: true });
  let changed = false;
  for (const entry of entries.filter((each) => basename(each) === 'config.json')) {
    const file = join(userData, entry);
    const parsed: unknown = JSON.parse(await readFile(file, 'utf8'));
    if (!edit(parsed, on)) continue;
    await writeFile(file, JSON.stringify(parsed, null, 2));
    changed = true;
  }
  if (!changed) throw new Error('no remembered program in the saved settings');
};

export { setProgramRestart };
