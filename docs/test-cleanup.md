# Test clean-up

Verdicts against the shared test standard (`X:/ai-config/docs/test-standard.md`, standards 0.13.0 adopted). Date: 2026-11-01. Branch: test-cleanup/all.

A case is one `it` or `test` call site; an `it.each` or `test.each` counts as one. Nothing was run in this pass (no tests, lint, typecheck, build or app launch); the checker runs them. Every kept test sits under a describe that names its KEEP rule and carries one native tag (`critical`, `standard` or `e2e`). Nothing stays untagged.

Rule names, short: K1 business logic, K2 public contract, K3 data safety, K4 security and refusal, K5 regression; S1 component behavior, S2 integration with in-memory fakes, S3 edge and failure paths, S4 package boundary; E1 one smoke per user journey, E2 real tools; W1 reads source text, W2 repeats a lint, type or structure rule, W3 markup, CSS and layout, W4 one behavior in several states, W5 constants, getters, re-exports and library tests, W6 mock-call-only, W7 sleeps and timer luck, W8 dead code or no assertion, W9 private helper, W10 one-off migration or prose wording. "Doubt question" means the test fits no K rule once the compiler, lint or another test already catches the break.

The work was split in six parts. The verdicts of all six are merged below, with the numbers the lead checked against the final tree.

## Counts for the whole repo

| | before | after |
|---|---|---|
| files | 578 | 515 |
| cases | 3981 | 3561 |
| tagged critical | 0 | 2270 |
| tagged standard | 0 | 1223 |
| tagged e2e | 0 | 68 |
| untagged | 3981 | 0 |

Per part:

| Part | Scope | files before / after | cases before / after | critical after | standard after | e2e after |
|---|---|---|---|---|---|---|
| 1 | packages/document, packages/project | 104 / 104 | 776 / 764 | 709 | 55 | 0 |
| 2 | packages/raster, palette, presets | 94 / 94 | 760 / 696 | 692 | 4 | 0 |
| 3 | packages/formats, packages/mcp, desktop assistant, grants, platform, config, recovery | 94 / 91 | 708 / 674 | 446 | 228 | 0 |
| 4 | desktop editor areas | 134 / 134 | 946 / 900 | 253 | 647 | 0 |
| 5 | desktop shell areas | 76 / 70 | 539 / 459 | 170 | 289 | 0 |
| 6 | desktop e2e specs | 76 / 22 | 252 / 68 | 0 | 0 | 68 |
| Total | | 578 / 515 | 3981 / 3561 | 2270 | 1223 | 68 |

No part report disagrees with these numbers. The per-file tables below add up to the file and case counts of each part.

Helper files were not counted as tests. Part 5 deleted two helpers that lost their last user (`keymap/chord-table.ts`, `hints/all-hints.ts`). Part 6 removed 62 unused files from `tests/e2e/support` (190 before, 128 after). `document.bench.ts` and other benches were left as they are.

## Tag pass

- critical: pure logic, codecs, grants, the trust store, the recovery quit decision, and the temp-folder file tests (`claim-files`, `export-target-kind`). No process, socket, timer or real clock.
- standard: tests that drive the app tools, the document host, the project rig or zustand stores against in-memory fakes and the mocked Brock module; the MCP SDK in-memory transport (`helper-listing`); rejection-only describes of the document and project packages (S3).
- e2e: the 22 kept Playwright specs, one per user journey (E1).
- Part 1 found no sleep, real clock or real file (the created-time tests inject a clock). Part 2 deleted one real-clock performance bound (`pixels-resample`, W7). In part 3, `grants/helper-listing` slept 20 ms to wait for a notification; it now awaits a `listTools` round trip (W7 fixed). Part 5 files use `vi.waitFor` on microtasks only or fake timers. Part 6 kept `crash-recovery` with its fixed waits (see open points).

## Journeys kept as e2e specs (part 6)

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

## Verdicts by part

In the verdict column, `keep` means every case stays, `partial` or `trim` means some cases were deleted, `delete` or `wipe` means the whole file went. In part 6 the rule column holds the E1 rule that keeps the spec, or the WIPE rule (or the doubt question) that removes it, with the reason in brackets. "Unit" there means a unit or component test already covers the behavior.

### Part 1: packages/document and packages/project

All files ran in memory (engine, codecs, zip bytes), so no file was retagged e2e. S3 describes (open damage, open checks, engine rejection, map guards, layer merge rule, tile integrity) are tagged standard; the rest is critical. A file with describes of several rules lists all of them.

| File | Verdict | Rule | Tag | Cases before -> after |
|---|---|---|---|---|
| packages/document/tests/animated-split.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/document/tests/animation-compose.test.ts | keep | K1 | critical | 10 -> 10 |
| packages/document/tests/animation-create.test.ts | partial | K1 | critical | 8 -> 7 |
| packages/document/tests/animation-facing-draw.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/animation-files.test.ts | keep | K3, S3 | critical, standard | 7 -> 7 |
| packages/document/tests/animation-frames.test.ts | keep | K1 | critical | 11 -> 11 |
| packages/document/tests/animation-split-strict.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/document/tests/animation-sprites.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/document/tests/animation-tags.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/document/tests/animation-tiles.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/document/tests/animation-undo.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/asset-digest.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/asset-guides.test.ts | keep | K3 | critical | 6 -> 6 |
| packages/document/tests/brush-commands.test.ts | keep | K1, K3 | critical | 5 -> 5 |
| packages/document/tests/cel-commands.test.ts | keep | K1 | critical | 13 -> 13 |
| packages/document/tests/cel-linked.test.ts | keep | K1 | critical | 14 -> 14 |
| packages/document/tests/cel-remap-order.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/cel-swap.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/document/tests/created-stamp.test.ts | keep | K1, K3 | critical | 7 -> 7 |
| packages/document/tests/diff-bounds.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/document/tests/engine-actor-report.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/document/tests/engine-atomic-batch.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/document/tests/engine-preview.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/document/tests/engine-rejection.test.ts | keep | S3 | standard | 10 -> 10 |
| packages/document/tests/engine-round-trip.test.ts | partial | K1, K2 | critical | 7 -> 5 |
| packages/document/tests/engine-step-blame.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/frame-add-delete.test.ts | keep | K1 | critical | 15 -> 15 |
| packages/document/tests/frame-persistence.test.ts | keep | K3 | critical | 3 -> 3 |
| packages/document/tests/frame-render.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/frame-reorder-update.test.ts | keep | K1 | critical | 13 -> 13 |
| packages/document/tests/geometry.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/document/tests/guide-commands.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/document/tests/history-limits.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/document/tests/ids.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/layer-add-delete.test.ts | keep | K1 | critical | 15 -> 15 |
| packages/document/tests/layer-duplicate-flatten.test.ts | keep | K1 | critical | 11 -> 11 |
| packages/document/tests/layer-merge.test.ts | keep | K1, S3 | critical, standard | 11 -> 11 |
| packages/document/tests/layer-tags-locks.test.ts | keep | K1, K3 | critical | 7 -> 7 |
| packages/document/tests/layer-update-reorder.test.ts | keep | K1 | critical | 14 -> 14 |
| packages/document/tests/map-copy-move.test.ts | keep | K1 | critical | 9 -> 9 |
| packages/document/tests/map-geometry.test.ts | keep | K1 | critical | 10 -> 10 |
| packages/document/tests/map-painting.test.ts | keep | K1, S3 | critical, standard | 17 -> 17 |
| packages/document/tests/map-write.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/document/tests/native-asset-v2.test.ts | partial | K3, K2 | critical | 17 -> 16 |
| packages/document/tests/native-migrations.test.ts | keep | K3 | critical | 4 -> 4 |
| packages/document/tests/native-open-checks.test.ts | keep | S3 | standard | 13 -> 13 |
| packages/document/tests/native-open-damage.test.ts | keep | S3 | standard | 5 -> 5 |
| packages/document/tests/native-round-trip.test.ts | partial | K3, K2 | critical | 8 -> 7 |
| packages/document/tests/native-sheet-tiles-v2.test.ts | keep | K3 | critical | 11 -> 11 |
| packages/document/tests/patch-frame-rgba.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/platform-id.test.ts | keep | K1, K3 | critical | 6 -> 6 |
| packages/document/tests/preset-commands.test.ts | keep | K1, K3 | critical | 15 -> 15 |
| packages/document/tests/retired-commands.test.ts | keep | K2 | critical | 2 -> 2 |
| packages/document/tests/rewrite-asset-links.test.ts | keep | K3 | critical | 4 -> 4 |
| packages/document/tests/saved-marker.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/document/tests/sheet-animation-move.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/sheet-animation.test.ts | keep | K1 | critical | 12 -> 12 |
| packages/document/tests/sheet-commands.test.ts | keep | K1 | critical | 26 -> 26 |
| packages/document/tests/slice-commands.test.ts | keep | K1 | critical | 8 -> 8 |
| packages/document/tests/snapshot-safety.test.ts | keep | K3 | critical | 2 -> 2 |
| packages/document/tests/sprite-collection.test.ts | keep | K1 | critical | 15 -> 15 |
| packages/document/tests/sprite-pixel-grid.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/sprite-platform.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/document/tests/sprite-reorder-sheet.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/document/tests/sprite-symmetry.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/swatch-alpha.test.ts | keep | K1, K3 | critical | 7 -> 7 |
| packages/document/tests/tag-colour.test.ts | keep | K1, K3 | critical | 8 -> 8 |
| packages/document/tests/tag-commands.test.ts | keep | K1 | critical | 13 -> 13 |
| packages/document/tests/terrain-sets.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/document/tests/terrain.test.ts | keep | K1 | critical | 11 -> 11 |
| packages/document/tests/tile-collision.test.ts | keep | K1, K3 | critical | 7 -> 7 |
| packages/document/tests/tile-duplicate.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/tile-native.test.ts | partial | K3, S3 | critical, standard | 7 -> 5 |
| packages/document/tests/tile-playback.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/document/tests/tile-properties.test.ts | keep | K1 | critical | 10 -> 10 |
| packages/document/tests/tile-source.test.ts | keep | K1 | critical | 8 -> 8 |
| packages/document/tests/tile-undo.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/tilemap-bytes-cache.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/tilemap-import.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/tilemap-layer-copy.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/tilemap-layers.test.ts | keep | K1 | critical | 12 -> 12 |
| packages/document/tests/tilemap-orientation.test.ts | keep | K1, K3 | critical | 6 -> 6 |
| packages/document/tests/tileset-tiles.test.ts | keep | K1 | critical | 16 -> 16 |
| packages/document/tests/workspace-merge.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/document/tests/workspace-split.test.ts | keep | K3 | critical | 7 -> 7 |
| packages/document/tests/workspace-touched.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/project/tests/animation-role.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/project/tests/containment.test.ts | keep | K4 | critical | 3 -> 3 |
| packages/project/tests/defaults.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/project/tests/entry-kinds.test.ts | partial | K1 | critical | 4 -> 2 |
| packages/project/tests/folders.test.ts | keep | K4 | critical | 7 -> 7 |
| packages/project/tests/grant.test.ts | partial | K4 | critical | 8 -> 7 |
| packages/project/tests/ids.test.ts | partial | K1 | critical | 3 -> 2 |
| packages/project/tests/listing.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/project/tests/manifest.test.ts | keep | K3, S3 | critical, standard | 10 -> 10 |
| packages/project/tests/migration.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/project/tests/pack.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/project/tests/path-refusals.test.ts | keep | K4 | critical | 6 -> 6 |
| packages/project/tests/project-document.test.ts | partial | K2, K3 | critical | 9 -> 8 |
| packages/project/tests/project-export.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/project/tests/project-file.test.ts | keep | K3, S3 | critical, standard | 10 -> 10 |
| packages/project/tests/project-organise.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/project/tests/project-store.test.ts | keep | K1, K4 | critical | 9 -> 9 |
| packages/project/tests/swatch-sets.test.ts | keep | K1, K2 | critical | 15 -> 15 |

