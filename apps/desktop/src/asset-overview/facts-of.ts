/* @layer renderer-app @kind logic */
import { assetCreated } from '../workspace/asset-created';
import { formatSize } from '../project/format-size';
import type { AssetFocus } from '../asset-config/asset-config.type';
import { OVERVIEW_KIND_LABEL, OVERVIEW_TEXT } from './asset-overview.constants';
import type { FileFacts, OverviewFact, OverviewPreview } from './asset-overview.type';
import { colourCountOf } from './colour-count-of';
import { kindFacts } from './kind-facts';

const when = (ms: number | null, missing: string): string => (ms === null ? missing : new Date(ms).toLocaleString());

const factsOf = (focus: AssetFocus, preview: OverviewPreview, file: FileFacts): readonly OverviewFact[] => [
  { label: OVERVIEW_TEXT.kind, value: OVERVIEW_KIND_LABEL[focus.key.kind] },
  ...kindFacts(focus.artwork, focus.key),
  { label: OVERVIEW_TEXT.colours, value: OVERVIEW_TEXT.colourCount(colourCountOf(preview)) },
  { label: OVERVIEW_TEXT.created, value: when(assetCreated(focus.artwork, focus.key), OVERVIEW_TEXT.unknown) },
  { label: OVERVIEW_TEXT.modified, value: when(file.modified, OVERVIEW_TEXT.unsaved) },
  { label: OVERVIEW_TEXT.fileSize, value: file.size === null ? OVERVIEW_TEXT.unsaved : formatSize(file.size) },
  { label: OVERVIEW_TEXT.filePath, value: file.path ?? OVERVIEW_TEXT.unsaved },
];

export { factsOf };
