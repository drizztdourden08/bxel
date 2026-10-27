/* @layer renderer-app @kind constants */
const APP_TOOL_TEXT = {
  offNoDocument: 'No document is open. Open one with open_file or create_document.',
  offHere: 'It does not apply to what is shown now. Call get_view, then focus the tab or select the kind of item it works on.',
  unknown: (id: string) => `No command has the id "${id}". Call list_commands.`,
  off: (id: string, reason: string) => `${id} is off right now. ${reason}`,
  needsArgs: (id: string, why: string) => `${id} needs args. ${why} Call list_commands for the shape.`,
  noArgs: (id: string) => `${id} takes no args.`,
  dialog: (id: string) =>
    `${id} opens a dialog for the owner and has no way to run without one. Pass show: true to open it for the owner, or make the change with apply_edits.`,
  dialogArgs: (id: string) => `${id} opens a dialog. Pass its args to run it straight away, or show: true to open it for the owner.`,
  ownerBusy: 'The owner is in the middle of an edit on this document. Reads still work; try the command again shortly.',
  noDocument: 'No document is open. Open one with open_file or create_document.',
  ranLine: (client: string, label: string) => `${client}: ${label}`,
  viewLine: (client: string, what: string) => `${client}: ${what}`,
  hidden: 'The owner has not allowed this program to work on the document that is on screen.',
  pendingFailed: 'The change was started but could not be applied. The owner sees it as a preview they can apply or cancel.',
  failed: (id: string) => `${id} did not run.`,
  noTab: 'No open tab has that id. Call get_view for the tabs.',
  noViewport: 'No canvas is on screen to zoom. Focus a document tab first.',
  badRoute: (route: string) => `No page has the route "${route}". Call get_settings with a scope for the pages.`,
  noSprite: 'The sprite is not in the active document. Call get_document.',
  noLayer: 'The layer is not in the active sprite. Call get_document.',
  noFrame: 'The frame is not in the active sprite. Call get_document.',
  noSelectionTarget: 'There is no sprite to select in. Focus a document tab first.',
  wandOutside: 'The point is outside the sprite.',
  noHistory: 'The document is not open.',
  playbackNeedsAnimation: 'Playback needs an animation tab.',
  noDialog: 'No confirm dialog is open.',
} as const;

export { APP_TOOL_TEXT };