### Part 2: packages/raster, palette and presets

No file was wiped; every file holds at least one K or S behavior. Data-table rows dropped from a `test.each` keep the case count and show as partial.

| File | Verdict | Rule | Tag | Cases before -> after |
|---|---|---|---|---|
| packages/raster/tests/brush-stamp.test.ts | partial | K1 | critical | 5 -> 5 |
| packages/raster/tests/draw-shape.test.ts | partial | K1 | critical | 10 -> 8 |
| packages/raster/tests/drawing-gradient.test.ts | partial | K1 | critical | 4 -> 3 |
| packages/raster/tests/drawing-tools.test.ts | partial | K1 | critical | 30 -> 28 |
| packages/raster/tests/ellipse.test.ts | partial | K1 | critical | 7 -> 6 |
| packages/raster/tests/extend-trail.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/raster/tests/flood-fill-global-mask.test.ts | partial | K1 | critical | 12 -> 11 |
| packages/raster/tests/flood-fill.test.ts | partial | K1 | critical | 3 -> 3 |
| packages/raster/tests/frame-sprites.test.ts | keep | K1 | critical | 1 -> 1 |
| packages/raster/tests/gradient-function.test.ts | partial | K1 | critical | 10 -> 7 |
| packages/raster/tests/line-points.test.ts | partial | K1 | critical | 6 -> 3 |
| packages/raster/tests/outline-tools.test.ts | partial | K1 | critical | 14 -> 12 |
| packages/raster/tests/paint-stroke.test.ts | partial | K1 | critical | 15 -> 12 |
| packages/raster/tests/path-function.test.ts | partial | K1 | critical | 13 -> 11 |
| packages/raster/tests/pixel-perfect.test.ts | partial | K1 | critical | 8 -> 5 |
| packages/raster/tests/region-functions.test.ts | keep | K1 | critical | 14 -> 14 |
| packages/raster/tests/resample.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/raster/tests/rect.test.ts | partial | K1 | critical | 4 -> 4 |
| packages/raster/tests/rotate-function.test.ts | partial | K1 | critical | 8 -> 6 |
| packages/raster/tests/selection-ops.test.ts | partial | K1 | critical | 19 -> 17 |
| packages/raster/tests/selection-shapes.test.ts | partial | K1 | critical | 13 -> 11 |
| packages/raster/tests/selection-tools.test.ts | keep | K1 | critical | 8 -> 8 |
| packages/raster/tests/shade-stamp-function.test.ts | keep | K1 | critical | 11 -> 11 |
| packages/raster/tests/sprite-created.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/raster/tests/stroke-points.test.ts | partial | K1 | critical | 6 -> 4 |
| packages/raster/tests/symmetry.test.ts | partial | K1 | critical | 11 -> 10 |
| packages/raster/tests/transform-buffer.test.ts | partial | K1 | critical | 11 -> 8 |
| packages/raster/tests/transform-region.test.ts | partial | K1 | critical | 12 -> 10 |
| packages/raster/tests/wrap-functions.test.ts | partial | K1 | critical | 16 -> 13 |
| packages/raster/tests/pixels-erase.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/raster/tests/pixels-fill.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/raster/tests/pixels-gradient-stamp.test.ts | keep | K2 | critical | 13 -> 13 |
| packages/raster/tests/pixels-linked.test.ts | keep | K2 | critical | 2 -> 2 |
| packages/raster/tests/pixels-paint-options.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/raster/tests/pixels-paint.test.ts | keep | K2 | critical | 7 -> 7 |
| packages/raster/tests/pixels-move.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/raster/tests/pixels-rotate.test.ts | keep | K2 | critical | 11 -> 11 |
| packages/raster/tests/pixels-scale.test.ts | keep | K2 | critical | 10 -> 10 |
| packages/raster/tests/pixels-shade.test.ts | keep | K2 | critical | 9 -> 9 |
| packages/raster/tests/pixels-shape-paths.test.ts | keep | K2 | critical | 7 -> 7 |
| packages/raster/tests/pixels-wrap.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/raster/tests/sprite-merge.test.ts | keep | K2 | critical | 7 -> 7 |
| packages/raster/tests/sprite-slice-islands.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/raster/tests/sprite-split-slice.test.ts | keep | K2 | critical | 10 -> 10 |
| packages/raster/tests/pixels-replace-clear.test.ts | partial | K2 | critical | 15 -> 15 |
| packages/raster/tests/pixels-resample.test.ts | partial | K2 | critical | 16 -> 14 |
| packages/raster/tests/pixels-shape.test.ts | partial | K2 | critical | 5 -> 4 |
| packages/raster/tests/pixels-transform.test.ts | partial | K2 | critical | 14 -> 13 |
| packages/raster/tests/sprite-flip.test.ts | partial | K2 | critical | 9 -> 7 |
| packages/raster/tests/sprite-resize-trim.test.ts | partial | K2 | critical | 10 -> 9 |
| packages/raster/tests/sprite-turn-slices.test.ts | partial | K2 | critical | 3 -> 2 |
| packages/raster/tests/sprite-turn.test.ts | partial | K2 | critical | 13 -> 11 |
| packages/raster/tests/pixels-history.test.ts | keep | K3 | critical | 3 -> 3 |
| packages/raster/tests/selection-saved.test.ts | keep | K3 | critical | 5 -> 5 |
| packages/raster/tests/engine-history-bytes.test.ts | keep | S2 | standard | 2 -> 2 |
| packages/raster/tests/engine-output.test.ts | keep | S2 | standard | 1 -> 1 |
| packages/palette/tests/animation-import.test.ts | keep | K2 | critical | 4 -> 4 |
| packages/palette/tests/census.test.ts | partial | K1 | critical | 6 -> 5 |
| packages/palette/tests/dither.test.ts | partial | K1 | critical | 7 -> 6 |
| packages/palette/tests/extract.test.ts | partial | K1 | critical | 6 -> 5 |
| packages/palette/tests/hex.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/palette/tests/import-transaction.test.ts | keep | K3 | critical | 6 -> 6 |
| packages/palette/tests/map.test.ts | partial | K1 | critical | 10 -> 8 |
| packages/palette/tests/palette-assign.test.ts | keep | K2 | critical | 6 -> 6 |
| packages/palette/tests/palette-bank-lifecycle.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/palette/tests/palette-clean-up.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/palette/tests/palette-create.test.ts | keep | K2 | critical | 10 -> 10 |
| packages/palette/tests/palette-duplicate.test.ts | keep | K2 | critical | 3 -> 3 |
| packages/palette/tests/palette-import.test.ts | keep | K2 | critical | 11 -> 11 |
| packages/palette/tests/palette-rejection.test.ts | keep | K4 | critical | 11 -> 11 |
| packages/palette/tests/palette-reorder.test.ts | partial | K2 | critical | 4 -> 3 |
| packages/palette/tests/palette-resize.test.ts | keep | K2 | critical | 6 -> 6 |
| packages/palette/tests/palette-update.test.ts | keep | K2 | critical | 12 -> 12 |
| packages/palette/tests/ramp-builder.test.ts | partial | K1 | critical | 8 -> 7 |
| packages/palette/tests/ramp-commands.test.ts | keep | K2 | critical | 9 -> 9 |
| packages/palette/tests/remap-output.test.ts | keep | S2 | standard | 1 -> 1 |
| packages/palette/tests/remap.test.ts | keep | K1 | critical | 10 -> 10 |
| packages/palette/tests/sheet-import.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/palette/tests/sprite-import.test.ts | partial | K2 | critical | 17 -> 16 |
| packages/palette/tests/swatch-alpha.test.ts | keep | K2 | critical | 9 -> 9 |
| packages/palette/tests/swatch-commands.test.ts | keep | K2 | critical | 7 -> 7 |
| packages/palette/tests/swatch-delete.test.ts | keep | K2 | critical | 9 -> 9 |
| packages/palette/tests/swatch-merge.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/palette/tests/tileset-import.test.ts | keep | K2 | critical | 4 -> 4 |
| packages/palette/tests/usage.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/presets/tests/area-errors.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/presets/tests/areas.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/presets/tests/catalog.test.ts | partial | K1 | critical | 4 -> 3 |
| packages/presets/tests/defaults.test.ts | partial | K1 | critical | 6 -> 3 |
| packages/presets/tests/fixed-palettes.test.ts | partial | K1 | critical | 3 -> 2 |
| packages/presets/tests/new-breaks.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/presets/tests/platform-check.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/presets/tests/snapping.test.ts | partial | K1 | critical | 11 -> 10 |
| packages/presets/tests/sprite-sizes.test.ts | keep | K1 | critical | 6 -> 6 |

### Part 3: formats, mcp, desktop assistant, grants, platform, config, recovery

Paths in the table are from the repo root. The three wiped files are `no-dialog-paths`, `spelling` and `project-hub-pages`.

