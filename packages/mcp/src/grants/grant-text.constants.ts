/* @layer core @kind constants */
const GRANT_TEXT = {
  anyone: 'this program',
  where: 'The owner can change it on Settings, Assistant programs.',
  toolOff: (tool: string, program: string) => `${tool} is turned off for ${program}.`,
  stepOff: (what: string, bundle: string, program: string) => `${what} belongs to ${bundle}, which is turned off for ${program}.`,
  needsBundle: (what: string, bundle: string, level: string) => `${what} needs Edit. ${bundle} is set to ${level} for this program.`,
  needsTool: (what: string, level: string) => `${what} needs Edit. It is set to ${level} for this program.`,
  levelNote: 'Read level: writes are refused.',
  commandNote: 'Read level: only commands that change what is shown run; the others are refused.',
  restartOff: (tool: string, program: string) => `${tool} needs the May restart Bxel permission, which is off for ${program}.`,
  writeNote: 'Read level: this tool only writes, so calls are refused.',
  stepsNote: (limited: string) => `Step groups limited for this program: ${limited}.`,
} as const;

export { GRANT_TEXT };
