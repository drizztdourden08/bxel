# Test clean-up part 6: the end to end specs

Verdicts for the specs under apps/desktop/tests/e2e against the test standard (E1, E2, W3, W4, W7, and the doubt question). Nothing was run in this pass (no tests, lint or typecheck). A case is one `test` or `it` call site; a `test.each` counts as one.

## Totals

| | before | after |
|---|---|---|
| spec files | 76 | 22 |
| cases | 252 | 68 |
| tagged e2e | 0 | 22 of 22 |
| untagged | 76 | 0 |
| helper files in support/ | 190 | 128 |

Every kept spec carries `{ tags: ['e2e'] }` on its top describe and names E1 in the title.

## Journeys and the spec kept for each

| Journey | Spec kept |
|---|---|
| Create a sprite, draw on layers, save and reopen | sprite-roundtrip |
| Draw and undo across a save | save-undo |
| Crash and recovery of unsaved work | crash-recovery |
| Export a sprite as PNG with crisp pixels | crisp-output |
| Damaged input and failed writes leave the file whole | safety |
| Import an image into the palette | image-import |
| Slice, export a sheet and reopen | sheet-export |
| Tilemap round trip (edit a tile, every placement follows) | tilemap |
| Import a Tiled map | tiled-import |
| Save all writes linked files beside the first | save-folder-grant |
| Build, save and reopen an animation | animation-build |
| Export an animation as GIF and APNG | animation-export |
| Open, edit and migrate a project | asset-workspace |
| Open the bundled demo project | demo-project |
| Project files and the assistant grant (create, add, browse, rename, link) | project-assistant |
| Move and rename a project file a sheet uses | project-moves |
| Assistant pairing and edit flow over MCP | mcp-check7 |
| Assistant permission grants | mcp-grants |
| Headless helper start, edit, stop | mcp-headless |
| Assistant restarts the app | mcp-restart |
| Settings read and changed by the assistant | mcp-settings |
| Draw with the keyboard alone | keyboard-canvas |

## Per file

Rule column: the E1 or K rule that keeps the spec, or the WIPE rule (or doubt question) that removes it. "Unit" means a unit or component test already covers the behavior (packages/formats, packages/project, packages/raster, packages/palette, apps/desktop/tests).

