/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { OPEN_FILTERS } from '../files/files.constants';
import { GRANT_LEVELS } from '../workspace/workspace.constants';
import { applyLinkFixes } from './apply-link-fixes';
import { HEALTH_TEXT } from './project-health.constants';
import type { LinkFinding } from './project-health.type';

const pickLinkFile = async (finding: LinkFinding): Promise<void> => {
  const kit = fileKit();
  if (!kit) return;
  const picked = await kit.documents.open({ title: HEALTH_TEXT.pickTitle(finding.targetName), filters: OPEN_FILTERS, grantFolder: { ask: true, levels: GRANT_LEVELS } });
  if (picked === null) return;
  await applyLinkFixes([{ file: finding.file, linkId: finding.linkId, by: 'path', to: picked.path }]);
};

export { pickLinkFile };
