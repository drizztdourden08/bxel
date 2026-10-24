/* @layer renderer-app @kind test */
import type { DocumentId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { decideQuit } from '../../src/recovery/decide-quit';
import type { CloseAnswer, DirtyDocument, QuitDeps } from '../../src/recovery/recovery.type';

type Rig = {
  readonly deps: QuitDeps;
  readonly log: string[];
  readonly saves: { failing: DocumentId[] };
};

const doc = (id: string, name: string): DirtyDocument => ({ documentId: id as DocumentId, name });

const rig = (documents: readonly DirtyDocument[], answers: readonly CloseAnswer[]): Rig => {
  const log: string[] = [];
  const saves: { failing: DocumentId[] } = { failing: [] };
  const queue = [...answers];
  const deps: QuitDeps = {
    dirty: () => documents,
    flush: () => {
      log.push('flush');
      return Promise.resolve();
    },
    ask: (name) => {
      log.push(`ask ${name}`);
      return Promise.resolve(queue.shift() ?? 'cancel');
    },
    save: (documentId) => {
      log.push(`save ${documentId}`);
      return Promise.resolve(!saves.failing.includes(documentId));
    },
    discard: (documentId) => {
      log.push(`discard ${documentId}`);
      return Promise.resolve();
    },
  };
  return { deps, log, saves };
};

describe('quit decision', () => {
  it('quits at once, with no prompt and no flush, when nothing is dirty', async () => {
    const { deps, log } = rig([], []);
    expect(await decideQuit(deps)).toBe('quit');
    expect(log).toEqual([]);
  });

  it('flushes the snapshots, saves, then quits on Save', async () => {
    const { deps, log } = rig([doc('a', 'hero.bxel')], ['save']);
    expect(await decideQuit(deps)).toBe('quit');
    expect(log).toEqual(['flush', 'ask hero.bxel', 'save a']);
  });

  it('clears the recovery copy and quits on Discard, without saving', async () => {
    const { deps, log } = rig([doc('a', 'hero.bxel')], ['discard']);
    expect(await decideQuit(deps)).toBe('quit');
    expect(log).toEqual(['flush', 'ask hero.bxel', 'discard a']);
  });

  it('stays on Cancel and changes nothing', async () => {
    const { deps, log } = rig([doc('a', 'hero.bxel')], ['cancel']);
    expect(await decideQuit(deps)).toBe('stay');
    expect(log).toEqual(['flush', 'ask hero.bxel']);
  });

  it('stays when Save As for an untitled document is cancelled', async () => {
    const { deps, log, saves } = rig([doc('a', 'Untitled.bxel')], ['save']);
    saves.failing.push('a' as DocumentId);
    expect(await decideQuit(deps)).toBe('stay');
    expect(log).toEqual(['flush', 'ask Untitled.bxel', 'save a']);
  });

  it('asks once per dirty document, then saves and discards each as answered', async () => {
    const documents = [doc('a', 'hero.bxel'), doc('b', 'Untitled.bxel'), doc('c', 'tiles.bxel')];
    const { deps, log } = rig(documents, ['save', 'discard', 'save']);
    expect(await decideQuit(deps)).toBe('quit');
    expect(log).toEqual([
      'flush',
      'ask hero.bxel',
      'ask Untitled.bxel',
      'ask tiles.bxel',
      'save a',
      'save c',
      'discard b',
    ]);
  });

  it('stays without saving or discarding anything when a later document is cancelled', async () => {
    const documents = [doc('a', 'hero.bxel'), doc('b', 'tiles.bxel')];
    const { deps, log } = rig(documents, ['discard', 'cancel']);
    expect(await decideQuit(deps)).toBe('stay');
    expect(log).toEqual(['flush', 'ask hero.bxel', 'ask tiles.bxel']);
  });

  it('keeps the recovery copies of discarded documents when a save fails', async () => {
    const documents = [doc('a', 'hero.bxel'), doc('b', 'tiles.bxel')];
    const { deps, log, saves } = rig(documents, ['discard', 'save']);
    saves.failing.push('b' as DocumentId);
    expect(await decideQuit(deps)).toBe('stay');
    expect(log).not.toContain('discard a');
  });

  it('still quits when the snapshot flush fails', async () => {
    const { deps } = rig([doc('a', 'hero.bxel')], ['discard']);
    const failing: QuitDeps = { ...deps, flush: () => Promise.reject(new Error('The disk is full')) };
    expect(await decideQuit(failing)).toBe('quit');
  });
});
