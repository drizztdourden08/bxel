/* @layer renderer-app @kind constants */
import type { AssetKind } from '@bxel/document';
import type { HealthCheck, HealthReport } from './project-health.type';

const HEALTH_CHECKS: readonly HealthCheck[] = ['broken', 'moved', 'unused', 'misplaced', 'duplicates', 'unsaved', 'access', 'capped'];

const LEAF_KINDS: ReadonlySet<AssetKind> = new Set(['sprite', 'animation', 'palette', 'tileset']);

const EMPTY_REPORT: HealthReport = { broken: [], moved: [], unused: [], misplaced: [], duplicates: [], unsaved: 0, access: [], capped: [], repaired: [], total: 0, files: 0 };

const META_MAX = 84;

const HEALTH_TEXT = {
  title: 'Health',
  projectMenu: 'Project health',
  noProjectTitle: 'No project is open',
  noProjectMessage: 'Open a project to check its links and files.',
  scanning: 'Checking the project...',
  recheck: 'Check again',
  allGood: 'No problems found',
  allGoodMessage: (files: number): string => `${files} ${files === 1 ? 'file' : 'files'} checked. Every link leads to its file.`,
  summary: (total: number, files: number): string => `${total} ${total === 1 ? 'thing needs' : 'things need'} a look in ${files} ${files === 1 ? 'file' : 'files'}.`,
  badge: (total: number): string => `${total} ${total === 1 ? 'problem' : 'problems'}`,
  brokenTitle: 'Broken links',
  brokenHint: 'These links lead to a file that is not in the project. Remove the link, or put the file back and check again.',
  movedTitle: 'Links with an old path',
  movedHint: 'The file moved, so the path in the link is out of date. The file is still found by its id.',
  repairedTitle: 'Repaired',
  repairedHint: 'These links had an old path. Bxel followed the id of the file and wrote the new path when the project opened.',
  repairedLine: (file: string, target: string): string => `${file} now links to ${target}`,
  unusedTitle: 'Unused files',
  unusedHint: 'Nothing links to these, and they are not pinned, collected or the cover. Maps and sheets are often leaves, so this is only a hint.',
  misplacedTitle: 'Outside the folder of their kind',
  misplacedHint: 'These files sit in the folder of another kind.',
  duplicatesTitle: 'Files that share an id',
  duplicatesHint: 'Two files claim the same asset. One of them was probably copied outside Bxel.',
  unsavedTitle: 'Unsaved files',
  unsavedHint: 'These have changes that are not on disk yet.',
  accessTitle: 'Folders without access',
  accessHint: 'Bxel lost its permission for these linked folders, so their files are not checked.',
  cappedTitle: 'Files past the opening limit',
  cappedHint: (limit: number): string => `Bxel opens the first ${limit} assets of a project with the project. These files come after them and open when you pick them, so links to them and counts of their use are not shown until then.`,
  findById: 'Find by id',
  removeLink: 'Remove the link',
  fixAll: 'Fix all',
  show: 'Show',
  showFiles: 'Show in Browse',
  moveToRole: 'Move to its folder',
  moveAllToRole: 'Move all',
  trashAll: 'Move all to the trash',
  regrant: 'Give access',
  linkLine: (file: string, target: string): string => `${file} links to ${target}`,
  lastPath: (path: string): string => `Last path: ${path}`,
  foundAt: (path: string): string => `Found at ${path}`,
  candidates: (paths: readonly string[]): string => `Several files have it: ${paths.join(', ')}`,
  sharedBy: (paths: readonly string[]): string => paths.join(', '),
  expected: (folder: string): string => `Belongs in ${folder}`,
  unsavedCount: (count: number): string => `${count} ${count === 1 ? 'file has' : 'files have'} unsaved changes.`,
  repaired: (count: number): string => `Fixed ${count} ${count === 1 ? 'link' : 'links'}.`,
  repairFailed: (reason: string): string => `Could not fix the links. ${reason}`,
  nothingFixed: 'No link needed a fix.',
  reloadKept: (file: string): string => `${file} has unsaved changes, so it was not reloaded. Save it and open it again to see the fixed link.`,
  unavailable: 'Folder access is not available here.',
  notIndexed: (file: string): string => `${file} is not a file of this project.`,
  noLink: (file: string, link: string): string => `${file} has no link ${link}.`,
  noFile: (path: string): string => `${path} is not a file of this project.`,
  wrongId: (path: string): string => `${path} holds another asset than the link wants.`,
  notFoundById: 'No other file holds that asset, so there is nothing to follow.',
  moreThanOne: 'More than one file holds that asset. Choose one with its path.',
  needsPath: 'Give the path of the file to use.',
  writeFailed: (file: string, reason: string): string => `Could not write ${file}. ${reason}`,
} as const;

export { EMPTY_REPORT, HEALTH_CHECKS, HEALTH_TEXT, LEAF_KINDS, META_MAX };