| File | Verdict | Rule | Tag | Cases before -> after |
|---|---|---|---|---|
| packages/formats/tests/apng-compose.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/formats/tests/apng.test.ts | keep | K3 | critical | 7 -> 7 |
| packages/formats/tests/gif.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/formats/tests/palette-alpha.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/formats/tests/palette-file.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/formats/tests/png-decode.test.ts | keep | K1 | critical | 12 -> 12 |
| packages/formats/tests/png-errors.test.ts | partial | K1 | critical | 14 -> 13 |
| packages/formats/tests/png-indexed.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/formats/tests/png-rgba.test.ts | keep | K3 | critical | 8 -> 8 |
| packages/formats/tests/png-scale.test.ts | partial | K1 | critical | 17 -> 13 |
| packages/formats/tests/sheet-animation.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/formats/tests/sheet-export.test.ts | keep | K2 | critical | 6 -> 6 |
| packages/formats/tests/sheet-metadata.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/sheet-pack.test.ts | keep | K1 | critical | 9 -> 9 |
| packages/formats/tests/sheet-pages.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/formats/tests/sheet-plan.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/sheet-rotate.test.ts | keep | K1 | critical | 14 -> 14 |
| packages/formats/tests/sheet-tag-colour.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/sheet-trim.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/formats/tests/tile-collision-export.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/tile-orientation-export.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/tiled-animation.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/tiled-json.test.ts | keep | K2 | critical | 6 -> 6 |
| packages/formats/tests/tiled-plan.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/formats/tests/tiled-read.test.ts | keep | K3 | critical | 5 -> 5 |
| packages/formats/tests/tilemap-json.test.ts | keep | K2 | critical | 6 -> 6 |
| packages/formats/tests/tileset-image.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/xml-parse.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/mcp/tests/base64.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/mcp/tests/catalogue.test.ts | partial | K2 | critical | 13 -> 10 |
| packages/mcp/tests/errors-bridge.test.ts | partial | K2 | critical | 10 -> 8 |
| packages/mcp/tests/grants-app.test.ts | keep | K4 | critical | 8 -> 8 |
| packages/mcp/tests/grants-list.test.ts | keep | K4 | critical | 13 -> 13 |
| packages/mcp/tests/grants.test.ts | keep | K4 | critical | 17 -> 17 |
| packages/mcp/tests/input-failures.test.ts | keep | K2 | critical | 10 -> 10 |
| packages/mcp/tests/limits.test.ts | partial | K1 | critical | 7 -> 5 |
| packages/mcp/tests/map-mask.test.ts | keep | K2 | critical | 4 -> 4 |
| packages/mcp/tests/project-files-tools.test.ts | keep | K2 | critical | 11 -> 11 |
| packages/mcp/tests/scope.test.ts | keep | K4 | critical | 12 -> 12 |
| packages/mcp/tests/timeline-schemas.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/mcp/tests/tool-schemas.test.ts | partial | K2 | standard | 17 -> 16 |
| packages/mcp/tests/trust-decide.test.ts | keep | K4 | critical | 17 -> 17 |
| packages/mcp/tests/trust-migration.test.ts | keep | K3 | critical | 11 -> 11 |
| packages/mcp/tests/trust-store.test.ts | keep | K3 | critical | 18 -> 18 |
| packages/mcp/tests/wire-mask.test.ts | keep | K2 | critical | 5 -> 5 |
| apps/desktop/tests/assistant/animation-reads.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/assistant/app-tools-commands.test.ts | keep | S2 | standard | 11 -> 11 |
| apps/desktop/tests/assistant/app-tools-history.test.ts | keep | S2 | standard | 2 -> 2 |
| apps/desktop/tests/assistant/app-tools-layout.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/assistant/app-tools-settings.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/assistant/app-tools-view.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/assistant/claim-files.test.ts | keep | K4 | critical | 3 -> 3 |
| apps/desktop/tests/assistant/command-manifest.test.ts | partial | K1 | critical | 8 -> 4 |
| apps/desktop/tests/assistant/document-include.test.ts | keep | S2 | standard | 4 -> 4 |
| apps/desktop/tests/assistant/export-target-kind.test.ts | keep | K4 | critical | 4 -> 4 |
| apps/desktop/tests/assistant/grant-model.test.ts | partial | K1 | critical | 15 -> 14 |
| apps/desktop/tests/assistant/native-pair.test.ts | keep | K4 | critical | 6 -> 6 |
| apps/desktop/tests/assistant/open-keeps-names.test.ts | keep | K3 | standard | 1 -> 1 |
| apps/desktop/tests/assistant/preview-request.test.ts | keep | K1 | critical | 3 -> 3 |
| apps/desktop/tests/assistant/program-grant-render.test.ts | partial | S1 | standard | 6 -> 2 |
| apps/desktop/tests/assistant/recent-ids.test.ts | keep | K1,S2 | critical+standard | 2 -> 2 |
| apps/desktop/tests/assistant/save-no-dialogs.test.ts | keep | K4 | standard | 9 -> 9 |
| apps/desktop/tests/assistant/setting-rows.test.ts | keep | K1 | critical | 6 -> 6 |
| apps/desktop/tests/assistant/settings-scope.test.ts | keep | K1 | critical | 1 -> 1 |
| apps/desktop/tests/assistant/sweep-fixes.test.ts | keep | S2 | standard | 16 -> 16 |
| apps/desktop/tests/assistant/timeline-view.test.ts | keep | S2 | standard | 12 -> 12 |
| apps/desktop/tests/assistant/no-dialog-paths.test.ts | wipe | W1 | - | 2 -> 0 |
| apps/desktop/tests/grants/helper-listing.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/grants/restart-handoff.test.ts | keep | K1 | critical | 6 -> 6 |
| apps/desktop/tests/grants/session-grants.test.ts | keep | K1 | critical | 9 -> 9 |
| apps/desktop/tests/grants/step-bundles.test.ts | partial | K4 | critical | 2 -> 1 |
| apps/desktop/tests/grants/stop-bxel-grants.test.ts | keep | K4 | critical | 5 -> 5 |
| apps/desktop/tests/platform/area-findings.test.ts | partial | S2 | standard | 8 -> 7 |
| apps/desktop/tests/platform/assistant-strict.test.ts | partial | K4 | standard | 8 -> 7 |
| apps/desktop/tests/platform/banks.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/platform/platform-preset.test.ts | partial | S2 | standard | 15 -> 14 |
| apps/desktop/tests/platform/preset-preview.test.ts | partial | K1 | critical | 7 -> 6 |
| apps/desktop/tests/platform/snap-platform.test.ts | keep | S2 | standard | 6 -> 6 |
| apps/desktop/tests/platform/sprite-check.test.ts | partial | S2 | standard | 5 -> 4 |
| apps/desktop/tests/platform/sprite-platform.test.ts | keep | S2 | standard | 4 -> 4 |
| apps/desktop/tests/platform/strict-mode.test.ts | keep | K4 | standard | 11 -> 11 |
| apps/desktop/tests/platform/spelling.test.ts | wipe | W1 | - | 2 -> 0 |
| apps/desktop/tests/config/asset-config.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/config/palette-switch.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/config/project-config.test.ts | keep | S2 | standard | 11 -> 11 |
| apps/desktop/tests/config/project-export.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/config/project-hub-pages.test.ts | wipe | W6/W5 | - | 2 -> 0 |
| apps/desktop/tests/recovery/close-prompt.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/recovery/project-restore.test.ts | keep | K3 | standard | 2 -> 2 |
| apps/desktop/tests/recovery/quit-decision.test.ts | keep | K1 | critical | 9 -> 9 |
| apps/desktop/tests/recovery/restore-flow.test.ts | keep | K3 | standard | 7 -> 7 |
| apps/desktop/tests/recovery/snapshot-clear.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/recovery/snapshot-throttle.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/recovery/unopened-snapshots.test.ts | keep | S2 | standard | 3 -> 3 |

### Part 4: desktop editor areas

Folders editor, selection, tilemap, timeline, sheet, sheet-manager, export, swatches, tools, symmetry, slice, guides, ruler, canvas-look, canvas-dirty, pixel-viewport, view-zoom, toolbars and stage-header under `apps/desktop/tests`. No whole file was wiped; 24 files lost cases. 49 files hold at least one critical describe and 101 at least one standard describe.