| file | verdict | rule | cases before -> after |
|---|---|---|---|
| accessibility.e2e.ts | delete | W3 (axe audit of markup and roles in many static states) | 5 -> 0 |
| animation-assistant.e2e.ts | delete | W4 (MCP project read and write repeats project-assistant) | 4 -> 0 |
| animation-build.e2e.ts | keep | E1 | 4 -> 4 |
| animation-create.e2e.ts | delete | W4 (animation-build is the more complete journey) | 3 -> 0 |
| animation-directions.e2e.ts | delete | W4, doubt (export covered by animation-export, facings by unit) | 4 -> 0 |
| animation-drop.e2e.ts | delete | W4 (a drag gesture of the strip) | 1 -> 0 |
| animation-editor.e2e.ts | delete | W4, W3 (ghost offsets, playback in other states) | 5 -> 0 |
| animation-export.e2e.ts | keep | E1 | 3 -> 3 |
| animation-import.e2e.ts | delete | doubt (GIF and APNG decoding covered by packages/formats tests) | 2 -> 0 |
| animation-strip.e2e.ts | delete | W4, doubt (strip split covered by unit and project reopen) | 3 -> 0 |
| asset-kinds.e2e.ts | delete | W3 (which panels show per asset kind, menu order) | 4 -> 0 |
| asset-overview.e2e.ts | delete | W3 | 1 -> 0 |
| asset-workspace.e2e.ts | keep | E1 | 3 -> 3 |
| assets-panel.e2e.ts | delete | W4, doubt (list filters are UI; pack and unpack covered by packages/project pack test and pack-project test) | 2 -> 0 |
| assistant-permissions.e2e.ts | delete | W3, W4 (page lists, search, warning text; Read refusal repeated in mcp-grants) | 10 -> 0 |
| canvas-view.e2e.ts | delete | W3 (headers, rulers, zoom field, widget sections) | 6 -> 0 |
| config-hubs.e2e.ts | delete | W3, W4 (windows and defaults pages) | 3 -> 0 |
| context-menus.e2e.ts | delete | W4 (one menu in four states) | 4 -> 0 |
| contextual-ui.e2e.ts | delete | W3 (chrome shown per file type) | 3 -> 0 |
| crash-recovery.e2e.ts | keep | E1 | 1 -> 1 |
| crisp-output.e2e.ts | keep | E1 | 2 -> 2 |
| demo-project.e2e.ts | keep | E1 | 2 -> 2 |
| drawing-tools.e2e.ts | delete | W4 (one tool per case; tools covered by packages/raster tests; draw and undo kept in save-undo) | 8 -> 0 |
| export-preset.e2e.ts | delete | doubt (preset stored in the sprite file is covered by unit file format tests) | 1 -> 0 |
| file-type-picker.e2e.ts | delete | W3 | 1 -> 0 |
| guides.e2e.ts | delete | W4, W3 (guide drag and menus in five states) | 5 -> 0 |
| image-import.e2e.ts | keep | E1 | 2 -> 2 |
| keyboard-canvas.e2e.ts | keep | E1 | 4 -> 4 |
| keyboard-regions.e2e.ts | delete | W3, W4 (F6 focus order, toolbar arrows) | 5 -> 0 |
| keyboard-tilemap.e2e.ts | delete | W4 (same journey as keyboard-canvas on a map) | 1 -> 0 |
| layer-stack.e2e.ts | delete | W3, W4 (layer rows, eye drag, tags, selection) | 6 -> 0 |
| map-select.e2e.ts | delete | W4, doubt (mask logic covered by unit) | 4 -> 0 |
| mcp-app-control.e2e.ts | delete | W4 (feature list of app control tools) | 5 -> 0 |
| mcp-check7.e2e.ts | keep | E1 | 6 -> 6 |
| mcp-grants.e2e.ts | keep | E1 | 5 -> 5 |
| mcp-headless.e2e.ts | keep | E1 (also gained a describe so it can carry the tag) | 1 -> 1 |
| mcp-layout.e2e.ts | delete | W3 (docks, widths, toolbar positions) | 3 -> 0 |
| mcp-no-dialogs.e2e.ts | delete | W4 (save and export already in mcp-check7) | 3 -> 0 |
| mcp-palette.e2e.ts | delete | W4, doubt (swatch reorder covered by packages/palette tests) | 3 -> 0 |
| mcp-refusals.e2e.ts | delete | W4 (stale and invalid batch refusal in mcp-check7; palette cap and bounds covered by unit) | 5 -> 0 |
| mcp-restart.e2e.ts | keep | E1 | 5 -> 5 |
| mcp-settings.e2e.ts | keep | E1 | 4 -> 4 |
| mcp-timeline.e2e.ts | delete | W4 (a tool family, not a journey) | 5 -> 0 |
| mirror-undo.e2e.ts | delete | W4, doubt (mirror and tiled drawing covered by packages/raster) | 2 -> 0 |
| palette-panel.e2e.ts | delete | W3, W4 (focus, grid, list view, audit) | 7 -> 0 |
| project-assistant.e2e.ts | keep | E1 | 13 -> 13 |
| project-browser.e2e.ts | delete | W4 (grid, list and columns of one browser) | 4 -> 0 |
| project-folder-rows.e2e.ts | delete | W4 (New asset here repeats project-assistant file creation) | 3 -> 0 |
| project-health.e2e.ts | delete | W4 (link repair repeats project-moves; tags and collections are unit data) | 3 -> 0 |
| project-moves.e2e.ts | keep | E1 | 1 -> 1 |
| project-panel.e2e.ts | delete | W3, W4 (thumbnails, row editing, drop move) | 1 -> 0 |
| rotate-angle.e2e.ts | delete | doubt (rotation covered by packages/raster) | 1 -> 0 |
| safety.e2e.ts | keep | E1 | 3 -> 3 |
| save-as-folder-grant.e2e.ts | delete | W4 (same grant behavior as save-folder-grant) | 1 -> 0 |
| save-folder-grant.e2e.ts | keep | E1 | 1 -> 1 |
| save-undo.e2e.ts | trim | E1 (the project save case removed, W4) | 2 -> 1 |
| selection-transform.e2e.ts | delete | W4, doubt (transform covered by unit) | 3 -> 0 |
| sheet-batch.e2e.ts | delete | W4, doubt (slicing and batch edits covered by unit) | 4 -> 0 |
| sheet-drop.e2e.ts | delete | W4 (a drag gesture) | 1 -> 0 |
| sheet-export.e2e.ts | keep | E1 | 2 -> 2 |
| sheet-list.e2e.ts | delete | W3 (thumbnails, marks, sort headers) | 1 -> 0 |
| sheet-overlap.e2e.ts | delete | W3 | 1 -> 0 |
| sheet-tile-drag.e2e.ts | delete | W4 (five drops of one widget) | 5 -> 0 |
| sheet-widget.e2e.ts | delete | W3, W4 | 1 -> 0 |
| slice-tool.e2e.ts | delete | W4, doubt (slice rules covered by packages/raster tests small-artwork and sprite-slice) | 3 -> 0 |
| sprite-roundtrip.e2e.ts | keep | E1 | 2 -> 2 |
| swatch-edit.e2e.ts | delete | W4, doubt (recolour covered by packages/palette) | 2 -> 0 |
| tile-animation.e2e.ts | delete | W7 (timer luck of playing tiles), W4 | 4 -> 0 |
| tiled-import.e2e.ts | keep | E1 | 1 -> 1 |
| tiled-wrap.e2e.ts | delete | W4 (preview toggle of mirror-undo class, covered by raster) | 2 -> 0 |
| tilemap.e2e.ts | keep | E1 | 2 -> 2 |
| tileset.e2e.ts | delete | W3, W4 (tileset widget states) | 5 -> 0 |
| timeline-drops.e2e.ts | delete | W4 (one drop in five states) | 5 -> 0 |
| tools-options.e2e.ts | delete | W3, W4 | 5 -> 0 |
| tools-quiet.e2e.ts | delete | W7, W3 (DOM churn and heap measurements) | 2 -> 0 |
| transform-roundtrip.e2e.ts | delete | doubt (flips and turns covered by packages/raster) | 2 -> 0 |

## Helpers

Removed 62 files from tests/e2e/support that no remaining spec, global-setup.ts, setup-owned.ts, or any other helper that is still used imports (found by following imports from every kept file). Seven helpers stay although no e2e spec uses them directly, because unit tests outside this folder import them: read-saved, apng-bytes, bytes-of, gif-bytes, imported-animation.constants, solid-rgba and blocking-findings. global-setup.ts and setup-owned.ts are unchanged.

## Not changed on purpose

- crash-recovery waits a fixed 9 s for the first snapshot and 1.5 s after the kill (W7 by the letter). It is the release blocker journey, so it stays; the wait should become a poll on the snapshot file once the snapshot folder is exposed to the spec.
- mcp-restart keeps its 300 s describe timeout.
