/* @layer renderer-app @kind component */
import { Box, Button, StatRow } from '@drizztdourden08/tessera';
import { KIND_LABEL } from '../../../asset-list/asset-list.constants';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import { useBrowserContext } from '../behavior/useBrowserContext';

const PreviewFacts = ({ entry }: { readonly entry: FileEntry }) => {
  const { actions } = useBrowserContext();
  const { row, facts } = entry;
  const uses = facts.uses.length;
  const users = facts.usedBy.length;
  return (
    <Box className="browser-facts">
      <StatRow label="Kind" value={KIND_LABEL[row.kind]} />
      {facts.width !== null && facts.height !== null && <StatRow label={BROWSER_TEXT.columnSize} value={BROWSER_TEXT.pixels(facts.width, facts.height)} />}
      {facts.frames !== null && <StatRow label={BROWSER_TEXT.columnFrames} value={String(facts.frames)} />}
      {facts.palette !== null && <StatRow label={BROWSER_TEXT.columnPalette} value={facts.palette} />}
      <StatRow label={BROWSER_TEXT.columnFolder} value={row.folder} />
      {row.modified > 0 && <StatRow label={BROWSER_TEXT.columnModified} value={new Date(row.modified).toLocaleString()} />}
      <Box className="browser-facts__links">
        <Button size="sm" variant="secondary" disabled={users === 0} onClick={() => actions.filterBy(`uses:"${row.name}"`)}>
          {BROWSER_TEXT.usedBy(users)}
        </Button>
        <Button size="sm" variant="secondary" disabled={uses === 0} onClick={() => actions.filterBy(`usedby:"${row.name}"`)}>
          {BROWSER_TEXT.uses(uses)}
        </Button>
      </Box>
    </Box>
  );
};

export { PreviewFacts };
