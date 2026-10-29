/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { tagCounts } from '../../../project-browser/tag-counts';
import { tagQuery } from '../../../project-browser/tag-query';
import { tagTree } from '../../../project-browser/tag-tree';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { SourceSection } from './SourceSection';
import { SourceTree } from './SourceTree';

const TagsSection = () => {
  const { model } = useBrowserContext();
  const query = useBrowserStore((state) => state.query);
  const tags = useMemo(() => tagCounts(model.organise, model.everyFile), [model.organise, model.everyFile]);
  const active = [...tags.keys()].find((tag) => tagQuery(tag) === query);
  return (
    <SourceSection title={BROWSER_TEXT.tags} empty={tags.size === 0 ? BROWSER_TEXT.noTags : undefined}>
      {tags.size > 0 && <SourceTree label={BROWSER_TEXT.tags} root={tagTree(tags)} selectedKey={active ?? null} onSelect={(key) => useBrowserStore.getState().setQuery(tagQuery(key))} />}
    </SourceSection>
  );
};

export { TagsSection };
