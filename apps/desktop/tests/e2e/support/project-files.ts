/* @layer renderer-app @kind logic */
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const ASSET_FILE = /\.bx(sprite|anim|sheet|palette)$/;

const filesIn = async (folder: string): Promise<string[]> => {
  const entries = await readdir(folder, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => (entry.isDirectory() ? filesIn(join(folder, entry.name)) : Promise.resolve([join(folder, entry.name)]))));
  return nested.flat();
};

const fileNamed = async (root: string, file: string): Promise<string> => {
  const found = (await filesIn(root)).find((path) => path.replaceAll('\\', '/').endsWith(`/${file}`));
  if (!found) throw new Error(`no file ${file} under the project`);
  return found;
};

const assetFiles = async (root: string): Promise<string[]> => (await filesIn(root)).filter((path) => ASSET_FILE.test(path));

const assetDigests = async (root: string): Promise<Map<string, string>> => {
  const entries = await Promise.all(
    (await assetFiles(root)).map(async (path) => [path.replaceAll('\\', '/').split('/').at(-1) ?? path, createHash('sha256').update(await readFile(path)).digest('hex')] as const),
  );
  return new Map(entries);
};

export { assetDigests, assetFiles, fileNamed };