| File | Verdict | Rule | Tag | Cases before -> after |
|---|---|---|---|---|
| apps/desktop/tests/canvas-dirty/upload-image.test.ts | keep | K1 | critical | 4 -> 4 |
| apps/desktop/tests/canvas-look/canvas-look.test.ts | partial | K1 | critical | 11 -> 8 |
| apps/desktop/tests/canvas-look/pattern-bits.test.ts | keep | K1 | critical | 9 -> 9 |
| apps/desktop/tests/canvas-look/sprite-look.test.ts | keep | K1 | critical | 2 -> 2 |
| apps/desktop/tests/view-zoom/navigator.test.ts | keep | K1 | critical | 4 -> 4 |
| apps/desktop/tests/view-zoom/view-zoom.test.ts | partial | K1 | critical | 5 -> 4 |
| apps/desktop/tests/editor/apply-bar.test.ts | partial | S2 | standard | 3 -> 2 |
| apps/desktop/tests/editor/commit-handoff.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/editor/context-chips.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/editor/drawing-extras.test.ts | keep | K1, S2 | critical, standard | 8 -> 8 |
| apps/desktop/tests/editor/drawing-paths.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/editor/drawing-tools.test.ts | keep | K1, S2 | critical, standard | 12 -> 12 |
| apps/desktop/tests/editor/held-colours.test.ts | partial | K1, S2 | critical, standard | 10 -> 8 |
| apps/desktop/tests/editor/history.test.ts | partial | K2, S2 | standard | 4 -> 3 |
| apps/desktop/tests/editor/layers.test.ts | partial | S2 | standard | 11 -> 10 |
| apps/desktop/tests/editor/line-and-fill.test.ts | keep | S2 | standard | 6 -> 6 |
| apps/desktop/tests/editor/options.test.ts | keep | K1, S2 | critical, standard | 11 -> 11 |
| apps/desktop/tests/editor/pixel-perfect-stroke.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/editor/refresh-rect.test.ts | keep | K1 | critical | 3 -> 3 |
| apps/desktop/tests/editor/rotate-preview.test.ts | keep | S2 | standard | 2 -> 2 |
| apps/desktop/tests/editor/shapes.test.ts | partial | S2, K1 | standard, critical | 10 -> 9 |
| apps/desktop/tests/editor/stroke.test.ts | keep | S2 | standard | 4 -> 4 |
| apps/desktop/tests/editor/tiled-wrap.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/editor/tools.test.ts | partial | S2, K1 | standard, critical | 8 -> 7 |
| apps/desktop/tests/selection/canvas-size.test.ts | keep | S2 | standard | 4 -> 4 |
| apps/desktop/tests/selection/clipboard.test.ts | keep | S2 | standard | 4 -> 4 |
| apps/desktop/tests/selection/delete-routing.test.ts | partial | K2 | standard | 6 -> 4 |
| apps/desktop/tests/selection/keys.test.ts | keep | S2 | standard | 1 -> 1 |
| apps/desktop/tests/selection/mask-descriptor.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/selection/move.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/selection/paste-flow.test.ts | keep | S2, K3 | standard | 7 -> 7 |
| apps/desktop/tests/selection/selection-extras.test.ts | partial | S2 | standard | 5 -> 4 |
| apps/desktop/tests/selection/selection-history.test.ts | keep | S2 | standard | 2 -> 2 |
| apps/desktop/tests/selection/selection-tools.test.ts | keep | S2 | standard | 10 -> 10 |
| apps/desktop/tests/selection/selection.test.ts | keep | K1, S2 | critical, standard | 10 -> 10 |
| apps/desktop/tests/selection/transform-session.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/selection/transform.test.ts | keep | S2 | standard | 6 -> 6 |
| apps/desktop/tests/tilemap/collision.test.ts | keep | K1, S2 | critical, standard | 8 -> 8 |
| apps/desktop/tests/tilemap/edit-tiles.test.ts | keep | S2 | standard | 11 -> 11 |
| apps/desktop/tests/tilemap/export-collision.test.ts | keep | K3 | standard | 2 -> 2 |
| apps/desktop/tests/tilemap/export-map.test.ts | keep | K3 | standard | 6 -> 6 |
| apps/desktop/tests/tilemap/map-clip.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/tilemap/map-commands.test.ts | partial | S2 | standard | 7 -> 6 |
| apps/desktop/tests/tilemap/map-drawing.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/tilemap/map-layers.test.ts | keep | S2 | standard | 6 -> 6 |
| apps/desktop/tests/tilemap/map-selection.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/tilemap/map-stamp.test.ts | keep | S2, K3 | standard, critical | 3 -> 3 |
| apps/desktop/tests/tilemap/orientation.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/tilemap/place-tiles.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/tilemap/save-reopen.test.ts | keep | K3 | standard | 4 -> 4 |
| apps/desktop/tests/tilemap/stamp-brush.test.ts | keep | K1 | critical | 8 -> 8 |
| apps/desktop/tests/tilemap/terrain.test.ts | keep | S2 | standard | 11 -> 11 |
| apps/desktop/tests/tilemap/tile-animation.test.ts | keep | S2 | standard | 4 -> 4 |
| apps/desktop/tests/tilemap/tile-picking.test.ts | keep | K1 | critical | 5 -> 5 |
| apps/desktop/tests/tilemap/tileset-view.test.ts | keep | K1 | critical | 6 -> 6 |
| apps/desktop/tests/tilemap/turn-cells.test.ts | keep | K1, S2 | critical, standard | 7 -> 7 |
| apps/desktop/tests/timeline/add-frames.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/timeline/clock-guards.test.ts | keep | S2 | standard | 6 -> 6 |
| apps/desktop/tests/timeline/clock.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/timeline/editing.test.ts | keep | S2 | standard | 14 -> 14 |
| apps/desktop/tests/timeline/frames.test.ts | keep | S2 | standard | 10 -> 10 |
| apps/desktop/tests/timeline/group-facing.test.ts | partial | S2 | standard | 5 -> 4 |
| apps/desktop/tests/timeline/image-drop.test.ts | keep | K1, S2 | critical, standard | 15 -> 15 |
| apps/desktop/tests/timeline/keys.test.ts | keep | K1 | critical | 4 -> 4 |
| apps/desktop/tests/timeline/layout.test.ts | partial | K1 | critical | 11 -> 10 |
| apps/desktop/tests/timeline/menu-targets.test.ts | partial | S2 | standard | 11 -> 8 |
| apps/desktop/tests/timeline/menu.test.ts | partial | S2 | standard | 7 -> 5 |
| apps/desktop/tests/timeline/onion.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/timeline/placement.test.ts | keep | S2 | standard | 10 -> 10 |
| apps/desktop/tests/timeline/playback.test.ts | keep | S2 | standard | 12 -> 12 |
| apps/desktop/tests/timeline/tags.test.ts | keep | S2 | standard | 11 -> 11 |
| apps/desktop/tests/timeline/transforms.test.ts | keep | S2 | standard | 6 -> 6 |
| apps/desktop/tests/timeline/zone-keys.test.ts | keep | K1 | critical | 2 -> 2 |
| apps/desktop/tests/sheet/broadcast.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/sheet/group.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/sheet/selection.test.ts | keep | K1, S2 | critical, standard | 14 -> 14 |
| apps/desktop/tests/sheet/sheet-actions.test.ts | keep | S2 | standard | 15 -> 15 |
| apps/desktop/tests/sheet/sheet-animation.test.ts | keep | S2 | standard | 2 -> 2 |
| apps/desktop/tests/sheet/sheet-check.test.ts | keep | K3 | standard | 6 -> 6 |
| apps/desktop/tests/guides/guides.test.ts | keep | K1 | critical | 5 -> 5 |
| apps/desktop/tests/guides/persisted-guide-scope.test.ts | keep | K1 | critical | 3 -> 3 |
| apps/desktop/tests/guides/snap-to-guides.test.ts | keep | K1 | critical | 5 -> 5 |
| apps/desktop/tests/ruler/ruler-units.test.ts | keep | K1 | critical | 5 -> 5 |
| apps/desktop/tests/ruler/ruler.test.ts | keep | K1 | critical | 13 -> 13 |
| apps/desktop/tests/export/animation-export.test.ts | keep | K3 | standard | 7 -> 7 |
| apps/desktop/tests/export/animation-map.test.ts | keep | K3 | standard | 4 -> 4 |
| apps/desktop/tests/export/animation-sheet-entries.test.ts | keep | K3 | standard | 2 -> 2 |
| apps/desktop/tests/export/export-current.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/export/export-plan.test.ts | keep | S2 | standard | 16 -> 16 |
| apps/desktop/tests/export/export-preset-documents.test.ts | keep | K1, S2 | critical, standard | 9 -> 9 |
| apps/desktop/tests/export/export-preset-list.test.ts | keep | K1 | critical | 5 -> 5 |
| apps/desktop/tests/export/export-preset-save.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/export/export-presets.test.ts | keep | K1 | critical | 3 -> 3 |
| apps/desktop/tests/export/export-run.test.ts | keep | S2 | standard | 6 -> 6 |
| apps/desktop/tests/export/export-sheet.test.ts | keep | K3 | standard | 7 -> 7 |
| apps/desktop/tests/export/export-template.test.ts | keep | K1, S2 | critical, standard | 9 -> 9 |
| apps/desktop/tests/pixel-viewport/pixel-viewport-keys.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/pixel-viewport/pixel-viewport.test.ts | keep | K1 | critical | 12 -> 12 |
| apps/desktop/tests/pixel-viewport/reveal-delta.test.ts | keep | K1 | critical | 3 -> 3 |
| apps/desktop/tests/pixel-viewport/tile-placements.test.ts | keep | K1 | critical | 3 -> 3 |
| apps/desktop/tests/slice/slice-tool.test.ts | keep | S2 | standard | 6 -> 6 |
| apps/desktop/tests/symmetry/symmetry-sync.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/stage-header/canvas-parts.test.ts | keep | K1 | critical | 14 -> 14 |
| apps/desktop/tests/stage-header/stage-header.test.ts | keep | K1 | critical | 15 -> 15 |
| apps/desktop/tests/toolbars/toolbar-definitions.test.ts | partial | K1 | critical | 9 -> 6 |
| apps/desktop/tests/toolbars/toolbar-items.test.ts | keep | K1 | critical | 7 -> 7 |
| apps/desktop/tests/tools/tool-catalogue.test.ts | partial | K1 | critical | 6 -> 2 |
| apps/desktop/tests/tools/tool-options.test.ts | partial | S2 | standard | 12 -> 7 |
| apps/desktop/tests/tools/tool-picking.test.ts | keep | S2 | standard | 13 -> 13 |
| apps/desktop/tests/swatches/load-set.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/swatches/palette-panel-actions.test.ts | partial | S2 | standard | 4 -> 3 |
| apps/desktop/tests/swatches/recolour-swatch.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/swatches/set-source.test.ts | keep | K1 | critical | 7 -> 7 |
| apps/desktop/tests/swatches/swatch-alpha.test.ts | keep | S2, K1 | standard, critical | 11 -> 11 |
| apps/desktop/tests/swatches/swatch-library.test.ts | partial | K1 | critical | 10 -> 7 |
| apps/desktop/tests/sheet-manager/align.test.ts | keep | K1, S2 | critical, standard | 4 -> 4 |
| apps/desktop/tests/sheet-manager/atlas-export-match.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/sheet-manager/atlas.test.ts | keep | S2 | standard | 12 -> 12 |
| apps/desktop/tests/sheet-manager/compose.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/sheet-manager/copies.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/sheet-manager/entry-asset.test.ts | keep | K1 | critical | 1 -> 1 |
| apps/desktop/tests/sheet-manager/folders.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/sheet-manager/identical.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/sheet-manager/list-model.test.ts | keep | S2 | standard | 10 -> 10 |
| apps/desktop/tests/sheet-manager/manager-views.test.ts | keep | K1 | critical | 8 -> 8 |
| apps/desktop/tests/sheet-manager/membership.test.ts | keep | S2 | standard | 11 -> 11 |
| apps/desktop/tests/sheet-manager/order.test.ts | keep | S2 | standard | 6 -> 6 |
| apps/desktop/tests/sheet-manager/panel-render.test.ts | partial | S2 | standard | 8 -> 3 |
| apps/desktop/tests/sheet-manager/pivot.test.ts | partial | S2 | standard | 7 -> 6 |
| apps/desktop/tests/sheet-manager/rename.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/sheet-manager/rows-plan.test.ts | keep | K1 | critical | 5 -> 5 |
| apps/desktop/tests/sheet-manager/traits.test.ts | partial | S2 | standard | 7 -> 6 |
| apps/desktop/tests/sheet-manager/transform.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/sheet-manager/virtual-grid.test.ts | partial | S2 | standard | 3 -> 2 |

### Part 5: desktop shell areas

Folders project, workspace, ui-context, hints, keymap, keyboard, dialogs, demo, asset-list, asset-overview, asset-view, files, file-ops, documents, organise, panel-browser, project-browser, project-health, status-extras, context-menu, tiled-import and legacy under `apps/desktop/tests`. Pure logic and in-memory engines are critical. Anything that runs through the project rig (in-memory disk port, stores, mocked brock-react) or renders markup is standard. Six files were wiped (`context-menu/menu-commands`, `keymap/command-reasons`, `keymap/timeline-keys`, `keymap/zones`, `ui-context/coverage`, `ui-context/matrix`).

| File | Verdict | Rule | Tag | Cases before -> after |
|---|---|---|---|---|
| apps/desktop/tests/asset-list/asset-actions.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/asset-list/asset-list.test.ts | keep | K1 | critical | 6 -> 6 |
| apps/desktop/tests/asset-list/duplicate-kinds.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/asset-overview/asset-overview.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/asset-view/asset-view.test.ts | keep | K1 | critical | 5 -> 5 |
| apps/desktop/tests/context-menu/menu-commands.test.ts | wipe | W2 | - | 2 -> 0 |
| apps/desktop/tests/demo/demo-project.test.ts | partial | K3 | standard | 2 -> 1 |
| apps/desktop/tests/dialogs/animation-import.test.ts | keep | K3 | critical | 6 -> 6 |
| apps/desktop/tests/dialogs/image-import.test.ts | partial | K3 | critical | 15 -> 14 |
| apps/desktop/tests/dialogs/new-sprite.test.ts | partial | K1 | critical | 18 -> 17 |
| apps/desktop/tests/dialogs/palette-change.test.ts | partial | K1 | critical | 12 -> 11 |
| apps/desktop/tests/dialogs/palette-source.test.ts | partial | K3 | critical | 8 -> 7 |
| apps/desktop/tests/documents/document-host.test.ts | keep | K1 | critical | 8 -> 8 |
| apps/desktop/tests/file-ops/file-ops.test.ts | keep | K3 | standard | 10 -> 10 |
| apps/desktop/tests/file-ops/unsaved-referrers.test.ts | keep | K3 | standard | 3 -> 3 |
| apps/desktop/tests/files/recent-list.test.ts | partial | K1 | critical | 7 -> 6 |
| apps/desktop/tests/hints/hint-body.test.ts | partial | S1 | standard | 5 -> 1 |
| apps/desktop/tests/hints/hint-data.test.ts | partial | K1 | critical | 11 -> 4 |
| apps/desktop/tests/hints/menu-order.test.ts | partial | K1 | critical | 22 -> 5 |
| apps/desktop/tests/hints/palette-widget.test.ts | partial | S1 | standard | 5 -> 1 |
| apps/desktop/tests/keyboard/blocking-findings.test.ts | keep | K1 | critical | 1 -> 1 |
| apps/desktop/tests/keyboard/step-cursor.test.ts | keep | K1 | critical | 3 -> 3 |
| apps/desktop/tests/keymap/command-reasons.test.ts | wipe | W2/W5 | - | 4 -> 0 |
| apps/desktop/tests/keymap/keymap.test.ts | partial | S2 | standard | 12 -> 6 |
| apps/desktop/tests/keymap/timeline-keys.test.ts | wipe | W2 | - | 4 -> 0 |
| apps/desktop/tests/keymap/zones.test.ts | wipe | W2 | - | 5 -> 0 |
| apps/desktop/tests/organise/organise-ops.test.ts | keep | K1 | critical | 8 -> 8 |
| apps/desktop/tests/panel-browser/project-browser.test.ts | partial | K1 | critical | 17 -> 15 |
| apps/desktop/tests/project-browser/query-grammar.test.ts | keep | K1 | critical | 8 -> 8 |
| apps/desktop/tests/project-browser/selection-and-playback.test.ts | keep | K1 | critical | 5 -> 5 |
| apps/desktop/tests/project-browser/subject-pin.test.ts | keep | K1 | critical | 3 -> 3 |
| apps/desktop/tests/project-health/project-health.test.ts | keep | K3 | standard | 10 -> 10 |
| apps/desktop/tests/project/animation-tools.test.ts | keep | S2 | standard | 16 -> 16 |
| apps/desktop/tests/project/asset-tools.test.ts | keep | S2 | standard | 15 -> 15 |
| apps/desktop/tests/project/assistant-grants.test.ts | keep | K4 | standard | 9 -> 9 |
| apps/desktop/tests/project/assistant-saves.test.ts | keep | K4 | standard | 5 -> 5 |
| apps/desktop/tests/project/hidden-folder-tools.test.ts | keep | K4 | standard | 7 -> 7 |
| apps/desktop/tests/project/hidden-saves.test.ts | keep | K4 | standard | 5 -> 5 |
| apps/desktop/tests/project/map-tools.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/project/migration-palettes.test.ts | keep | K3 | standard | 2 -> 2 |
| apps/desktop/tests/project/pack-project.test.ts | keep | K3 | standard | 3 -> 3 |
| apps/desktop/tests/project/project-entries.test.ts | keep | K3 | standard | 16 -> 16 |
| apps/desktop/tests/project/project-file-hidden.test.ts | keep | K4 | standard | 3 -> 3 |
| apps/desktop/tests/project/project-file-import.test.ts | keep | K3 | standard | 4 -> 4 |
| apps/desktop/tests/project/project-file-tools.test.ts | keep | S2 | standard | 15 -> 15 |
| apps/desktop/tests/project/project-files.test.ts | keep | K3 | standard | 10 -> 10 |
| apps/desktop/tests/project/project-folders.test.ts | keep | K3 | standard | 10 -> 10 |
| apps/desktop/tests/project/project-lifecycle.test.ts | keep | S2 | standard | 16 -> 16 |
| apps/desktop/tests/project/project-linked.test.ts | keep | S2 | standard | 11 -> 11 |
| apps/desktop/tests/project/project-manager.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/project/project-tools.test.ts | keep | K4 | standard | 17 -> 17 |
| apps/desktop/tests/project/project-write-tools.test.ts | keep | K4 | standard | 15 -> 15 |
| apps/desktop/tests/project/second-project.test.ts | keep | K3 | standard | 3 -> 3 |
| apps/desktop/tests/status-extras/fold.test.ts | keep | K1 | critical | 3 -> 3 |
| apps/desktop/tests/tiled-import/tiled-import.test.ts | partial | K3 | critical | 10 -> 9 |
| apps/desktop/tests/ui-context/coverage.test.ts | wipe | W2 | - | 2 -> 0 |
| apps/desktop/tests/ui-context/derive-context.test.ts | keep | K1 | critical | 10 -> 10 |
| apps/desktop/tests/ui-context/evaluate.test.ts | partial | K1 | critical | 9 -> 8 |
| apps/desktop/tests/ui-context/matrix.test.ts | wipe | W4/W5 | - | 2 -> 0 |
| apps/desktop/tests/ui-context/surfaces.test.ts | partial | K1 | critical | 18 -> 6 |
| apps/desktop/tests/ui-context/swatch-columns.test.ts | partial | K1 | critical | 3 -> 2 |
| apps/desktop/tests/workspace/animation-migration.test.ts | keep | K3 | standard | 4 -> 4 |
| apps/desktop/tests/workspace/animation-save.test.ts | keep | K3 | standard | 1 -> 1 |
| apps/desktop/tests/workspace/animation-shared.test.ts | keep | K3 | standard | 1 -> 1 |
| apps/desktop/tests/workspace/brush-save.test.ts | keep | K3 | standard | 2 -> 2 |
| apps/desktop/tests/workspace/legacy-files.test.ts | keep | K3 | standard | 5 -> 5 |
| apps/desktop/tests/workspace/link-follow-id.test.ts | keep | S2 | standard | 2 -> 2 |
| apps/desktop/tests/workspace/many-assets.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/workspace/project-tabs.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/workspace/project-workspace.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/workspace/save-all-checks.test.ts | keep | K3 | standard | 3 -> 3 |
| apps/desktop/tests/workspace/save-all-refresh.test.ts | keep | K3 | standard | 3 -> 3 |
| apps/desktop/tests/workspace/save-as-path.test.ts | keep | K3 | standard | 2 -> 2 |
| apps/desktop/tests/workspace/saved-point.test.ts | keep | K3 | standard | 3 -> 3 |
| apps/desktop/tests/workspace/tilemap-save.test.ts | keep | K3 | standard | 2 -> 2 |
| apps/desktop/tests/workspace/trash-undo.test.ts | keep | K3 | standard | 1 -> 1 |

