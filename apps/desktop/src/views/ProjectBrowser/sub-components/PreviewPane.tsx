/* @layer renderer-app @kind component */
import { Box, EmptyState } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { FolderPreview } from './FolderPreview';
import { ManyPreview } from './ManyPreview';
import { OnePreview } from './OnePreview';

const PreviewPane = () => {
  const { model } = useBrowserContext();
  const [first] = model.selected;
  const single = model.selected.length === 1 ? first : undefined;
  return (
    <Box as="aside" className="browser-preview" aria-label={BROWSER_TEXT.previewLabel}>
      {model.selected.length === 0 && <EmptyState size="sm" title={BROWSER_TEXT.windowTitle} message={BROWSER_TEXT.selectOne} />}
      {model.selected.length > 1 && <ManyPreview entries={model.selected} />}
      {single?.kind === 'file' && <OnePreview entry={single} />}
      {single?.kind === 'folder' && <FolderPreview entry={single} />}
    </Box>
  );
};

export { PreviewPane };
