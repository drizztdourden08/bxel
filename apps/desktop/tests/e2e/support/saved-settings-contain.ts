/* @layer renderer-app @kind logic */
import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const savedSettingsContain = async (userData: string, text: string): Promise<boolean> => {
  const entries = await readdir(userData, { recursive: true }).catch(() => []);
  const files = entries.filter((entry) => basename(entry) === 'config.json');
  const contents = await Promise.all(files.map((file) => readFile(join(userData, file), 'utf8').catch(() => '')));
  return contents.some((content) => content.includes(text));
};

export { savedSettingsContain };
