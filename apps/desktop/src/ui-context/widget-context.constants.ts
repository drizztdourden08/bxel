/* @layer renderer-app @kind constants */
const WIDGET_CONTEXT = {
  layers: 'bxel.widget.layers',
  palette: 'bxel.widget.palette',
  timeline: 'bxel.widget.timeline',
  options: 'bxel.widget.options',
  tools: 'bxel.widget.tools',
  view: 'bxel.widget.view',
  sheet: 'bxel.widget.sheet',
  tileset: 'bxel.widget.tileset',
} as const;

const TOOLBAR_FLAG = {
  tools: 'bxel.toolbar.tools',
  canvas: 'bxel.toolbar.canvas',
  options: 'bxel.toolbar.options',
} as const;

export { TOOLBAR_FLAG, WIDGET_CONTEXT };
