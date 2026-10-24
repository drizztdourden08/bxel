/* @layer renderer-app @kind test */
import { COMMAND_NAME, counterIdSource } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import type { DocumentsPort, DocumentWriteOptions, RecentDocument } from '@drizztdourden08/brock-core';
import { createDefaultProject } from '../../src/documents/create-default-project';
import { createDocumentHost } from '../../src/documents/create-document-host';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { activeTarget } from '../../src/editor/active-target';
import { commitRequest } from '../../src/editor/commit-request';
import type { FileKit, PathBook } from '../../src/files/files.type';

type Memory = {
  readonly port: DocumentsPort;
  readonly files: Map<string, Uint8Array>;
  readonly picks: { open: string | null; saveAs: string | null };
  readonly writes: string[];
  readonly options: (DocumentWriteOptions | undefined)[];
  readonly recent: RecentDocument[];
  failWrites: boolean;
};

type Harness = {
  readonly kit: FileKit;
  readonly host: DocumentHost;
  readonly memory: Memory;
  readonly paths: Map<string, string>;
  readonly focused: DocumentId[];
};

const SAVED = 'C:\\art\\hero.bxel';

const memoryDocuments = (): Memory => {
  const files = new Map<string, Uint8Array>();
  const writes: string[] = [];
  const options: (DocumentWriteOptions | undefined)[] = [];
  const recent: RecentDocument[] = [];
  const memory: Memory = {
    files,
    writes,
    options,
    recent,
    picks: { open: null, saveAs: null },
    failWrites: false,
    port: {
      open: () => Promise.resolve(memory.picks.open),
      saveAs: () => Promise.resolve(memory.picks.saveAs),
      read: (path) => {
        const bytes = files.get(path);
        return bytes ? Promise.resolve(bytes) : Promise.reject(new Error(`No file at ${path}`));
      },
      readText: () => Promise.reject(new Error('Text reads are not used')),
      write: (path, data, writeOptions) => {
        if (memory.failWrites) return Promise.reject(new Error('The disk is full'));
        writes.push(path);
        options.push(writeOptions);
        if (writeOptions?.recent !== false) recent.unshift({ path, name: path, lastOpened: 1 });
        files.set(path, data);
        return Promise.resolve();
      },
      writeText: () => Promise.reject(new Error('Text writes are not used')),
      recent: () => Promise.resolve(recent),
      clearRecent: () => Promise.resolve(),
      openRecent: (path) => Promise.resolve(path),
      snapshot: () => Promise.resolve(),
      recoverable: () => Promise.resolve([]),
      restoreSnapshot: () => Promise.resolve(null),
      discardSnapshot: () => Promise.resolve(),
    },
  };
  return memory;
};

const pathBook = (host: DocumentHost, paths: Map<string, string>): PathBook => ({
  pathOf: (documentId) => paths.get(documentId),
  documentAt: (path) => host.list().find((documentId) => paths.get(documentId) === path),
  remember: (documentId, path) => {
    paths.set(documentId, path);
  },
});

const harness = (): Harness => {
  const host = createDocumentHost({ ids: counterIdSource() });
  const memory = memoryDocuments();
  const paths = new Map<string, string>();
  const focused: DocumentId[] = [];
  const kit: FileKit = {
    documents: memory.port,
    host,
    paths: pathBook(host, paths),
    clock: () => 1_700_000_000_000,
    focus: (documentId) => {
      focused.push(documentId);
    },
  };
  return { kit, host, memory, paths, focused };
};

const createProject = (host: DocumentHost): DocumentId => createDefaultProject(host);

const paintPixels = (host: DocumentHost, documentId: DocumentId): void => {
  const target = activeTarget(host.view(documentId));
  if (!target) throw new Error('the document has no sprite');
  const options = {
    points: [{ x: 0, y: 0 }, { x: 1, y: 0 }],
    brush: { shape: 'square', size: 1 },
    index: 1,
  };
  const result = host.execute(commitRequest(target, 'Pencil', { name: COMMAND_NAME.pixelsPaint, options }));
  if (!result.ok) throw new Error(result.error.message);
};

export { createProject, harness, paintPixels, SAVED };
export type { Harness };
