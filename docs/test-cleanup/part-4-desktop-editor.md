# Test clean-up part 4: desktop editor areas

Scope: the 134 test files under apps/desktop/tests in the folders editor, selection, tilemap, timeline, sheet, sheet-manager, export, swatches, tools, symmetry, slice, guides, ruler, canvas-look, canvas-dirty, pixel-viewport, view-zoom, toolbars and stage-header. The e2e folder and all other folders are untouched. Method: X:/ai-config/docs/test-standard.md. A case is one it or test call site; an it.each counts as one.

## Totals

- Files before: 134. Files after: 134. No whole file was wiped; 24 files lost cases.
- Cases before: 946. Cases after: 900. Deleted: 46.
- Cases per tag after: critical 253, standard 647, e2e 0.
- Files holding at least one describe of a tag: critical 49, standard 101, e2e 0.

## Per file

| File | Verdict | Rules | Tag | Cases |
|---|---|---|---|---|
| canvas-dirty/upload-image.test.ts | keep | K1 | critical | 4 -> 4 |
| canvas-look/canvas-look.test.ts | partial | K1 | critical | 11 -> 8 |
| canvas-look/pattern-bits.test.ts | keep | K1 | critical | 9 -> 9 |
| canvas-look/sprite-look.test.ts | keep | K1 | critical | 2 -> 2 |
| view-zoom/navigator.test.ts | keep | K1 | critical | 4 -> 4 |
| view-zoom/view-zoom.test.ts | partial | K1 | critical | 5 -> 4 |
| editor/apply-bar.test.ts | partial | S2 | standard | 3 -> 2 |
| editor/commit-handoff.test.ts | keep | S2 | standard | 5 -> 5 |
| editor/context-chips.test.ts | keep | S2 | standard | 3 -> 3 |
| editor/drawing-extras.test.ts | keep | K1, S2 | critical, standard | 8 -> 8 |
| editor/drawing-paths.test.ts | keep | S2 | standard | 9 -> 9 |
| editor/drawing-tools.test.ts | keep | K1, S2 | critical, standard | 12 -> 12 |
| editor/held-colours.test.ts | partial | K1, S2 | critical, standard | 10 -> 8 |
| editor/history.test.ts | partial | K2, S2 | standard | 4 -> 3 |
| editor/layers.test.ts | partial | S2 | standard | 11 -> 10 |
| editor/line-and-fill.test.ts | keep | S2 | standard | 6 -> 6 |
| editor/options.test.ts | keep | K1, S2 | critical, standard | 11 -> 11 |
| editor/pixel-perfect-stroke.test.ts | keep | S2 | standard | 3 -> 3 |
| editor/refresh-rect.test.ts | keep | K1 | critical | 3 -> 3 |
| editor/rotate-preview.test.ts | keep | S2 | standard | 2 -> 2 |
| editor/shapes.test.ts | partial | S2, K1 | standard, critical | 10 -> 9 |
| editor/stroke.test.ts | keep | S2 | standard | 4 -> 4 |
| editor/tiled-wrap.test.ts | keep | S2 | standard | 5 -> 5 |
| editor/tools.test.ts | partial | S2, K1 | standard, critical | 8 -> 7 |
| selection/canvas-size.test.ts | keep | S2 | standard | 4 -> 4 |
| selection/clipboard.test.ts | keep | S2 | standard | 4 -> 4 |
| selection/delete-routing.test.ts | partial | K2 | standard | 6 -> 4 |
| selection/keys.test.ts | keep | S2 | standard | 1 -> 1 |
| selection/mask-descriptor.test.ts | keep | S2 | standard | 5 -> 5 |
| selection/move.test.ts | keep | S2 | standard | 3 -> 3 |
| selection/paste-flow.test.ts | keep | S2, K3 | standard | 7 -> 7 |
| selection/selection-extras.test.ts | partial | S2 | standard | 5 -> 4 |
| selection/selection-history.test.ts | keep | S2 | standard | 2 -> 2 |
| selection/selection-tools.test.ts | keep | S2 | standard | 10 -> 10 |
| selection/selection.test.ts | keep | K1, S2 | critical, standard | 10 -> 10 |
| selection/transform-session.test.ts | keep | S2 | standard | 8 -> 8 |
| selection/transform.test.ts | keep | S2 | standard | 6 -> 6 |
| tilemap/collision.test.ts | keep | K1, S2 | critical, standard | 8 -> 8 |
| tilemap/edit-tiles.test.ts | keep | S2 | standard | 11 -> 11 |
| tilemap/export-collision.test.ts | keep | K3 | standard | 2 -> 2 |
| tilemap/export-map.test.ts | keep | K3 | standard | 6 -> 6 |
| tilemap/map-clip.test.ts | keep | S2 | standard | 7 -> 7 |
| tilemap/map-commands.test.ts | partial | S2 | standard | 7 -> 6 |
| tilemap/map-drawing.test.ts | keep | S2 | standard | 5 -> 5 |
| tilemap/map-layers.test.ts | keep | S2 | standard | 6 -> 6 |
| tilemap/map-selection.test.ts | keep | S2 | standard | 8 -> 8 |
| tilemap/map-stamp.test.ts | keep | S2, K3 | standard, critical | 3 -> 3 |
| tilemap/orientation.test.ts | keep | S2 | standard | 5 -> 5 |
| tilemap/place-tiles.test.ts | keep | S2 | standard | 8 -> 8 |
| tilemap/save-reopen.test.ts | keep | K3 | standard | 4 -> 4 |
| tilemap/stamp-brush.test.ts | keep | K1 | critical | 8 -> 8 |
| tilemap/terrain.test.ts | keep | S2 | standard | 11 -> 11 |
| tilemap/tile-animation.test.ts | keep | S2 | standard | 4 -> 4 |
| tilemap/tile-picking.test.ts | keep | K1 | critical | 5 -> 5 |
| tilemap/tileset-view.test.ts | keep | K1 | critical | 6 -> 6 |
| tilemap/turn-cells.test.ts | keep | K1, S2 | critical, standard | 7 -> 7 |
| timeline/add-frames.test.ts | keep | S2 | standard | 7 -> 7 |
| timeline/clock-guards.test.ts | keep | S2 | standard | 6 -> 6 |
| timeline/clock.test.ts | keep | S2 | standard | 7 -> 7 |
| timeline/editing.test.ts | keep | S2 | standard | 14 -> 14 |
| timeline/frames.test.ts | keep | S2 | standard | 10 -> 10 |
| timeline/group-facing.test.ts | partial | S2 | standard | 5 -> 4 |
| timeline/image-drop.test.ts | keep | K1, S2 | critical, standard | 15 -> 15 |
| timeline/keys.test.ts | keep | K1 | critical | 4 -> 4 |
| timeline/layout.test.ts | partial | K1 | critical | 11 -> 10 |
| timeline/menu-targets.test.ts | partial | S2 | standard | 11 -> 8 |
| timeline/menu.test.ts | partial | S2 | standard | 7 -> 5 |
| timeline/onion.test.ts | keep | S2 | standard | 9 -> 9 |
| timeline/placement.test.ts | keep | S2 | standard | 10 -> 10 |
| timeline/playback.test.ts | keep | S2 | standard | 12 -> 12 |
| timeline/tags.test.ts | keep | S2 | standard | 11 -> 11 |
| timeline/transforms.test.ts | keep | S2 | standard | 6 -> 6 |
| timeline/zone-keys.test.ts | keep | K1 | critical | 2 -> 2 |
| sheet/broadcast.test.ts | keep | S2 | standard | 8 -> 8 |
| sheet/group.test.ts | keep | S2 | standard | 7 -> 7 |
| sheet/selection.test.ts | keep | K1, S2 | critical, standard | 14 -> 14 |
| sheet/sheet-actions.test.ts | keep | S2 | standard | 15 -> 15 |
| sheet/sheet-animation.test.ts | keep | S2 | standard | 2 -> 2 |
| sheet/sheet-check.test.ts | keep | K3 | standard | 6 -> 6 |
| guides/guides.test.ts | keep | K1 | critical | 5 -> 5 |
| guides/persisted-guide-scope.test.ts | keep | K1 | critical | 3 -> 3 |
| guides/snap-to-guides.test.ts | keep | K1 | critical | 5 -> 5 |
| ruler/ruler-units.test.ts | keep | K1 | critical | 5 -> 5 |
| ruler/ruler.test.ts | keep | K1 | critical | 13 -> 13 |
| export/animation-export.test.ts | keep | K3 | standard | 7 -> 7 |
| export/animation-map.test.ts | keep | K3 | standard | 4 -> 4 |
| export/animation-sheet-entries.test.ts | keep | K3 | standard | 2 -> 2 |
| export/export-current.test.ts | keep | S2 | standard | 9 -> 9 |
| export/export-plan.test.ts | keep | S2 | standard | 16 -> 16 |
| export/export-preset-documents.test.ts | keep | K1, S2 | critical, standard | 9 -> 9 |
| export/export-preset-list.test.ts | keep | K1 | critical | 5 -> 5 |
| export/export-preset-save.test.ts | keep | S2 | standard | 7 -> 7 |
| export/export-presets.test.ts | keep | K1 | critical | 3 -> 3 |
| export/export-run.test.ts | keep | S2 | standard | 6 -> 6 |
| export/export-sheet.test.ts | keep | K3 | standard | 7 -> 7 |
| export/export-template.test.ts | keep | K1, S2 | critical, standard | 9 -> 9 |
| pixel-viewport/pixel-viewport-keys.test.ts | keep | S2 | standard | 5 -> 5 |
| pixel-viewport/pixel-viewport.test.ts | keep | K1 | critical | 12 -> 12 |
| pixel-viewport/reveal-delta.test.ts | keep | K1 | critical | 3 -> 3 |
| pixel-viewport/tile-placements.test.ts | keep | K1 | critical | 3 -> 3 |
| slice/slice-tool.test.ts | keep | S2 | standard | 6 -> 6 |
| symmetry/symmetry-sync.test.ts | keep | S2 | standard | 3 -> 3 |
| stage-header/canvas-parts.test.ts | keep | K1 | critical | 14 -> 14 |
| stage-header/stage-header.test.ts | keep | K1 | critical | 15 -> 15 |
| toolbars/toolbar-definitions.test.ts | partial | K1 | critical | 9 -> 6 |
| toolbars/toolbar-items.test.ts | keep | K1 | critical | 7 -> 7 |
| tools/tool-catalogue.test.ts | partial | K1 | critical | 6 -> 2 |
| tools/tool-options.test.ts | partial | S2 | standard | 12 -> 7 |
| tools/tool-picking.test.ts | keep | S2 | standard | 13 -> 13 |
| swatches/load-set.test.ts | keep | S2 | standard | 9 -> 9 |
| swatches/palette-panel-actions.test.ts | partial | S2 | standard | 4 -> 3 |
| swatches/recolour-swatch.test.ts | keep | S2 | standard | 3 -> 3 |
| swatches/set-source.test.ts | keep | K1 | critical | 7 -> 7 |
| swatches/swatch-alpha.test.ts | keep | S2, K1 | standard, critical | 11 -> 11 |
| swatches/swatch-library.test.ts | partial | K1 | critical | 10 -> 7 |
| sheet-manager/align.test.ts | keep | K1, S2 | critical, standard | 4 -> 4 |
| sheet-manager/atlas-export-match.test.ts | keep | S2 | standard | 9 -> 9 |
| sheet-manager/atlas.test.ts | keep | S2 | standard | 12 -> 12 |
| sheet-manager/compose.test.ts | keep | S2 | standard | 7 -> 7 |
| sheet-manager/copies.test.ts | keep | S2 | standard | 5 -> 5 |
| sheet-manager/entry-asset.test.ts | keep | K1 | critical | 1 -> 1 |
| sheet-manager/folders.test.ts | keep | S2 | standard | 9 -> 9 |
| sheet-manager/identical.test.ts | keep | S2 | standard | 9 -> 9 |
| sheet-manager/list-model.test.ts | keep | S2 | standard | 10 -> 10 |
| sheet-manager/manager-views.test.ts | keep | K1 | critical | 8 -> 8 |
| sheet-manager/membership.test.ts | keep | S2 | standard | 11 -> 11 |
| sheet-manager/order.test.ts | keep | S2 | standard | 6 -> 6 |
| sheet-manager/panel-render.test.ts | partial | S2 | standard | 8 -> 3 |
| sheet-manager/pivot.test.ts | partial | S2 | standard | 7 -> 6 |
| sheet-manager/rename.test.ts | keep | S2 | standard | 8 -> 8 |
| sheet-manager/rows-plan.test.ts | keep | K1 | critical | 5 -> 5 |
| sheet-manager/traits.test.ts | partial | S2 | standard | 7 -> 6 |
| sheet-manager/transform.test.ts | keep | S2 | standard | 7 -> 7 |
| sheet-manager/virtual-grid.test.ts | partial | S2 | standard | 3 -> 2 |

