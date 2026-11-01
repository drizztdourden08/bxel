/* @layer renderer-app @kind constants */
const IMPORT_EXTENSIONS: readonly string[] = ['png', 'gif', 'gpl', 'pal', 'hex', 'txt', 'ase'];

const PALETTE_EXTENSIONS: readonly string[] = ['gpl', 'pal', 'hex', 'txt', 'ase'];

const PALETTE_READ_EXTENSIONS: readonly string[] = [...PALETTE_EXTENSIONS, 'png'];

export { IMPORT_EXTENSIONS, PALETTE_EXTENSIONS, PALETTE_READ_EXTENSIONS };