### Part 6: the end to end specs

Specs under `apps/desktop/tests/e2e`, judged by E1, E2, W3, W4, W7 and the doubt question. Every kept spec carries `{ tags: ['e2e'] }` on its top describe and names E1 in the title. 54 of 76 specs were deleted.

| File | Verdict | Rule | Tag | Cases before -> after |
|---|---|---|---|---|
| apps/desktop/tests/e2e/accessibility.e2e.ts | delete | W3 (axe audit of markup and roles in many static states) | - | 5 -> 0 |
| apps/desktop/tests/e2e/animation-assistant.e2e.ts | delete | W4 (MCP project read and write repeats project-assistant) | - | 4 -> 0 |
| apps/desktop/tests/e2e/animation-build.e2e.ts | keep | E1 | e2e | 4 -> 4 |
| apps/desktop/tests/e2e/animation-create.e2e.ts | delete | W4 (animation-build is the more complete journey) | - | 3 -> 0 |
| apps/desktop/tests/e2e/animation-directions.e2e.ts | delete | W4, doubt (export covered by animation-export, facings by unit) | - | 4 -> 0 |
| apps/desktop/tests/e2e/animation-drop.e2e.ts | delete | W4 (a drag gesture of the strip) | - | 1 -> 0 |
| apps/desktop/tests/e2e/animation-editor.e2e.ts | delete | W4, W3 (ghost offsets, playback in other states) | - | 5 -> 0 |
| apps/desktop/tests/e2e/animation-export.e2e.ts | keep | E1 | e2e | 3 -> 3 |
| apps/desktop/tests/e2e/animation-import.e2e.ts | delete | doubt (GIF and APNG decoding covered by packages/formats tests) | - | 2 -> 0 |
| apps/desktop/tests/e2e/animation-strip.e2e.ts | delete | W4, doubt (strip split covered by unit and project reopen) | - | 3 -> 0 |
| apps/desktop/tests/e2e/asset-kinds.e2e.ts | delete | W3 (which panels show per asset kind, menu order) | - | 4 -> 0 |
| apps/desktop/tests/e2e/asset-overview.e2e.ts | delete | W3 | - | 1 -> 0 |
| apps/desktop/tests/e2e/asset-workspace.e2e.ts | keep | E1 | e2e | 3 -> 3 |
| apps/desktop/tests/e2e/assets-panel.e2e.ts | delete | W4, doubt (list filters are UI; pack and unpack covered by packages/project pack test and pack-project test) | - | 2 -> 0 |
| apps/desktop/tests/e2e/assistant-permissions.e2e.ts | delete | W3, W4 (page lists, search, warning text; Read refusal repeated in mcp-grants) | - | 10 -> 0 |
| apps/desktop/tests/e2e/canvas-view.e2e.ts | delete | W3 (headers, rulers, zoom field, widget sections) | - | 6 -> 0 |
| apps/desktop/tests/e2e/config-hubs.e2e.ts | delete | W3, W4 (windows and defaults pages) | - | 3 -> 0 |
| apps/desktop/tests/e2e/context-menus.e2e.ts | delete | W4 (one menu in four states) | - | 4 -> 0 |
| apps/desktop/tests/e2e/contextual-ui.e2e.ts | delete | W3 (chrome shown per file type) | - | 3 -> 0 |
| apps/desktop/tests/e2e/crash-recovery.e2e.ts | keep | E1 | e2e | 1 -> 1 |
| apps/desktop/tests/e2e/crisp-output.e2e.ts | keep | E1 | e2e | 2 -> 2 |
| apps/desktop/tests/e2e/demo-project.e2e.ts | keep | E1 | e2e | 2 -> 2 |
| apps/desktop/tests/e2e/drawing-tools.e2e.ts | delete | W4 (one tool per case; tools covered by packages/raster tests; draw and undo kept in save-undo) | - | 8 -> 0 |
| apps/desktop/tests/e2e/export-preset.e2e.ts | delete | doubt (preset stored in the sprite file is covered by unit file format tests) | - | 1 -> 0 |
| apps/desktop/tests/e2e/file-type-picker.e2e.ts | delete | W3 | - | 1 -> 0 |
| apps/desktop/tests/e2e/guides.e2e.ts | delete | W4, W3 (guide drag and menus in five states) | - | 5 -> 0 |
| apps/desktop/tests/e2e/image-import.e2e.ts | keep | E1 | e2e | 2 -> 2 |
| apps/desktop/tests/e2e/keyboard-canvas.e2e.ts | keep | E1 | e2e | 4 -> 4 |
| apps/desktop/tests/e2e/keyboard-regions.e2e.ts | delete | W3, W4 (F6 focus order, toolbar arrows) | - | 5 -> 0 |
| apps/desktop/tests/e2e/keyboard-tilemap.e2e.ts | delete | W4 (same journey as keyboard-canvas on a map) | - | 1 -> 0 |
| apps/desktop/tests/e2e/layer-stack.e2e.ts | delete | W3, W4 (layer rows, eye drag, tags, selection) | - | 6 -> 0 |
| apps/desktop/tests/e2e/map-select.e2e.ts | delete | W4, doubt (mask logic covered by unit) | - | 4 -> 0 |
| apps/desktop/tests/e2e/mcp-app-control.e2e.ts | delete | W4 (feature list of app control tools) | - | 5 -> 0 |
| apps/desktop/tests/e2e/mcp-check7.e2e.ts | keep | E1 | e2e | 6 -> 6 |
| apps/desktop/tests/e2e/mcp-grants.e2e.ts | keep | E1 | e2e | 5 -> 5 |
| apps/desktop/tests/e2e/mcp-headless.e2e.ts | keep | E1 (also gained a describe so it can carry the tag) | e2e | 1 -> 1 |
| apps/desktop/tests/e2e/mcp-layout.e2e.ts | delete | W3 (docks, widths, toolbar positions) | - | 3 -> 0 |
| apps/desktop/tests/e2e/mcp-no-dialogs.e2e.ts | delete | W4 (save and export already in mcp-check7) | - | 3 -> 0 |
| apps/desktop/tests/e2e/mcp-palette.e2e.ts | delete | W4, doubt (swatch reorder covered by packages/palette tests) | - | 3 -> 0 |
| apps/desktop/tests/e2e/mcp-refusals.e2e.ts | delete | W4 (stale and invalid batch refusal in mcp-check7; palette cap and bounds covered by unit) | - | 5 -> 0 |
| apps/desktop/tests/e2e/mcp-restart.e2e.ts | keep | E1 | e2e | 5 -> 5 |
| apps/desktop/tests/e2e/mcp-settings.e2e.ts | keep | E1 | e2e | 4 -> 4 |
| apps/desktop/tests/e2e/mcp-timeline.e2e.ts | delete | W4 (a tool family, not a journey) | - | 5 -> 0 |
| apps/desktop/tests/e2e/mirror-undo.e2e.ts | delete | W4, doubt (mirror and tiled drawing covered by packages/raster) | - | 2 -> 0 |
| apps/desktop/tests/e2e/palette-panel.e2e.ts | delete | W3, W4 (focus, grid, list view, audit) | - | 7 -> 0 |
| apps/desktop/tests/e2e/project-assistant.e2e.ts | keep | E1 | e2e | 13 -> 13 |
| apps/desktop/tests/e2e/project-browser.e2e.ts | delete | W4 (grid, list and columns of one browser) | - | 4 -> 0 |
| apps/desktop/tests/e2e/project-folder-rows.e2e.ts | delete | W4 (New asset here repeats project-assistant file creation) | - | 3 -> 0 |
| apps/desktop/tests/e2e/project-health.e2e.ts | delete | W4 (link repair repeats project-moves; tags and collections are unit data) | - | 3 -> 0 |
| apps/desktop/tests/e2e/project-moves.e2e.ts | keep | E1 | e2e | 1 -> 1 |
| apps/desktop/tests/e2e/project-panel.e2e.ts | delete | W3, W4 (thumbnails, row editing, drop move) | - | 1 -> 0 |
| apps/desktop/tests/e2e/rotate-angle.e2e.ts | delete | doubt (rotation covered by packages/raster) | - | 1 -> 0 |
| apps/desktop/tests/e2e/safety.e2e.ts | keep | E1 | e2e | 3 -> 3 |
| apps/desktop/tests/e2e/save-as-folder-grant.e2e.ts | delete | W4 (same grant behavior as save-folder-grant) | - | 1 -> 0 |
| apps/desktop/tests/e2e/save-folder-grant.e2e.ts | keep | E1 | e2e | 1 -> 1 |
| apps/desktop/tests/e2e/save-undo.e2e.ts | trim | E1 (the project save case removed, W4) | e2e | 2 -> 1 |
| apps/desktop/tests/e2e/selection-transform.e2e.ts | delete | W4, doubt (transform covered by unit) | - | 3 -> 0 |
| apps/desktop/tests/e2e/sheet-batch.e2e.ts | delete | W4, doubt (slicing and batch edits covered by unit) | - | 4 -> 0 |
| apps/desktop/tests/e2e/sheet-drop.e2e.ts | delete | W4 (a drag gesture) | - | 1 -> 0 |
| apps/desktop/tests/e2e/sheet-export.e2e.ts | keep | E1 | e2e | 2 -> 2 |
| apps/desktop/tests/e2e/sheet-list.e2e.ts | delete | W3 (thumbnails, marks, sort headers) | - | 1 -> 0 |
| apps/desktop/tests/e2e/sheet-overlap.e2e.ts | delete | W3 | - | 1 -> 0 |
| apps/desktop/tests/e2e/sheet-tile-drag.e2e.ts | delete | W4 (five drops of one widget) | - | 5 -> 0 |
| apps/desktop/tests/e2e/sheet-widget.e2e.ts | delete | W3, W4 | - | 1 -> 0 |
| apps/desktop/tests/e2e/slice-tool.e2e.ts | delete | W4, doubt (slice rules covered by packages/raster tests small-artwork and sprite-slice) | - | 3 -> 0 |
| apps/desktop/tests/e2e/sprite-roundtrip.e2e.ts | keep | E1 | e2e | 2 -> 2 |
| apps/desktop/tests/e2e/swatch-edit.e2e.ts | delete | W4, doubt (recolour covered by packages/palette) | - | 2 -> 0 |
| apps/desktop/tests/e2e/tile-animation.e2e.ts | delete | W7 (timer luck of playing tiles), W4 | - | 4 -> 0 |
| apps/desktop/tests/e2e/tiled-import.e2e.ts | keep | E1 | e2e | 1 -> 1 |
| apps/desktop/tests/e2e/tiled-wrap.e2e.ts | delete | W4 (preview toggle of mirror-undo class, covered by raster) | - | 2 -> 0 |
| apps/desktop/tests/e2e/tilemap.e2e.ts | keep | E1 | e2e | 2 -> 2 |
| apps/desktop/tests/e2e/tileset.e2e.ts | delete | W3, W4 (tileset widget states) | - | 5 -> 0 |
| apps/desktop/tests/e2e/timeline-drops.e2e.ts | delete | W4 (one drop in five states) | - | 5 -> 0 |
| apps/desktop/tests/e2e/tools-options.e2e.ts | delete | W3, W4 | - | 5 -> 0 |
| apps/desktop/tests/e2e/tools-quiet.e2e.ts | delete | W7, W3 (DOM churn and heap measurements) | - | 2 -> 0 |
| apps/desktop/tests/e2e/transform-roundtrip.e2e.ts | delete | doubt (flips and turns covered by packages/raster) | - | 2 -> 0 |

