/* @layer renderer-app @kind constants */
import type { ProjectOrganise } from '@bxel/project';

const EMPTY_ORGANISE: ProjectOrganise = { tags: {}, collections: [], smart: [], pinned: [] };

const ORGANISE_TEXT = {
  noProject: 'No project is open.',
  noTags: 'Give at least one tag.',
  badTag: (tag: string): string => `${tag} is not a tag. Tags are short plain text.`,
  noCollection: (name: string): string => `There is no collection ${name}.`,
  collectionNameTaken: (name: string): string => `A collection named ${name} is already there.`,
  searchNameTaken: (name: string): string => `A smart filter named ${name} is already there.`,
  noSearch: (name: string): string => `There is no smart filter ${name}.`,
  badName: 'Give a short plain name.',
  badQuery: 'Give a search to keep.',
  tooMany: 'The project holds as much of that as it can.',
  tagged: (assets: number, tags: number): string => `Tagged ${assets} ${assets === 1 ? 'file' : 'files'} with ${tags} ${tags === 1 ? 'tag' : 'tags'}.`,
  untagged: (assets: number): string => `Removed tags from ${assets} ${assets === 1 ? 'file' : 'files'}.`,
  pinned: (assets: number): string => `Pinned ${assets} ${assets === 1 ? 'file' : 'files'}.`,
  unpinned: (assets: number): string => `Unpinned ${assets} ${assets === 1 ? 'file' : 'files'}.`,
  collected: (assets: number, name: string): string => `Added ${assets} ${assets === 1 ? 'file' : 'files'} to ${name}.`,
  uncollected: (assets: number, name: string): string => `Took ${assets} ${assets === 1 ? 'file' : 'files'} out of ${name}.`,
  newCollection: (name: string): string => `Made the collection ${name}.`,
  renamedCollection: (name: string): string => `Renamed the collection to ${name}.`,
  deletedCollection: (name: string): string => `Deleted the collection ${name}.`,
  savedSearch: (name: string): string => `Saved the smart filter ${name}.`,
  removedSearch: (name: string): string => `Removed the smart filter ${name}.`,
  forgot: (assets: number): string => `Forgot ${assets} ${assets === 1 ? 'file' : 'files'}.`,
  saveFailed: (reason: string): string => `Could not save the project file. ${reason}`,
} as const;

const ID_BODY_LENGTH = 8;

const CONTROL_CHARACTERS = /\p{Cc}/gu;

export { CONTROL_CHARACTERS, EMPTY_ORGANISE, ID_BODY_LENGTH, ORGANISE_TEXT };
