/* @layer renderer-app @kind constants */
const LEVEL_OPTIONS = [
  { value: 'ask_every', label: 'Ask for every connection', description: 'Each new connection asks, even from a program you approved before.' },
  { value: 'ask_once_session', label: 'Ask once per program until Bxel quits', description: 'Nothing is saved.' },
  { value: 'ask_once_remember', label: 'Ask once per program and remember', description: 'Your choice is saved, a Deny too, until you forget it here.' },
  { value: 'allow_all', label: 'Allow all', description: 'No prompt for any program. Read the warning first.' },
];

const MODE_OPTIONS = [
  { value: 'read', label: 'Read only' },
  { value: 'edit', label: 'Editing' },
];

const PROGRAM_MODE_OPTIONS = [...MODE_OPTIONS, { value: 'blocked', label: 'Blocked' }];

const ACTIVITY_SHOWN = 20;

const PANEL_TEXT = {
  levelLabel: 'Approving connections',
  allowAllModeLabel: 'Mode for programs under Allow all',
  warning:
    'Allow all lets any program on this computer that runs under your account connect to Bxel without asking you. Programs choose their own names, so Bxel cannot tell your assistant from any other program. With Allow all on, such a program can read everything your assistant settings allow. If the mode is Editing, it can also change, save and export your files. Use it only on a computer you control, and turn it off when you no longer need it.',
  confirmTitle: 'Allow all programs?',
  confirmLabel: 'Allow all programs',
  nameNote: 'Programs report their own name. A remembered name saves prompts; it does not prove who is calling.',
  programsTitle: 'Remembered programs',
  programsEmpty: 'No program is remembered yet.',
  programsHint: 'Programs you approved or denied before. Pick what each one may do, or forget it so it asks again.',
  programMode: (name: string): string => `What ${name} may do`,
  forget: 'Forget',
  forgetAll: 'Forget all',
  sessionsTitle: 'Connected now',
  sessionsEmpty: 'No program is connected.',
  sessionsHint: 'Programs that use Bxel right now.',
  disconnect: 'Disconnect',
  makeReadOnly: 'Make read only',
  allowEditing: 'Allow editing',
  activityTitle: 'Recent calls',
  activityEmpty: 'No calls yet.',
  activityHint: 'The last calls connected programs made, newest first.',
  configTitle: 'Client config',
  configHint: 'Paste this into the MCP settings of your assistant client, under mcpServers.',
  configLoading: 'Reading the helper launch from Bxel.',
  copy: 'Copy client config',
  lastSeen: (when: string) => `Last connected ${when}`,
  connected: (mode: string, trust: string) => `${mode}, ${trust}`,
} as const;

export { ACTIVITY_SHOWN, LEVEL_OPTIONS, MODE_OPTIONS, PANEL_TEXT, PROGRAM_MODE_OPTIONS };
