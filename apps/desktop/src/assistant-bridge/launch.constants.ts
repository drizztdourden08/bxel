/* @layer renderer-app @kind constants */
const LAUNCH = {
  startFlag: '--mcp-start',
  tokenEnv: 'BXEL_MCP_LAUNCH',
  helper: 'bxel-mcp',
  headlessArgs: ['--no-focus', '--muted'],
} as const;

const EXIT_CODE = {
  disabled: 64,
  startOff: 65,
} as const;

export { EXIT_CODE, LAUNCH };