## Deleted tests in critical areas

One row per deleted test case whose behavior falls under a K rule area: the file is tagged critical (fully or in part), or its rule column holds a K rule, or the whole file was deleted. Where a report did not name every case, one row stands for the cases it names. Cases deleted only from standard-tagged files with S rules (part 3 `area-findings`, `platform-preset`, `sprite-check`, `program-grant-render`; part 4 `apply-bar`, `layers`, `selection-extras`, `map-commands`, `group-facing`, `menu`, `menu-targets`, `tool-options`, `palette-panel-actions`, `panel-render`, `pivot`, `traits`, `virtual-grid`; part 5 `hint-body` and `palette-widget`) are not listed. File names are short: `document/`, `project/`, `raster/`, `palette/`, `presets/`, `formats/` and `mcp/` mean `packages/<name>/tests`; `desktop/` and the part 4 and 5 names are under `apps/desktop/tests`.

Part 6 rows are whole deleted e2e specs whose K behavior is left to unit tests (the doubt question). The other deleted specs are in the part 6 table above with their W rule.

| Part | File | Deleted case | Rule | Why it went |
|---|---|---|---|---|
| 1 | project/entry-kinds | covers every kind | W5 | Checks the test's own table against a constant. |
| 1 | project/entry-kinds | shows every kind but other by default | W5 | Asserts a constant equals its definition. |
| 1 | project/ids | is deterministic for the same bytes | W4 | Same input twice; the format cases already pin the output. |
| 1 | project/grant | grants nothing from a manifest edited to say edit | W4 | Same decision as the case for a manifest that says edit with nothing stored; K4 is still covered. |
| 1 | project/project-document | lists a role folder once and never the folder root | W4 | The new-project case already asserts the role folder order and the root exclusion. |
| 1 | document/animation-create | undoes and redoes in one step | W4 | Animation.create is in the it.each of animation-undo. |
| 1 | document/native-asset-v2 | lists a distinct mime type, extension and progId for every kind | W5 | Asserts a constant table. |
| 1 | document/engine-round-trip | flattens heart frame 1 to the fixture rows | W4 | Frame-render covers the flatten against an oracle. |
| 1 | document/engine-round-trip | maps indices to rgba with a transparent slot 0 | W4 | Frame-render covers the index to colour mapping against an oracle. |
| 1 | document/tile-native | opens a layer file of the wrong size | W4 | Same behavior is tested in native-sheet-tiles-v2; the damaged-checksum layer case stays. |
| 1 | document/tile-native | diagnoses cells whose key has no tile | W4 | Same behavior is tested in native-sheet-tiles-v2. |
| 1 | document/native-round-trip | encodes a held state exactly as before 50 later strokes | W4 | Snapshot-safety holds the same 50 strokes invariant. |
| 2 | raster/draw-shape | a line is stamped with a circle brush | W4 | A line with a circle brush and a mirrored outline repeat what the brush stamp and mirror tests already pin. |
| 2 | raster/draw-shape | a rectangle outline mirrors across a grid line | W4 | A line with a circle brush and a mirrored outline repeat what the brush stamp and mirror tests already pin. |
| 2 | raster/drawing-gradient | a dither with wrap on keeps its phase across a tile seam | W8 | The assertion compared the output with itself, so it could not fail. |
| 2 | raster/drawing-tools | the ink applies to shapes | W4 | Shape ink and separate fill index are the same option plumbing as the covered fill and stroke cases. |
| 2 | raster/drawing-tools | an ellipse takes a separate fill index too | W4 | Shape ink and separate fill index are the same option plumbing as the covered fill and stroke cases. |
| 2 | raster/ellipse | moving the corners moves the same pixels | W4 | Moving the corners is a translation of an already golden shape. |
| 2 | raster/flood-fill-global-mask | matches the index of the seed exactly | W4 | Exact index matching is already covered by the two-way split case. |
| 2 | raster/gradient-function | a vertical line makes horizontal bands | W4 | Bands, dither rows and ramp order are three more states of the one gradient golden. |
| 2 | raster/gradient-function | dither rows differ from one another | W4 | Bands, dither rows and ramp order are three more states of the one gradient golden. |
| 2 | raster/gradient-function | colours run in the order given, so a reversed ramp reverses the bands | W4 | Bands, dither rows and ramp order are three more states of the one gradient golden. |
| 2 | raster/line-points | a shallow line drawn from the other end covers the same pixels | W4 | Reversed line, step gaps and mirrored end points are re-statements of the octant goldens and the length test. |
| 2 | raster/line-points | no gaps: every step moves at most one pixel on each axis | W4 | Reversed line, step gaps and mirrored end points are re-statements of the octant goldens and the length test. |
| 2 | raster/line-points | mirroring the end points mirrors the pixels, which keeps symmetric strokes exact | W4 | Reversed line, step gaps and mirrored end points are re-statements of the octant goldens and the length test. |
| 2 | raster/outline-tools | differs from the quadratic curve over the first three points | W4 | A second state of a curve and a ramp already pinned by the main golden. |
| 2 | raster/outline-tools | down matches too, and stops at the ends of the ramp | W4 | A second state of a curve and a ramp already pinned by the main golden. |
| 2 | raster/paint-stroke | the corner stays by default | W8 | Default corner, largest list and empty mask are no-throw or no-change checks of paths already covered. |
| 2 | raster/paint-stroke | the largest point list paints without error | W8 | Default corner, largest list and empty mask are no-throw or no-change checks of paths already covered. |
| 2 | raster/paint-stroke | a mask that excludes everything leaves the buffer alone | W8 | Default corner, largest list and empty mask are no-throw or no-change checks of paths already covered. |
| 2 | raster/path-function | the brush thickens an outline | W4 | Brush thickness and a closed loop are further states of the covered path outline. |
| 2 | raster/path-function | fills a closed freehand loop | W4 | Brush thickness and a closed loop are further states of the covered path outline. |
| 2 | raster/pixel-perfect | a staircase going up is filtered the same way | W4 | Staircase direction, single L and run end are further states of the one filter golden. |
| 2 | raster/pixel-perfect | a single L becomes a diagonal step | W4 | Staircase direction, single L and run end are further states of the one filter golden. |
| 2 | raster/pixel-perfect | a corner at the end of a straight run drops only the corner pixel | W4 | Staircase direction, single L and run end are further states of the one filter golden. |
| 2 | raster/rotate-function | four quarter turns restore the pixels | W4 | Four turns and determinism restate the quarter turn golden. |
| 2 | raster/rotate-function | the same input always lands the same pixels | W4 | Four turns and determinism restate the quarter turn golden. |
| 2 | raster/selection-ops | shrink undoes expand on a mask that does not touch the edge | W4 | Identities of shrink/expand and empty combine restate the covered mode cases. |
| 2 | raster/selection-ops | replace with nothing clears and add of nothing keeps | W4 | Identities of shrink/expand and empty combine restate the covered mode cases. |
| 2 | raster/selection-shapes | select all sets every pixel and clear unsets them | W4 | Symmetry of a four circle and select all and clear restate covered shape and mask goldens. |
| 2 | raster/selection-shapes | a circle of four is symmetric | W4 | Symmetry of a four circle and select all and clear restate covered shape and mask goldens. |
| 2 | raster/stroke-points | a joint between two segments is not repeated | W4 | Joint and jump handling are states of the one stroke point golden. |
| 2 | raster/stroke-points | a pointer jump across the canvas is filled in | W4 | Joint and jump handling are states of the one stroke point golden. |
| 2 | raster/symmetry | a stroke that crosses the axis joins up with its mirror | W4 | A stroke crossing the axis is covered by the grid line and both axes goldens. |
| 2 | raster/transform-buffer | clockwise then counter-clockwise cancels, and two quarter turns equal a half turn | W4/W5 | Round-trip identities and the orientation name list restate the golden table and the point mapping test. |
| 2 | raster/transform-buffer | a flip and a half turn compose to the other flip | W4/W5 | Round-trip identities and the orientation name list restate the golden table and the point mapping test. |
| 2 | raster/transform-buffer | the orientation names cover every document flip axis and turn direction | W4/W5 | Round-trip identities and the orientation name list restate the golden table and the point mapping test. |
| 2 | raster/transform-region | a vertical flip swaps the two rows of the box | W4 | Flip rows and clipped orbit states repeat the orbit and golden cases. |
| 2 | raster/transform-region | drop what leaves the canvas | W4 | Flip rows and clipped orbit states repeat the orbit and golden cases. |
| 2 | raster/wrap-functions | a stroke that leaves the left edge continues from the right edge | W4 | Stroke, outline and fill wrap are the same seam logic as the covered wrap cases. |
| 2 | raster/wrap-functions | a rectangle outline wraps its far side | W4 | Stroke, outline and fill wrap are the same seam logic as the covered wrap cases. |
| 2 | raster/wrap-functions | a fill crosses the top and bottom seam | W4 | Stroke, outline and fill wrap are the same seam logic as the covered wrap cases. |
| 2 | raster/pixels-resample | a 45 degree rotsprite of a 32 by 32 sprite runs quickly | W7/W4 | A real clock performance bound (performance.now) and a not-equal-to-nearest check with no exact outcome. |
| 2 | raster/pixels-resample | rotsprite keeps a thick shape rounder than nearest at 30 degrees | W7/W4 | A real clock performance bound (performance.now) and a not-equal-to-nearest check with no exact outcome. |
| 2 | raster/pixels-shape | draws a filled rect | W4 | Filled rect is covered by the other shape goldens through the same command. |
| 2 | raster/pixels-transform | a vertical flip swaps the rows of the box | W4 | Vertical flip repeats the horizontal flip and sprite-level flip cases. |
| 2 | raster/sprite-flip | a vertical flip mirrors rows and the pivot height | W4 | Vertical flip and double flip are further states of the one flip contract. |
| 2 | raster/sprite-flip | two flips in one transaction restore the sprite exactly | W4 | Vertical flip and double flip are further states of the one flip contract. |
| 2 | raster/sprite-resize-trim | keeps a sprite whose cels already touch every edge | W4 | An already tight sprite is the no-op state of the covered trim case. |
| 2 | raster/sprite-turn-slices | a turned slice pivot keeps its place inside the slice | W4 | Slice pivot after a turn is covered by the slice turn golden. |
| 2 | raster/sprite-turn | a 3 by 2 sprite turned, undone and redone matches bit for bit in pixels, size and pivot | W4 | Undo and redo round trip of a turn are covered by the history contract tests. |
| 2 | raster/sprite-turn | a paint followed by a turn in the same transaction undoes exactly | W4 | Undo and redo round trip of a turn are covered by the history contract tests. |
| 2 | palette/census | is deterministic | W4 | Determinism restates the golden counts. |
| 2 | palette/dither | is deterministic | W4 | Determinism restates the golden output. |
| 2 | palette/extract | reduces many colours to a smaller palette | W4 | Size reduction is implied by the same-image same-output and cap cases. |
| 2 | palette/map | is deterministic | W4 | Determinism and the extract round trip restate the nearest colour goldens. |
| 2 | palette/map | maps an extracted palette back without leaving it | W4 | Determinism and the extract round trip restate the nearest colour goldens. |
| 2 | palette/palette-reorder | remaps through one table so slot 1 and slot 4 trade places | W4 | The table remap is another state of the render-identical reorder test. |
| 2 | palette/ramp-builder | reads white as lightness 1 and black as 0 | W4 | White and black lightness is inside the oklch round trip of black and white. |
| 2 | palette/sprite-import | is the same on every run | W4 | Determinism restates the dither origin golden. |
| 2 | presets/catalog | groups the presets by family in catalog order | W5 | A snapshot of the catalog data (family names and a count), changes whenever data is added. |
| 2 | presets/defaults | starts PICO-8 with the full fixed set | W5 | Restate constant tables of palette values per console, covered by the fixed palette and snapping tests. |
| 2 | presets/defaults | starts TIC-80 with Sweetie 16 | W5 | Restate constant tables of palette values per console, covered by the fixed palette and snapping tests. |
| 2 | presets/defaults | starts the Game Boy with its four shades | W5 | Restate constant tables of palette values per console, covered by the fixed palette and snapping tests. |
| 2 | presets/fixed-palettes | holds the documented count of valid colours | W5 | A snapshot of documented counts of constant data; validity and no repeats stay. |
| 2 | presets/snapping | snaps Master System colours to 2 bits per channel | W4 | Master System snapping is another state of the covered 2 bit / bits-per-channel model. |
| 2 | raster/brush-stamp | table rows: circle sizes 5 to 8, square size 2 and 7 (case still runs) | W4 | Boundary and distinct-branch rows stay. |
| 2 | raster/ellipse | table rows: 4 boxes (case still runs) | W4 | Boundary and distinct-branch rows stay. |
| 2 | raster/line-points | table rows: 7 octants (case still runs) | W4 | Boundary and distinct-branch rows stay. |
| 2 | raster/rect | table rows: 4 rows (case still runs) | W4 | Boundary and distinct-branch rows stay. |
| 2 | raster/symmetry | table rows: horizontal axis stroke, brush sizes 4 to 6 (case still runs) | W4 | Boundary and distinct-branch rows stay. |
| 2 | raster/flood-fill | table rows: 2 rows (case still runs) | W4 | Boundary and distinct-branch rows stay. |
| 2 | raster/pixels-replace-clear | one assertion, toBeGreaterThanOrEqual(0) (case still runs) | W8 | The assertion cannot fail. |
| 3 | formats/png-errors | decodes an unmodified copy | W4 | A control case; png-rgba already round trips valid files. |
| 3 | formats/png-scale | only creates colours that already exist | W4 | Repeats the pixel-repeat and step cases. |
| 3 | formats/png-scale | never invents a colour | W4 | Repeats the pixel-repeat and step cases. |
| 3 | formats/png-scale | keeps the long side at or below 256 | W4 | Repeats the other thumbnail cases. |
| 3 | formats/png-scale | accepts a smaller maximum side | W4 | Repeats the downscale case. |
| 3 | mcp/limits | is 960 KiB | W5 | A constant; the boundary case at the budget still pins the number. |
| 3 | mcp/limits | publishes the limits table | W5 | A constants table. |
| 3 | mcp/catalogue | marks the two step tools as routed | W5 | A constant of the catalogue, not behavior. |
| 3 | mcp/catalogue | routes run_command and keeps the restart behind its permission | W5 | A constant of the catalogue, not behavior. |
| 3 | mcp/catalogue | lists twelve bundles | W5 | A constant of the catalogue, not behavior. |
| 3 | mcp/errors-bridge | names every route under bxel:mcp | W2 | Structure of a constants table. |
| 3 | mcp/errors-bridge | marks an ok result | W5 | An object literal. |
| 3 | mcp/tool-schemas | writes with exactly the seventeen writing tools | W4 | The same list as the catalogue test. The file is tagged standard (K2). |
| 3 | desktop/assistant/command-manifest | has an entry for every command | W2 | Cross-table consistency; lint rule candidate below. |
| 3 | desktop/assistant/command-manifest | has no entry for a command that does not exist | W2 | Cross-table consistency; lint rule candidate below. |
| 3 | desktop/assistant/command-manifest | places each command in a real bundle with a real args kind | W2 | Cross-table consistency; lint rule candidate below. |
| 3 | desktop/assistant/command-manifest | marks the zoom, grid and playback commands as show | W5 | A constants table. The refusal and direct-run cases stay. |
| 3 | desktop/assistant/grant-model | shows every bundle and every tool once, each with a description | W2 | Structure of the rows table. |
| 3 | desktop/assistant/no-dialog-paths (whole file) | walks the import graph and greps source text (2 cases) | W1 | Lint rule candidate below; the runtime guard in save-no-dialogs still tests the behavior. |
| 3 | desktop/grants/step-bundles | places each document, palette and raster command | W2 | Table consistency. The grant-check case over the real command names stays. |
| 3 | desktop/platform/spelling (whole file) | scans all source files for the word "color" (2 cases) | W1, W10 | Reads source text; lint rule candidate below. |
| 3 | desktop/platform/assistant-strict | wraps every command in the guard | W2 | Compares function identity of two arrays, a structure check; the guard behavior is covered by the other cases. The file is tagged standard (K4). |
| 3 | desktop/platform/preset-preview | describes every preset in the catalog | W5 | A loop over a constants table with a length floor. |
| 3 | desktop/config/project-hub-pages (whole file) | only asserts a mock was called | W6 | No outcome of behavior. |
| 3 | desktop/config/project-hub-pages (whole file) | asserts page order and title constants | W5 | Constants. |
| 4 | canvas-look/canvas-look | are valid and part of the app defaults | W5 | Constants. |
| 4 | canvas-look/canvas-look | use hex colours, with a dark and close pair | W5 | Constants. |
| 4 | canvas-look/canvas-look | keep every number inside its range | W5 | Constants. |
| 4 | view-zoom/view-zoom | keeps every preset inside the allowed range | W5 | Constants. |
| 4 | editor/held-colours | start with four different colours | W5 | Defaults and setter. |
| 4 | editor/held-colours | set each of the four slots on its own | W5 | Defaults and setter. |
| 4 | editor/history | fills with the front colour and undoes it | W4 | Same undo behavior. |
| 4 | editor/shapes | draws the constrained shape on the overlay | W4 | Same constrain behavior. |
| 4 | editor/tools | sets the front and back colours and swaps them | W5 | Setter, swap covered in held-colours. |
| 4 | selection/delete-routing | has one owner per zone, so the focused panel decides what is deleted | W4 | Derived from the owner table. |
| 4 | selection/delete-routing | keeps Escape for the shell escape stack, not for a command chord | W5 | Constant chord. |
| 4 | timeline/layout | start as the defaults | W5 | Defaults equal constants. |
| 4 | toolbars/toolbar-definitions | name three toolbars with unique ids | W5, W2 | Constants; W2 structure rule. |
| 4 | toolbars/toolbar-definitions | start the canvas and option toolbars on top and the tools on the left | W5, W2 | Constants; W2 structure rule. |
| 4 | toolbars/toolbar-definitions | show every toolbar from the start and give each a label | W5, W2 | Constants; W2 structure rule. |
| 4 | tools/tool-catalogue | gives every slot and member a unique id, a name and a description | W2, W5 | Registry structure rules; W5 constant tables. |
| 4 | tools/tool-catalogue | feeds one select command per tool, on the key of its slot | W2, W5 | Registry structure rules; W5 constant tables. |
| 4 | tools/tool-catalogue | feeds a cycle back command for every slot with variants | W2, W5 | Registry structure rules; W5 constant tables. |
| 4 | tools/tool-catalogue | gives the map its own member ids and keeps the same keys | W2, W5 | Registry structure rules; W5 constant tables. |
| 4 | swatches/swatch-library | has one set per platform preset, with unique keys | W5 | Built-in data tables. |
| 4 | swatches/swatch-library | holds only opaque hex colours, without the transparent slot | W5 | Built-in data tables. |
| 4 | swatches/swatch-library | keeps the fixed colours of a fantasy console | W5 | Built-in data tables. |
| 5 | dialogs/image-import | cancel changes nothing | doubt question | Only shows then hides a dialog store; the import path is covered by the transaction tests beside it. |
| 5 | dialogs/new-sprite | creates nothing when the dialog is cancelled | doubt question | Store show and hide with no outcome beyond a store flag. |
| 5 | dialogs/new-sprite | defaults to 16 (constant assertions only, the case stays) | W5 | The LIMIT_DEFAULT, LIMIT_PRESETS and NEW_MEMORY_DEFAULT assertions were removed; the limitError boundaries stay. |
| 5 | dialogs/palette-change | cancel clears the proposal | W5 | A store reset. |
| 5 | dialogs/palette-source | lists Bxel 16 first with 15 colours | W5 | Asserts a constants table. |
| 5 | files/recent-list | sits under File right after Open | W2 | Menu order, a structure fact. |
| 5 | hints/hint-data | hint text checks | W2, W5, W10 | Prose and dash checks. |
| 5 | hints/hint-data | point only at commands that exist | W2, W5, W10 | Id-exists check. |
| 5 | hints/hint-data | keep the key out of button names | W2, W5, W10 | Table-shape check. |
| 5 | hints/hint-data | gives every tool a description | W2, W5, W10 | Table-shape check. |
| 5 | hints/hint-data | adds a help entry | W2, W5, W10 | Table-shape check. |
| 5 | hints/hint-data | lists the rows of the current tool | W2, W5, W10 | Table-shape check. |
| 5 | hints/hint-data | teaches the wheel | W2, W5, W10 | Prose check. |
| 5 | hints/menu-order | 17 of 22 cases (menu order and structure) | W2, W4, W8 | Kind menus, Edit and layer menus; the dim-with-reason and hide cases stay. |
| 5 | keymap/keymap | chord clash | W2, W5 | Keymap table structure. |
| 5 | keymap/keymap | unique id and label | W2, W5 | Keymap table structure. |
| 5 | keymap/keymap | tool letter keys | W2, W5 | Keymap table structure. |
| 5 | keymap/keymap | contract chords (the `scoped.length > 30` assertion went too) | W2, W5 | Keymap table structure and a constant. |
| 5 | keymap/keymap | drive the viewport | W6 | Only asserts mock calls. |
| 5 | keymap/keymap | open the shortcut list | W6 | Only asserts mock calls. |
| 5 | keymap/command-reasons (whole file) | reason wording (4 cases) | W2, W5 | Wording and table shape of disabled-command reasons. |
| 5 | keymap/timeline-keys (whole file) | chord uniqueness inside a zone (4 cases) | W2 | Table structure rule. |
| 5 | keymap/zones (whole file) | zone constants and one Delete owner per zone (5 cases) | W2, W5 | Constants and a structure rule. |
| 5 | context-menu/menu-commands (whole file) | context menus name only registered commands (2 cases) | W2 | Structure rule. |
| 5 | ui-context/coverage (whole file) | the rule table covers every command (2 cases) | W2 | Structure rule; lint rule candidate below. |
| 5 | ui-context/matrix (whole file) | a snapshot of the visibility matrix (2 cases) | W4, W5 | Restates the rule table. |
| 5 | ui-context/surfaces | 12 of 18 cases (rail, toolbar and status variants) | W4 | Variants of one rule in different contexts; one per rule and the separator cases stay. |
| 5 | ui-context/evaluate | retires the old duplicate frame command everywhere | W8 | Code that is removed. |
| 5 | ui-context/swatch-columns | wraps 16 swatches in two rows of 8 | W4 | A second state of the same wrap rule; the boundary cases stay. |
| 5 | panel-browser/project-browser | gives every row its position in the set | W3 | Accessibility attribute markup. |
| 5 | panel-browser/project-browser | reads kind, is, uses and in tokens with the shared parser | W4 | Duplicate of query-grammar. |
| 5 | tiled-import | reads the orientation of an isometric map | W4 | The same behavior as the orientation-import test. |
| 5 | demo/demo-project | every committed file is what the encoders write today | W3 | A byte snapshot of real files in the repo, outside a temp folder. The BXEL_WRITE_DEMO=1 generator block stays. |
| 6 | animation-directions | whole spec (4 cases) | doubt question | W4, doubt (export covered by animation-export, facings by unit) |
| 6 | animation-import | whole spec (2 cases) | doubt question | Doubt (GIF and APNG decoding covered by packages/formats tests) |
| 6 | animation-strip | whole spec (3 cases) | doubt question | W4, doubt (strip split covered by unit and project reopen) |
| 6 | assets-panel | whole spec (2 cases) | doubt question | W4, doubt (list filters are UI; pack and unpack covered by packages/project pack test and pack-project test) |
| 6 | export-preset | whole spec (1 case) | doubt question | Doubt (preset stored in the sprite file is covered by unit file format tests) |
| 6 | map-select | whole spec (4 cases) | doubt question | W4, doubt (mask logic covered by unit) |
| 6 | mcp-palette | whole spec (3 cases) | doubt question | W4, doubt (swatch reorder covered by packages/palette tests) |
| 6 | mirror-undo | whole spec (2 cases) | doubt question | W4, doubt (mirror and tiled drawing covered by packages/raster) |
| 6 | rotate-angle | whole spec (1 case) | doubt question | Doubt (rotation covered by packages/raster) |
| 6 | selection-transform | whole spec (3 cases) | doubt question | W4, doubt (transform covered by unit) |
| 6 | sheet-batch | whole spec (4 cases) | doubt question | W4, doubt (slicing and batch edits covered by unit) |
| 6 | slice-tool | whole spec (3 cases) | doubt question | W4, doubt (slice rules covered by packages/raster tests small-artwork and sprite-slice) |
| 6 | swatch-edit | whole spec (2 cases) | doubt question | W4, doubt (recolour covered by packages/palette) |
| 6 | transform-roundtrip | whole spec (2 cases) | doubt question | Doubt (flips and turns covered by packages/raster) |

