/* @layer renderer-app @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import type { FileAction, FileOutcome } from '../../src/files/files.type';
import { recordFault } from '../../src/files/record-fault';
import type { StageFault } from '../../src/stage-state/stage-state.type';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useFaultStore } from '../../src/stores/useFaultStore';

const BROKEN: FileAction = { kind: 'openPath', path: 'C:/proj/bad.bxsprite' };

const FAILED: FileOutcome = { kind: 'failed', message: 'It is damaged.' };

const OLD_FAULT: StageFault = { message: 'An older failure.', action: { kind: 'open' } };

const openDocument = (): void => {
  const { host, setActive } = useDocumentStore.getState();
  setActive(createDefaultArtwork(host));
};

afterEach(() => {
  const { host, setActive } = useDocumentStore.getState();
  for (const documentId of host.list()) host.close(documentId);
  setActive(null);
  useFaultStore.getState().set(null);
});

describe('K1 the stage fault of a failed open', { tags: ['critical'] }, () => {
  it('keeps the fault when nothing is open, so the empty stage can show it', () => {
    recordFault(FAILED, BROKEN);
    expect(useFaultStore.getState().fault).toEqual({ message: 'It is damaged.', action: BROKEN });
  });

  it('keeps no fault when another document is open, so a later empty stage shows no old failure', () => {
    openDocument();
    recordFault(FAILED, BROKEN);
    expect(useFaultStore.getState().fault).toBeNull();
  });

  it('drops an older fault when a later open fails while a document is open', () => {
    useFaultStore.getState().set(OLD_FAULT);
    openDocument();
    recordFault(FAILED, BROKEN);
    expect(useFaultStore.getState().fault).toBeNull();
  });

  it('clears the fault when a later open succeeds', () => {
    useFaultStore.getState().set(OLD_FAULT);
    recordFault({ kind: 'done', path: 'C:/proj/good.bxsprite', notice: null }, BROKEN);
    expect(useFaultStore.getState().fault).toBeNull();
  });

  it('leaves the fault alone for a save or a cancelled open', () => {
    useFaultStore.getState().set(OLD_FAULT);
    recordFault(FAILED, { kind: 'save' });
    recordFault({ kind: 'cancelled' }, { kind: 'open' });
    expect(useFaultStore.getState().fault).toEqual(OLD_FAULT);
  });
});
