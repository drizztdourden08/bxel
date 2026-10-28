/* @layer renderer-app @kind component */
import { Box, Button, EmptyState, Icon, Image, Text } from '@drizztdourden08/tessera';
import { KIND_ICON, KIND_LABEL } from '../../../asset-list/asset-list.constants';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { BrowserEntry, FileEntry } from '../../../project-browser/project-browser.type';
import { AssetPreview } from '../../AssetPreview';
import { useBrowserContext } from '../behavior/browser-context';
import { useEntryPreview } from '../behavior/useEntryPreview';
import { PreviewFacts } from './PreviewFacts';
import { ThumbBox } from './FileThumb';

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

const summary = (files: readonly FileEntry[]): string => {
  const counts = new Map<string, number>();
  for (const file of files) counts.set(KIND_LABEL[file.row.kind], (counts.get(KIND_LABEL[file.row.kind]) ?? 0) + 1);
  return [...counts].map(([kind, count]) => `${count} ${kind.toLowerCase()}${count === 1 ? '' : 's'}`).join(', ');
};

const ManyPreview = ({ entries }: { readonly entries: readonly BrowserEntry[] }) => {
  const files = entries.filter((entry): entry is FileEntry => entry.kind === 'file');
  return (
    <Box className="browser-preview__many">
      <Box className="browser-preview__stack">
        {entries.slice(0, 4).map((entry) => (
          <ThumbBox key={entry.id} entry={entry} />
        ))}
      </Box>
      <Text as="h3" variant="subtitle">
        {BROWSER_TEXT.selectedMany(entries.length)}
      </Text>
      <Text as="span" variant="caption" tone="muted">
        {summary(files)}
      </Text>
    </Box>
  );
};

/** The right pane: one file large with its facts, a folder, or a stack for several. */
const PreviewPane = () => {
  const { model } = useBrowserContext();
  const [first] = model.selected;
  return (
    <Box as="aside" className="browser-preview" aria-label={BROWSER_TEXT.previewLabel}>
      {model.selected.length === 0 && <EmptyState size="sm" title={BROWSER_TEXT.windowTitle} message={BROWSER_TEXT.selectOne} />}
      {model.selected.length > 1 && <ManyPreview entries={model.selected} />}
      {model.selected.length === 1 && first?.kind === 'file' && <OnePreview entry={first} />}
      {model.selected.length === 1 && first?.kind === 'folder' && (
        <Box className="browser-preview__many">
          <ThumbBox entry={first} />
          <Text as="h3" variant="subtitle">{first.name}</Text>
          <Text as="span" variant="caption" tone="muted">{BROWSER_TEXT.statusFiles(first.count)}</Text>
        </Box>
      )}
    </Box>
  );
};

export { PreviewPane };