Other deletions in all parts were duplicate states, markup, constants or tests of removed code (W3, W4, W5, W8); none leaves K1 to K5 logic uncovered, apart from the gaps named in the open points.

## Lint rule candidates (W1/W2, not written)

Tests dropped because a lint, type or structure rule should hold them. No rule was written in this pass. Parts 1, 2 and 6 found none.

From part 3 (formats, mcp, assistant, platform):

- No dialog, file picker or confirm on the assistant tool path: forbid `confirmAction|confirmSave|confirmChoice|documents.saveAs|open|openFolder|regrant|owner-prompts|file-kit|useDialogStore` in any file reachable from `src/assistant/tool-handlers.constants.ts` and `guard-handlers.ts` (except `prompts/guard-documents.ts`). The runtime guard in `save-no-dialogs` still tests the behavior.
- Spelling: no American "color" in a string literal with a space, in `apps/desktop/src` and `packages/*/src` (proper noun "Game Boy Color" excepted).
- Command manifest closure: every id in `APP_COMMANDS` has an entry in `MANIFEST` and the reverse; each entry's `area` is in `BUNDLE_IDS` and its `args` kind is in `ARGS_KINDS` (better as a type: make `MANIFEST` a `Record<AppCommandId, Entry>`).
- Step bundle closure: every command name in `APP_COMMANDS` is placed by `bundleOfStep` (a typed table keyed by command prefix would make it a compile error).
- Permissions rows closure: `TOOL_TEXT` has a non-empty text for every key of `TOOL_ROWS`, and `bundleRows` lists every `BUNDLE_IDS` entry (a `Record<ToolRowId, string>` type covers the first).
- Command guard wrapping: every command of `documentCommands`, `paletteCommands` and `rasterCommands` goes through the guard in `APP_COMMANDS` (a typed factory would enforce it).
- MCP route names: every `MCP_ROUTE` value starts with `bxel:mcp:` and is unique (a template literal type covers it).
- Prose: no em or en dashes in the permission page strings (a lint rule over string literals under `views/AssistantPanel`).

