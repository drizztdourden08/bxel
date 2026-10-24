/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../hooks/useActiveDocument';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { countLabel } from '../../workspace/count-label';
import { SPLIT_TEXT } from '../../workspace/workspace.constants';
import './LegacyBar.css';

const LegacyBar = () => {
  const view = useActiveDocument();
  const documentId = view?.state.documentId;
  const legacy = useWorkspaceStore((state) => (documentId === undefined ? null : (state.workspaces[documentId]?.legacy ?? null)));
  const showSplit = useWorkspaceStore((state) => state.showSplit);
  if (!legacy || documentId === undefined) return null;
  const { sprites, sheets, palettes } = legacy.counts;
  const text = SPLIT_TEXT.bar(countLabel(sprites, 'sprite', 'sprites'), countLabel(sheets, 'sheet', 'sheets'), countLabel(palettes, 'palette', 'palettes'));
  return (
    <Flex wrap gap="md" align="center" role="status" className="legacy-bar">
      <Text as="span" variant="label">{text}</Text>
      <Button variant="primary" className="legacy-bar__action" onClick={() => showSplit(documentId)}>{SPLIT_TEXT.open}</Button>
    </Flex>
  );
};

export { LegacyBar };
