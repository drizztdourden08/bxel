/* @layer renderer-app @kind logic */
import { readdir } from 'node:fs/promises';
import { expect } from 'vitest';
import { POLL_MS } from './e2e.constants';

const WANTED = ['.bxmap', '.bxtiles'];

const endings = async (dir: string): Promise<string[]> =>
  (await readdir(dir)).map((name) => name.slice(name.lastIndexOf('.'))).filter((each) => WANTED.includes(each)).sort();

const expectSavedBeside = async (place: string, elsewhere: string): Promise<void> => {
  await expect.poll(() => endings(place), { timeout: POLL_MS }).toEqual(WANTED);
  expect(await readdir(place)).not.toContain(elsewhere);
};

export { expectSavedBeside };