## Deleted cases and why

Every deleted case is a WIPE case. Each reason names the wipe rule, and for the duplicates (W4) the kept case that still covers the behavior, which meets a K or S rule.

- canvas-look/canvas-look.test.ts: "are valid and part of the app defaults". W5 constants.
- canvas-look/canvas-look.test.ts: "use hex colours, with a dark and close pair". W5 constants.
- canvas-look/canvas-look.test.ts: "keep every number inside its range". W5 constants.
- view-zoom/view-zoom.test.ts: "keeps every preset inside the allowed range". W5 constants.
- editor/apply-bar.test.ts: "draws nothing while no edit waits". W3 markup.
- editor/held-colours.test.ts: "start with four different colours". W5 defaults and setter.
- editor/held-colours.test.ts: "set each of the four slots on its own". W5 defaults and setter.
- editor/history.test.ts: "fills with the front colour and undoes it". W4 same undo behavior.
- editor/layers.test.ts: "refuses a stroke on a locked layer with a notice and paints nothing". W4 covered by locked or hidden cases.
- editor/shapes.test.ts: "draws the constrained shape on the overlay". W4 same constrain behavior.
- editor/tools.test.ts: "sets the front and back colours and swaps them". W5 setter, swap covered in held-colours.
- selection/delete-routing.test.ts: "has one owner per zone, so the focused panel decides what is deleted". W4 derived from the owner table.
- selection/delete-routing.test.ts: "keeps Escape for the shell escape stack, not for a command chord". W5 constant chord.
- selection/selection-extras.test.ts: "the canvas size preview clears when the dialog closes". W5 store setter.
- tilemap/map-commands.test.ts: "registers every tilemap command once on a known group". W2 registry structure rule.
- timeline/group-facing.test.ts: "toggles the setting, reports it as checked and keeps it when the timeline resets". W5 setting toggle.
- timeline/layout.test.ts: "start as the defaults". W5 defaults equal constants.
- timeline/menu-targets.test.ts: "lists the four ways to add frames". W5 label constants; W2 entry count rule.
- timeline/menu-targets.test.ts: "lists the frame sizes and Fit under the zoom entry". W5 label constants; W2 entry count rule.
- timeline/menu-targets.test.ts: "lists the image files entry under Add frames from and stays within twelve entries". W5 label constants; W2 entry count rule.
- timeline/menu.test.ts: "lists the frame commands and no cel commands". W5 label list.
- timeline/menu.test.ts: "keeps at most twelve top level entries". W2 entry count rule.
- toolbars/toolbar-definitions.test.ts: "name three toolbars with unique ids". W5 constants; W2 structure rule.
- toolbars/toolbar-definitions.test.ts: "start the canvas and option toolbars on top and the tools on the left". W5 constants; W2 structure rule.
- toolbars/toolbar-definitions.test.ts: "show every toolbar from the start and give each a label". W5 constants; W2 structure rule.
- tools/tool-catalogue.test.ts: "gives every slot and member a unique id, a name and a description". W2 registry structure rules; W5 constant tables.
- tools/tool-catalogue.test.ts: "feeds one select command per tool, on the key of its slot". W2 registry structure rules; W5 constant tables.
- tools/tool-catalogue.test.ts: "feeds a cycle back command for every slot with variants". W2 registry structure rules; W5 constant tables.
- tools/tool-catalogue.test.ts: "gives the map its own member ids and keeps the same keys". W2 registry structure rules; W5 constant tables.
- tools/tool-options.test.ts: "gives every option an id of its tool, a label, a description and a way to read and write it". W2 structure rules; W5 constant tables.
- tools/tool-options.test.ts: "gives a number a range and a toggle or an action an icon". W2 structure rules; W5 constant tables.
- tools/tool-options.test.ts: "gives a choice at least two described values and a default among them". W2 structure rules; W5 constant tables.
- tools/tool-options.test.ts: "gives every paint option that is not an action a command, and every key row an existing command". W2 structure rules; W5 constant tables.
- tools/tool-options.test.ts: "shows a bar for every tool of a surface with the options of the old toolbar". W2 structure rules; W5 constant tables.
- swatches/palette-panel-actions.test.ts: "renames a swatch with its colour in one step". W4 same recolour command as recolour-swatch.
- swatches/swatch-library.test.ts: "has one set per platform preset, with unique keys". W5 built-in data tables.
- swatches/swatch-library.test.ts: "holds only opaque hex colours, without the transparent slot". W5 built-in data tables.
- swatches/swatch-library.test.ts: "keeps the fixed colours of a fantasy console". W5 built-in data tables.
- sheet-manager/panel-render.test.ts: "names the sprite and its size and marks a picked sprite". W3 markup (renderToString); W5 constant group list.
- sheet-manager/panel-render.test.ts: "draw the nine anchors with one checked". W3 markup (renderToString); W5 constant group list.
- sheet-manager/panel-render.test.ts: "list the renames and say which names cannot be used". W3 markup (renderToString); W5 constant group list.
- sheet-manager/panel-render.test.ts: "draw the layout controls of a sheet". W3 markup (renderToString); W5 constant group list.
- sheet-manager/panel-render.test.ts: "has the groups for editing, combining, ordering, the sheet, transforms and selecting". W3 markup (renderToString); W5 constant group list.
- sheet-manager/pivot.test.ts: "uses the same engine command as a single edit". W4 same command path as setting many pivots.
- sheet-manager/traits.test.ts: "sorts by the name of the palette". W8 asserts only a length.
- sheet-manager/virtual-grid.test.ts: "picks the smallest tile that holds the thumbnail and its name for every zoom". W5 constant table.

## Rule candidates (W1 and W2 tests dropped without writing a lint rule)

- tilemap/map-commands: a test that every tilemap command is registered once on a known group (registry structure).
- timeline/menu and timeline/menu-targets: tests that a menu has at most twelve entries and fixed entry counts (menu structure).
- tools/tool-catalogue: unique ids, names and descriptions per slot and member, one select command per tool on the key of its slot, a cycle back command for every slot with variants (registry structure).
- tools/tool-options: every option has an id of its tool, a label and a description; numbers have a range; toggles and actions have an icon; choices have at least two described values and a default; every paint option has a command (registry structure).
- toolbars/toolbar-definitions: unique toolbar ids and labels, default sides, all shown (definition structure).

## Notes

- Tags that do not match the rule letter on purpose: some K3 and K2 integration files are tagged standard because they use the document host; the tag follows what the test really needs.
- manager-views is tagged critical although it uses fake timers; the timers are deterministic.
- toolbar-definitions and toolbar-items are tagged critical although they load modules through mocks.
- panel-render lost its four renderToString markup cases (W3); the list rows and action menu cases remain.
- editor/apply-bar keeps two cases that drive the pending store through a local helper; the markup case was dropped.
