/* @layer renderer-app @kind logic */
import { OPEN_FILTERS } from '../files/files.constants';
import { fileKit } from '../files/file-kit';
import { applyLinkFixes } from '../project-health/apply-link-fixes';
import type { LinkFinding } from '../project-health/project-health.type';
import { STAGE_TEXT } from './stage-state.constants';

const relinkFinding = async (finding: LinkFinding): Promise<void> => {
  const kit = fileKit();
  if (!kit) return;
  const to = await kit.documents.open({ title: STAGE_TEXT.relinkTitle, filters: OPEN_FILTERS });
  if (to === null) return;
  await applyLinkFixes([{ file: finding.file, linkId: finding.linkId, by: 'path', to }]);
};

export { relinkFinding };
