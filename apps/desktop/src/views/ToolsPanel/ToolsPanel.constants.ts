/* @layer renderer-app @kind constants */
const TOOLS_PANEL_TEXT = {
  region: 'Tools',
  zone: 'bxel.tool-panel',
  menuLabel: 'Tool menu',
  recent: 'Recent',
  recentEmpty: 'Tools you pick show here.',
  presets: 'Presets',
  options: 'Options',
  hiddenTitle: 'More tools',
  hiddenHint: 'Off the rail. Their keys still pick them.',
  showOnRail: 'Show on the rail',
  preferences: 'Preferences',
  openOnHover: 'Open tool menus on hover',
  openOnHoverHint: 'A menu opens when the pointer rests on a tool. Off, hold a tool, right click it or press the arrow key.',
  holdDelay: 'Hold delay',
  holdDelayHint: 'How long a press must be held to open the tool menu, in milliseconds.',
  shareBrush: 'Share brush settings between tools',
  shareBrushHint: 'Pencil, Eraser and Shapes use one size, tip and pixel perfect. Off, each keeps its own.',
  cycles: (key: string): string => `${key.toUpperCase()} cycles the variants`,
  inactive: 'Open or create an asset to draw',
  active: 'Active',
  hidden: 'Hidden',
} as const;

export { TOOLS_PANEL_TEXT };
