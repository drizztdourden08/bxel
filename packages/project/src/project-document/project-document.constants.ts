/* @layer core @kind constants */
const PROJECT_DOCUMENT_VERSION = 2;

const FOLDER_ROLES = ['sprites', 'animations', 'sheets', 'palettes', 'tilemaps', 'exports'] as const;

const DEFAULT_ROLE_PATHS = {
  sprites: 'sprites',
  sheets: 'sheets',
  palettes: 'palettes',
  tilemaps: 'tilemaps',
  exports: 'exports',
} as const satisfies Partial<Record<(typeof FOLDER_ROLES)[number], string>>;

const ROLE_FALLBACK: Readonly<Partial<Record<(typeof FOLDER_ROLES)[number], (typeof FOLDER_ROLES)[number]>>> = {
  animations: 'sprites',
};

const PROJECT_EXPORT_LIMITS = { scaleMin: 1, scaleMax: 8, templateMax: 120, presetsMax: 256 } as const;

const TEMPLATE_PATTERN = /^[^\\/:*?"<>|\p{Cc}]+$/u;

export { DEFAULT_ROLE_PATHS, FOLDER_ROLES, PROJECT_DOCUMENT_VERSION, PROJECT_EXPORT_LIMITS, ROLE_FALLBACK, TEMPLATE_PATTERN };
