/* @layer core @kind constants */
const PATH_LIMITS = {
  maxSegments: 16,
  maxLength: 240,
  maxSegmentLength: 64,
  maxFolders: 16,
  maxStoredPath: 520,
  maxProjectName: 53,
} as const;

const SEGMENT_PATTERN = /^[A-Za-z0-9_][A-Za-z0-9 _.-]*$/;
const RESERVED_DEVICE_PATTERN = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
const TRAILING_DOTS_AND_SPACES = /[. ]+$/;
const UNSAFE_SEGMENT_CHARACTERS = /[^A-Za-z0-9 _.-]/g;
const UNSAFE_SEGMENT_START = /^[^A-Za-z0-9_]+/;

const FILE_EXTENSIONS = {
  bxel: ['bxel'],
  bxsprite: ['bxsprite'],
  bxanim: ['bxanim'],
  bxsheet: ['bxsheet'],
  bxpalette: ['bxpalette'],
  bxtiles: ['bxtiles'],
  bxmap: ['bxmap'],
  bxproject: ['bxproject'],
  png: ['png'],
  apng: ['png', 'apng'],
  gif: ['gif'],
  sheet: ['json'],
  palette: ['gpl', 'pal', 'hex'],
} as const satisfies Record<string, readonly string[]>;

const MANIFEST_SUFFIX = '.bxelproject';
const TEMPORARY_MARKER = '.tmp-';

const DRIVE_PREFIX_REGEX = /^([A-Za-z]:)\//;
const UNC_PREFIX_REGEX = /^\/\/([^/]+)\/([^/]+)(?:\/|$)/;
const EXTENDED_PREFIX_REGEX = /^\/\/[?.]\//;

export {
  DRIVE_PREFIX_REGEX,
  EXTENDED_PREFIX_REGEX,
  FILE_EXTENSIONS,
  MANIFEST_SUFFIX,
  PATH_LIMITS,
  RESERVED_DEVICE_PATTERN,
  SEGMENT_PATTERN,
  TEMPORARY_MARKER,
  TRAILING_DOTS_AND_SPACES,
  UNC_PREFIX_REGEX,
  UNSAFE_SEGMENT_CHARACTERS,
  UNSAFE_SEGMENT_START,
};
