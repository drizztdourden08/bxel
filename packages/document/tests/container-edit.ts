/* @layer core @kind test */
import { crc32 } from '@bxel/document/native';
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import type { Zippable } from 'fflate';
import { z } from 'zod';

type Files = Record<string, Uint8Array>;

const manifestSchema = z.looseObject({
  format: z.string(),
  formatVersion: z.number(),
  minReaderVersion: z.number(),
  entries: z.array(z.looseObject({ path: z.string(), length: z.number(), crc32: z.string() })),
});

const documentSchema = z.looseObject({
  sprites: z.array(z.looseObject({ id: z.string(), bankId: z.string(), width: z.number() })),
  banks: z.array(z.looseObject({ transparent: z.boolean() })),
});

type EditableManifest = z.infer<typeof manifestSchema>;
type EditableDocument = z.infer<typeof documentSchema>;

const unpack = (bytes: Uint8Array): Files => unzipSync(bytes);

const pack = (files: Files): Uint8Array => {
  const zippable: Zippable = {};
  for (const [path, data] of Object.entries(files)) zippable[path] = path === 'mimetype' ? [data, { level: 0 }] : data;
  return zipSync(zippable);
};

const readJson = <S extends z.ZodType>(files: Files, path: string, schema: S): z.infer<S> =>
  schema.parse(JSON.parse(strFromU8(files[path] ?? new Uint8Array())));

const writeJson = (files: Files, path: string, value: unknown): void => {
  files[path] = strToU8(JSON.stringify(value));
};

const refreshManifest = (files: Files): void => {
  const manifest = readJson(files, 'manifest.json', manifestSchema);
  for (const entry of manifest.entries) {
    const data = files[entry.path];
    if (!data) continue;
    entry.length = data.length;
    entry.crc32 = crc32(data);
  }
  writeJson(files, 'manifest.json', manifest);
};

const editFiles = (bytes: Uint8Array, edit: (files: Files) => void): Uint8Array => {
  const files = unpack(bytes);
  edit(files);
  return pack(files);
};

const editDocument = (bytes: Uint8Array, edit: (document: EditableDocument) => void): Uint8Array =>
  editFiles(bytes, (files) => {
    const document = readJson(files, 'document.json', documentSchema);
    edit(document);
    writeJson(files, 'document.json', document);
    refreshManifest(files);
  });

const editManifest = (bytes: Uint8Array, edit: (manifest: EditableManifest) => void): Uint8Array =>
  editFiles(bytes, (files) => {
    const manifest = readJson(files, 'manifest.json', manifestSchema);
    edit(manifest);
    writeJson(files, 'manifest.json', manifest);
  });

const editCel = (bytes: Uint8Array, celId: string, edit: (pixels: Uint8Array) => void, refresh: boolean): Uint8Array =>
  editFiles(bytes, (files) => {
    const path = `cels/${celId}.idx`;
    const pixels = (files[path] ?? new Uint8Array()).slice();
    edit(pixels);
    files[path] = pixels;
    if (refresh) refreshManifest(files);
  });

export { editCel, editDocument, editFiles, editManifest, pack };
