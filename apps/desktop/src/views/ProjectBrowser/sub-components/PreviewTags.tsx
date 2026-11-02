/* @layer renderer-app @kind component */
import { Box, Tag, TagInput, Text } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import { tagCounts } from '../../../project-browser/tag-counts';
import { useBrowserContext } from '../behavior/useBrowserContext';

const PreviewTags = ({ entries }: { readonly entries: readonly FileEntry[] }) => {
  const { actions, model } = useBrowserContext();
  const taggable = entries.filter((entry) => entry.row.assetId !== null);
  const held = [...new Set(entries.flatMap((entry) => entry.facts.tags))].sort();
  const collections = [...new Set(entries.flatMap((entry) => entry.facts.collections))].sort();
  const inUse = useMemo(() => [...tagCounts(model.organise, model.everyFile).keys()], [model.organise, model.everyFile]);
  const change = (next: readonly string[]): void => {
    for (const tag of next.filter((each) => !held.includes(each))) actions.tag(taggable, tag);
    for (const tag of held.filter((each) => !next.includes(each))) actions.untag(taggable, tag);
  };
  if (taggable.length === 0) return null;
  return (
    <Box className="browser-tags">
      <Text as="h4" variant="overline" tone="muted">
        {entries.length > 1 ? BROWSER_TEXT.manyTags : BROWSER_TEXT.tagsLabel}
      </Text>
      {model.editable ? (
        <TagInput value={held} suggestions={inUse} onChange={change} placeholder={BROWSER_TEXT.addTagHint} aria-label={BROWSER_TEXT.addTagLabel} size="sm" />
      ) : (
        held.length > 0 && (
          <Box className="browser-tags__list" role="group" aria-label={BROWSER_TEXT.tagsLabel}>
            {held.map((tag) => (
              <Tag key={tag} name={tag}>
                {tag}
              </Tag>
            ))}
          </Box>
        )
      )}
      {collections.length > 0 && (
        <Text as="p" variant="caption" tone="muted">
          {`${BROWSER_TEXT.inCollections}: ${collections.join(', ')}`}
        </Text>
      )}
    </Box>
  );
};

export { PreviewTags };
