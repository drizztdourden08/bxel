/* @layer core @kind constants */
const MANIFEST_FORMAT = 'bxel-project';
const MANIFEST_VERSION = 1;
const ROOT_FOLDER_PATH = '.';
const MAX_FOLDER_NAME = 64;
const ACCESS_LEVELS = ['off', 'read', 'edit'] as const;
const MANIFEST_EXTENSION = 'bxelproject';

export { ACCESS_LEVELS, MANIFEST_EXTENSION, MANIFEST_FORMAT, MANIFEST_VERSION, MAX_FOLDER_NAME, ROOT_FOLDER_PATH };
