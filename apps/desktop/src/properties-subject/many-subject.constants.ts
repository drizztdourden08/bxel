/* @layer renderer-app @kind constants */
const MANY_ROUTE = 'many';

const MANY_KIND = 'many';

const PROPERTIES_TEXT = {
  folder: 'Folder',
  title: (count: number): string => `${count} items`,
  kinds: 'Kinds',
  tags: 'Tags',
  sharedTags: 'On every file',
  partialTags: 'On some files',
  addTag: 'Add a tag to every file',
  addTagLabel: 'Tag',
  noTags: 'These files have no tags.',
  noTaggable: 'None of these can be tagged.',
  files: 'Selection',
  kindCount: (kind: string, count: number): string => `${count} ${kind.toLowerCase()}${count === 1 ? '' : 's'}`,
} as const;

export { MANY_KIND, MANY_ROUTE, PROPERTIES_TEXT };
