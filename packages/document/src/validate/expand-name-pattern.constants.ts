/* @layer core @kind config */
const NAME_PATTERN_TOKEN = /\{(name|n)(?::(\d{1,2}))?\}/g;

const DEFAULT_PIECE_PATTERN = '{name}_{n}';

const MAX_PATTERN_LENGTH = 256;

export { DEFAULT_PIECE_PATTERN, MAX_PATTERN_LENGTH, NAME_PATTERN_TOKEN };
