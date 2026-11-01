/* @layer renderer-app @kind types */
import type { ManyItem, TagSplit } from '../../properties-subject/many-subject.type';

type ManyModel = {
  readonly items: readonly ManyItem[];
  readonly taggable: readonly ManyItem[];
  readonly tags: TagSplit;
  readonly editable: boolean;
  readonly addTag: (typed: string) => void;
  readonly removeTag: (tag: string) => void;
};

export type { ManyModel };
