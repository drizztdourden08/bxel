/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { organiseOf } from '../../../organise/organise-of';
import { runOrganise as run } from '../../../organise/run-organise';
import { splitTags } from '../../../properties-subject/split-tags';
import { useManyStore } from '../../../properties-subject/useManyStore';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { ManyModel } from '../ManyProperties.type';

const useManyProperties = (): ManyModel | null => {
  const many = useManyStore((state) => state.many);
  const manifest = useProjectStore((state) => state.project?.manifest);
  const editable = useProjectStore((state) => state.project !== null);
  return useMemo(() => {
    if (many === null) return null;
    const taggable = many.items.filter((item) => item.assetId !== null);
    const assets = taggable.flatMap((item) => (item.assetId === null ? [] : [item.assetId]));
    return {
      items: many.items,
      taggable,
      tags: splitTags(many.items, organiseOf(manifest).tags),
      editable,
      addTag: (typed) => run({ op: 'tag', assets, tags: typed.split(',') }),
      removeTag: (tag) => run({ op: 'untag', assets, tags: [tag] }),
    };
  }, [many, manifest, editable]);
};

export { useManyProperties };
