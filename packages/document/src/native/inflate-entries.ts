/* @layer core @kind logic */
import { unzipSync } from 'fflate';
import type { ArchiveContents } from './archive.type';

const inflateOne = (bytes: Uint8Array, name: string): Uint8Array | null => {
  try {
    return unzipSync(bytes, { filter: (file) => file.name === name })[name] ?? null;
  } catch {
    return null;
  }
};

const inflateEach = (bytes: Uint8Array, names: readonly string[]): ArchiveContents => {
  const files = new Map<string, Uint8Array>();
  const unreadable = new Set<string>();
  for (const name of names) {
    const data = inflateOne(bytes, name);
    if (data) files.set(name, data);
    else unreadable.add(name);
  }
  return { files, unreadable };
};

const inflateEntries = (bytes: Uint8Array, names: readonly string[]): ArchiveContents => {
  const wanted = new Set(names);
  try {
    const all = unzipSync(bytes, { filter: (file) => wanted.has(file.name) });
    return { files: new Map(Object.entries(all)), unreadable: new Set<string>() };
  } catch {
    return inflateEach(bytes, names);
  }
};

export { inflateEntries };