From part 4 (desktop editor):

- Every tilemap command is registered once on a known group (registry structure; `tilemap/map-commands`).
- A menu has at most twelve entries and fixed entry counts (menu structure; `timeline/menu` and `timeline/menu-targets`).
- Tool catalogue: unique ids, names and descriptions per slot and member, one select command per tool on the key of its slot, a cycle back command for every slot with variants (registry structure; `tools/tool-catalogue`).
- Tool options: every option has an id of its tool, a label and a description; numbers have a range; toggles and actions have an icon; choices have at least two described values and a default; every paint option has a command (registry structure; `tools/tool-options`).
- Toolbar definitions: unique toolbar ids and labels, default sides, all shown (definition structure; `toolbars/toolbar-definitions`).

From part 5 (desktop shell):

- Context menus name only registered commands and have entries.
- Every disabled command carries a reason; the reason is a full sentence, ends in a full stop, and holds no dashes.
- Hint texts are non-empty, one line, plain prose with no dashes.
- Hint shortcut commands exist in the keymap.
- Button hint names carry no key text.
- Every tool has a description.
- Keymap table: unique ids, label and group set, no chord clashes, no unzoned command on a zoned chord.
- Timeline zone keys: no chord repeats and no collision with app chords.
- Native edit commands set whileTyping false.
- COMMAND_ZONE values, and one Delete owner per zone.
- The ui-context rule table covers every app command and holds no stray ids.
- Menu order and structure.

## Open points

Judgment calls the parts flagged, for the checker and the owner.

Config and checks:

- The vitest tags `critical`, `standard` and `e2e` must be declared in the vitest config (`test.tags`) if strict tags is on. Parts 1, 2, 3 and 5 did not touch the config (outside the test files); the checker should confirm it.
- No test, lint, typecheck or build was run. Unused imports left by the deletions were removed by reading or grepping the files, so a few may remain; the checker should run lint on the changed files.
- Part 3 files were CRLF; the edits kept CRLF.

Tags that differ from the rule letter, or mixed tags in a file, on purpose:

- Part 1: rejection-only describes (`engine-rejection`, map.paint guards, layer.merge rules, native open checks and damage) are S3 and tagged standard. If the owner wants command refusals in the critical gate, they flip to K4 or K1 with no other change.
- Part 2: `palette/remap-output` (300 by 300 whole-engine golden hash), `raster/engine-output` and `raster/engine-history-bytes` (2048 by 2048 sprite) are tagged standard (S2) because they may exceed the one second critical bound. Retag to critical if they measure under 1 s.
- Part 3: platform, config and recovery tests build a real in-memory document host and zustand stores, so they are tagged standard (S2), not critical. If the owner reads critical more broadly, many could move up; none spawns, sleeps or touches a real file. `tool-schemas` builds the schema of all 44 tools at module load and is tagged standard because it could not be timed; likely under 1 s, then it can go critical. `claim-files` and `export-target-kind` create real temp folders and stay critical per the temp folder rule. `recent-ids` is mixed by describe (pure id function critical, tool run standard). K4 files `save-no-dialogs`, `strict-mode` and `assistant-strict`, and K3 files `open-keeps-names`, `project-restore` and `restore-flow`, are tagged standard because they run through the document host.
- Part 4: some K3 and K2 integration files are tagged standard because they use the document host (the tag follows what the test needs). `sheet-manager/manager-views` is tagged critical although it uses fake timers; the timers are deterministic. `toolbars/toolbar-definitions` and `toolbar-items` are tagged critical although they load modules through mocks. `tilemap/map-stamp` is S2 standard with a K3 critical describe. `panel-render` lost its four renderToString markup cases (W3); the list rows and action menu cases remain. `editor/apply-bar` keeps two cases that drive the pending store through a local helper.
- Part 5: `demo/demo-project` test 2 reads the committed demo project from the repo, so it is tagged standard rather than critical. The `BXEL_WRITE_DEMO=1` generator block stays and could become a tool under `.claude/tools/`.

Coverage gaps named by the parts (K behavior with less coverage after the clean-up):

- Part 6: the 14 doubt-question specs (the part 6 rows above) rely on unit tests in packages/formats, project, raster and palette for their behavior.
- Part 3: the import-graph check of `no-dialog-paths` is gone until the lint rule candidate is written; the runtime guard in `save-no-dialogs` still tests the behavior.

Known follow-ups:

- I-148: the crash-recovery e2e (`crash-recovery.e2e.ts`) waits a fixed 9 s for the first snapshot and 1.5 s after the kill (W7 by the letter). It is the release blocker journey, so it stays. The wait should become a poll on the snapshot file once Brock exposes the snapshot folder path to the spec. It needs Brock's snapshot folder path.
- `mcp-restart.e2e.ts` keeps its 300 s describe timeout. `mcp-headless.e2e.ts` gained a describe so it can carry the tag.
- The CI template (`.github/workflows/ci.yml`, managed by `brock sync`) still calls the old test scripts. This was sent to the Brock lead.
