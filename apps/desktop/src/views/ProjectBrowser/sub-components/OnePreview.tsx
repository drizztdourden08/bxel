/* @layer renderer-app @kind component */
import { Box, Button, Icon, Image, Text } from '@drizztdourden08/tessera';
import { KIND_ICON, KIND_LABEL } from '../../../asset-list/asset-list.constants';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import { AssetPreview } from '../../AssetPreview';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { useEntryPreview } from '../behavior/useEntryPreview';
import { PreviewFacts } from './PreviewFacts';

const OnePreview = ({ entry }: { readonly entry: FileEntry }) => {
  const { actions } = useBrowserContext();
  const { preview, loop } = useEntryPreview(entry);
  return (
    <Box className="browser-preview__one">
      {preview ? (
        <AssetPreview key={entry.id} preview={preview} name={entry.row.name} loop={loop} mode="large" />
      ) : (
        <Box className="browser-preview__still">
          {entry.row.preview ? <Image src={entry.row.preview} alt={entry.row.name} pixelated /> : <Icon name={KIND_ICON[entry.row.kind]} size="lg" />}
        </Box>
      )}
      <Text as="h3" variant="subtitle" className="browser-name" title={entry.row.name}>
        {entry.row.name}
      </Text>
      <Text as="span" variant="caption" tone="muted">
        {KIND_LABEL[entry.row.kind]}
      </Text>
      <Box className="browser-preview__actions">
        <Button size="sm" variant="primary" onClick={() => actions.open(entry)}>
          {BROWSER_TEXT.open}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => actions.properties([entry])}>
          {BROWSER_TEXT.properties}
        </Button>
      </Box>
      <PreviewFacts entry={entry} />
    </Box>
  );
};

export { OnePreview };
