/* @layer renderer-app @kind test */
import type { DocumentId } from '@bxel/document';
import { beforeEach } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { openSampleProject } from '../workspace/open-sample-project';

const openedProject = async (held: Rig) => {
  const opened = await openSampleProject(held);
  useDocumentStore.getState().setActive(opened.documentId);
  return opened;
};

const openSheetTab = (documentId: DocumentId, sheetId: string): void => {
  const tab = { id: `${documentId}|sheet:${sheetId}`, documentId, key: { kind: 'sheet' as const, id: sheetId } };
  useWorkspaceStore.getState().addTab(tab);
  useWorkspaceStore.getState().setActiveTab(tab.id);
};

const presetRig = () => {
  const state: { held: Rig } = { held: rig() };
  beforeEach(() => {
    state.held = rig();
    useSpriteStore.setState({ activeId: null });
  });
  return { held: (): Rig => state.held, project: () => openedProject(state.held) };
};

export { openSheetTab, presetRig };
