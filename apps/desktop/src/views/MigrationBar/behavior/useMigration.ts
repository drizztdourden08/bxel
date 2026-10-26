/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import { keyId } from '../../../workspace/key-id';
import { MIGRATION_TEXT } from '../MigrationBar.constants';
import type { MigrationView } from '../MigrationBar.type';

const useMigration = (): MigrationView | null => {
  const view = useActiveDocument();
  const documentId = view?.state.documentId;
  const workspace = useWorkspaceStore((state) => (documentId === undefined ? undefined : state.workspaces[documentId]));
  const migration = workspace?.migration ?? null;
  const pending = migration !== null && workspace !== undefined && migration.keys.some((key) => workspace.dirty.has(keyId(key)));
  return useMemo(() => {
    if (!migration || !pending) return null;
    const lines = migration.conversions.map((item) => ({
      key: item.animationId,
      text: (item.source === 'tile' ? MIGRATION_TEXT.tileLine : MIGRATION_TEXT.line)(item.spriteName, item.animationName, item.frames),
    }));
    return { notice: migration.notice, lines };
  }, [migration, pending]);
};

export { useMigration };
