/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import { ReferenceList } from './ReferenceList';

const PreviewReferences = ({ entry }: { readonly entry: FileEntry }) => (
  <Box className="browser-references">
    <ReferenceList title={BROWSER_TEXT.usesTitle} names={entry.facts.uses} />
    <ReferenceList title={BROWSER_TEXT.usedByTitle} names={entry.facts.usedBy} />
  </Box>
);

export { PreviewReferences };
