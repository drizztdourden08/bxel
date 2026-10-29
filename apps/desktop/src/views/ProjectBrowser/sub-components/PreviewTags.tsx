/* @layer renderer-app @kind component */
import { Box, TextInput, Tag, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import { useBrowserContext } from '../behavior/useBrowserContext';

const PreviewTags = ({ entries }: { readonly entries: readonly FileEntry[] }) => {
  const { actions, model } = useBrowserContext();
  const [typed, setTyped] = useState('');
  const taggable = entries.filter((entry) => entry.row.assetId !== null);
  const held = [...new Set(entries.flatMap((entry) => entry.facts.tags))].sort();
  const collections = [...new Set(entries.flatMap((entry) => entry.facts.collections))].sort();
  const commit = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' || typed.trim() === '') return;
    event.preventDefault();
    actions.tag(taggable, typed);
    setTyped('');
  };
  if (taggable.length === 0) return null;
  return (
    <Box className="browser-tags">
      <Text as="h4" variant="overline" tone="muted">
        {entries.length > 1 ? BROWSER_TEXT.manyTags : BROWSER_TEXT.tagsLabel}
      </Text>
      {held.length > 0 && (
        <Box className="browser-tags__list" role="group" aria-label={BROWSER_TEXT.tagsLabel}>
          {held.map((tag) => (
            <Tag key={tag} name={tag} {...(model.editable ? { onRemove: () => actions.untag(taggable, tag) } : {})}>
              {tag}
            </Tag>
          ))}
        </Box>
      )}
      {model.editable && <TextInput value={typed} placeholder={BROWSER_TEXT.addTagHint} aria-label={BROWSER_TEXT.addTagLabel} onChange={(event) => setTyped(event.target.value)} onKeyDown={commit} />}
      {collections.length > 0 && (
        <Text as="p" variant="caption" tone="muted">
          {`${BROWSER_TEXT.inCollections}: ${collections.join(', ')}`}
        </Text>
      )}
    </Box>
  );
};

export { PreviewTags };
