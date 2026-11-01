# Test clean-up part 2: raster, palette, presets

Standard: `X:/ai-config/docs/test-standard.md`. Scope: every `*.test.ts` under `packages/raster/tests`, `packages/palette/tests`, `packages/presets/tests`. Benchmarks and helper files are untouched. A case is one `it`/`test` call site; an `it.each`/`test.each` counts as one. Data-table rows dropped from a `test.each` table keep the case count and are marked partial.

No file was wiped: every file holds at least one behavior of a K or S rule. Every kept test sits under a top-level `describe` titled with its rule and tagged with one vitest tag.

## Per file

| file | verdict | rule | tag | cases before -> after |
|---|---|---|---|---|
| raster/tests/brush-stamp.test.ts | partial | K1 | critical | 5 -> 5 |
| raster/tests/draw-shape.test.ts | partial | K1 | critical | 10 -> 8 |
| raster/tests/drawing-gradient.test.ts | partial | K1 | critical | 4 -> 3 |
| raster/tests/drawing-tools.test.ts | partial | K1 | critical | 30 -> 28 |
| raster/tests/ellipse.test.ts | partial | K1 | critical | 7 -> 6 |
| raster/tests/extend-trail.test.ts | keep | K1 | critical | 4 -> 4 |
| raster/tests/flood-fill-global-mask.test.ts | partial | K1 | critical | 12 -> 11 |
| raster/tests/flood-fill.test.ts | partial | K1 | critical | 3 -> 3 |
| raster/tests/frame-sprites.test.ts | keep | K1 | critical | 1 -> 1 |
| raster/tests/gradient-function.test.ts | partial | K1 | critical | 10 -> 7 |
| raster/tests/line-points.test.ts | partial | K1 | critical | 6 -> 3 |
| raster/tests/outline-tools.test.ts | partial | K1 | critical | 14 -> 12 |
| raster/tests/paint-stroke.test.ts | partial | K1 | critical | 15 -> 12 |
| raster/tests/path-function.test.ts | partial | K1 | critical | 13 -> 11 |
| raster/tests/pixel-perfect.test.ts | partial | K1 | critical | 8 -> 5 |
| raster/tests/region-functions.test.ts | keep | K1 | critical | 14 -> 14 |
| raster/tests/resample.test.ts | keep | K1 | critical | 6 -> 6 |
| raster/tests/rect.test.ts | partial | K1 | critical | 4 -> 4 |
| raster/tests/rotate-function.test.ts | partial | K1 | critical | 8 -> 6 |
| raster/tests/selection-ops.test.ts | partial | K1 | critical | 19 -> 17 |
| raster/tests/selection-shapes.test.ts | partial | K1 | critical | 13 -> 11 |
| raster/tests/selection-tools.test.ts | keep | K1 | critical | 8 -> 8 |
| raster/tests/shade-stamp-function.test.ts | keep | K1 | critical | 11 -> 11 |
| raster/tests/sprite-created.test.ts | keep | K1 | critical | 3 -> 3 |
| raster/tests/stroke-points.test.ts | partial | K1 | critical | 6 -> 4 |
| raster/tests/symmetry.test.ts | partial | K1 | critical | 11 -> 10 |
| raster/tests/transform-buffer.test.ts | partial | K1 | critical | 11 -> 8 |
| raster/tests/transform-region.test.ts | partial | K1 | critical | 12 -> 10 |
| raster/tests/wrap-functions.test.ts | partial | K1 | critical | 16 -> 13 |
| raster/tests/pixels-erase.test.ts | keep | K2 | critical | 5 -> 5 |
| raster/tests/pixels-fill.test.ts | keep | K2 | critical | 8 -> 8 |
| raster/tests/pixels-gradient-stamp.test.ts | keep | K2 | critical | 13 -> 13 |
| raster/tests/pixels-linked.test.ts | keep | K2 | critical | 2 -> 2 |
| raster/tests/pixels-paint-options.test.ts | keep | K2 | critical | 8 -> 8 |
| raster/tests/pixels-paint.test.ts | keep | K2 | critical | 7 -> 7 |
| raster/tests/pixels-move.test.ts | keep | K2 | critical | 8 -> 8 |
| raster/tests/pixels-rotate.test.ts | keep | K2 | critical | 11 -> 11 |
| raster/tests/pixels-scale.test.ts | keep | K2 | critical | 10 -> 10 |
| raster/tests/pixels-shade.test.ts | keep | K2 | critical | 9 -> 9 |
| raster/tests/pixels-shape-paths.test.ts | keep | K2 | critical | 7 -> 7 |
| raster/tests/pixels-wrap.test.ts | keep | K2 | critical | 8 -> 8 |
| raster/tests/sprite-merge.test.ts | keep | K2 | critical | 7 -> 7 |
| raster/tests/sprite-slice-islands.test.ts | keep | K2 | critical | 5 -> 5 |
| raster/tests/sprite-split-slice.test.ts | keep | K2 | critical | 10 -> 10 |
| raster/tests/pixels-replace-clear.test.ts | partial | K2 | critical | 15 -> 15 |
| raster/tests/pixels-resample.test.ts | partial | K2 | critical | 16 -> 14 |
| raster/tests/pixels-shape.test.ts | partial | K2 | critical | 5 -> 4 |
| raster/tests/pixels-transform.test.ts | partial | K2 | critical | 14 -> 13 |
| raster/tests/sprite-flip.test.ts | partial | K2 | critical | 9 -> 7 |
| raster/tests/sprite-resize-trim.test.ts | partial | K2 | critical | 10 -> 9 |
| raster/tests/sprite-turn-slices.test.ts | partial | K2 | critical | 3 -> 2 |
| raster/tests/sprite-turn.test.ts | partial | K2 | critical | 13 -> 11 |
| raster/tests/pixels-history.test.ts | keep | K3 | critical | 3 -> 3 |
| raster/tests/selection-saved.test.ts | keep | K3 | critical | 5 -> 5 |
| raster/tests/engine-history-bytes.test.ts | keep | S2 | standard | 2 -> 2 |
| raster/tests/engine-output.test.ts | keep | S2 | standard | 1 -> 1 |
| palette/tests/animation-import.test.ts | keep | K2 | critical | 4 -> 4 |
| palette/tests/census.test.ts | partial | K1 | critical | 6 -> 5 |
| palette/tests/dither.test.ts | partial | K1 | critical | 7 -> 6 |
| palette/tests/extract.test.ts | partial | K1 | critical | 6 -> 5 |
| palette/tests/hex.test.ts | keep | K1 | critical | 4 -> 4 |
| palette/tests/import-transaction.test.ts | keep | K3 | critical | 6 -> 6 |
| palette/tests/map.test.ts | partial | K1 | critical | 10 -> 8 |
| palette/tests/palette-assign.test.ts | keep | K2 | critical | 6 -> 6 |
| palette/tests/palette-bank-lifecycle.test.ts | keep | K2 | critical | 8 -> 8 |
| palette/tests/palette-clean-up.test.ts | keep | K2 | critical | 5 -> 5 |
| palette/tests/palette-create.test.ts | keep | K2 | critical | 10 -> 10 |
| palette/tests/palette-duplicate.test.ts | keep | K2 | critical | 3 -> 3 |
| palette/tests/palette-import.test.ts | keep | K2 | critical | 11 -> 11 |
| palette/tests/palette-rejection.test.ts | keep | K4 | critical | 11 -> 11 |
| palette/tests/palette-reorder.test.ts | partial | K2 | critical | 4 -> 3 |
| palette/tests/palette-resize.test.ts | keep | K2 | critical | 6 -> 6 |
| palette/tests/palette-update.test.ts | keep | K2 | critical | 12 -> 12 |
| palette/tests/ramp-builder.test.ts | partial | K1 | critical | 8 -> 7 |
| palette/tests/ramp-commands.test.ts | keep | K2 | critical | 9 -> 9 |
| palette/tests/remap-output.test.ts | keep | S2 | standard | 1 -> 1 |
| palette/tests/remap.test.ts | keep | K1 | critical | 10 -> 10 |
| palette/tests/sheet-import.test.ts | keep | K2 | critical | 5 -> 5 |
| palette/tests/sprite-import.test.ts | partial | K2 | critical | 17 -> 16 |
| palette/tests/swatch-alpha.test.ts | keep | K2 | critical | 9 -> 9 |
| palette/tests/swatch-commands.test.ts | keep | K2 | critical | 7 -> 7 |
| palette/tests/swatch-delete.test.ts | keep | K2 | critical | 9 -> 9 |
| palette/tests/swatch-merge.test.ts | keep | K2 | critical | 5 -> 5 |
| palette/tests/tileset-import.test.ts | keep | K2 | critical | 4 -> 4 |
| palette/tests/usage.test.ts | keep | K1 | critical | 6 -> 6 |
| presets/tests/area-errors.test.ts | keep | K1 | critical | 3 -> 3 |
| presets/tests/areas.test.ts | keep | K1 | critical | 7 -> 7 |
| presets/tests/catalog.test.ts | partial | K1 | critical | 4 -> 3 |
| presets/tests/defaults.test.ts | partial | K1 | critical | 6 -> 3 |
| presets/tests/fixed-palettes.test.ts | partial | K1 | critical | 3 -> 2 |
| presets/tests/new-breaks.test.ts | keep | K1 | critical | 6 -> 6 |
| presets/tests/platform-check.test.ts | keep | K1 | critical | 7 -> 7 |
| presets/tests/snapping.test.ts | partial | K1 | critical | 11 -> 10 |
| presets/tests/sprite-sizes.test.ts | keep | K1 | critical | 6 -> 6 |

## Totals

Files: 94 before, 94 after (0 wiped). Cases: 760 before, 696 after (64 deleted).

| package | files | cases before | cases after |
|---|---|---|---|
| raster | 56 | 498 | 448 |
| palette | 29 | 209 | 201 |
| presets | 9 | 53 | 47 |

| tag | files | cases after |
|---|---|---|
| critical | 91 | 692 |
| standard | 3 | 4 |
| e2e | 0 | 0 |

## Deleted tests and dropped rows (reason per K-rule file)

- raster/draw-shape: W4: a line with a circle brush and a mirrored outline repeat what the brush stamp and mirror tests already pin. (a line is stamped with a circle brush; a rectangle outline mirrors across a grid line)
- raster/drawing-gradient: W8: the assertion compared the output with itself, so it could not fail. (a dither with wrap on keeps its phase across a tile seam)
- raster/drawing-tools: W4: shape ink and separate fill index are the same option plumbing as the covered fill and stroke cases. (the ink applies to shapes; an ellipse takes a separate fill index too)
- raster/ellipse: W4: moving the corners is a translation of an already golden shape. (moving the corners moves the same pixels)
- raster/flood-fill-global-mask: W4: exact index matching is already covered by the two-way split case. (matches the index of the seed exactly)
- raster/gradient-function: W4: bands, dither rows and ramp order are three more states of the one gradient golden. (a vertical line makes horizontal bands; dither rows differ from one another; colours run in the order given, so a reversed ramp reverses the bands)
- raster/line-points: W4: reversed line, step gaps and mirrored end points are re-statements of the octant goldens and the length test. (a shallow line drawn from the other end covers the same pixels; no gaps: every step moves at most one pixel on each axis; mirroring the end points mirrors the pixels, which keeps symmetric strokes exact)
- raster/outline-tools: W4: a second state of a curve and a ramp already pinned by the main golden. (differs from the quadratic curve over the first three points; down matches too, and stops at the ends of the ramp)
- raster/paint-stroke: W8: default corner, largest list and empty mask are no-throw or no-change checks of paths already covered. (the corner stays by default; the largest point list paints without error; a mask that excludes everything leaves the buffer alone)
- raster/path-function: W4: brush thickness and a closed loop are further states of the covered path outline. (the brush thickens an outline; fills a closed freehand loop)
- raster/pixel-perfect: W4: staircase direction, single L and run end are further states of the one filter golden. (a staircase going up is filtered the same way; a single L becomes a diagonal step; a corner at the end of a straight run drops only the corner pixel)
- raster/rotate-function: W4: four turns and determinism restate the quarter turn golden. (four quarter turns restore the pixels; the same input always lands the same pixels)
- raster/selection-ops: W4: identities of shrink/expand and empty combine restate the covered mode cases. (shrink undoes expand on a mask that does not touch the edge; replace with nothing clears and add of nothing keeps)
- raster/selection-shapes: W4: symmetry of a four circle and select all and clear restate covered shape and mask goldens. (select all sets every pixel and clear unsets them; a circle of four is symmetric)
- raster/stroke-points: W4: joint and jump handling are states of the one stroke point golden. (a joint between two segments is not repeated; a pointer jump across the canvas is filled in)
- raster/symmetry: W4: a stroke crossing the axis is covered by the grid line and both axes goldens. (a stroke that crosses the axis joins up with its mirror)
- raster/transform-buffer: W4/W5: round-trip identities and the orientation name list restate the golden table and the point mapping test. (clockwise then counter-clockwise cancels, and two quarter turns equal a half turn; a flip and a half turn compose to the other flip; the orientation names cover every document flip axis and turn direction)
- raster/transform-region: W4: flip rows and clipped orbit states repeat the orbit and golden cases. (a vertical flip swaps the two rows of the box; drop what leaves the canvas)
- raster/wrap-functions: W4: stroke, outline and fill wrap are the same seam logic as the covered wrap cases. (a stroke that leaves the left edge continues from the right edge; a rectangle outline wraps its far side; a fill crosses the top and bottom seam)
- raster/pixels-resample: W7/W4: a real clock performance bound (performance.now) and a not-equal-to-nearest check with no exact outcome. (a 45 degree rotsprite of a 32 by 32 sprite runs quickly; rotsprite keeps a thick shape rounder than nearest at 30 degrees)
- raster/pixels-shape: W4: filled rect is covered by the other shape goldens through the same command. (draws a filled rect)
- raster/pixels-transform: W4: vertical flip repeats the horizontal flip and sprite-level flip cases. (a vertical flip swaps the rows of the box)
- raster/sprite-flip: W4: vertical flip and double flip are further states of the one flip contract. (a vertical flip mirrors rows and the pivot height; two flips in one transaction restore the sprite exactly)
- raster/sprite-resize-trim: W4: an already tight sprite is the no-op state of the covered trim case. (keeps a sprite whose cels already touch every edge)
- raster/sprite-turn-slices: W4: slice pivot after a turn is covered by the slice turn golden. (a turned slice pivot keeps its place inside the slice)
- raster/sprite-turn: W4: undo and redo round trip of a turn are covered by the history contract tests. (a 3 by 2 sprite turned, undone and redone matches bit for bit in pixels, size and pivot', () =; a paint followed by a turn in the same transaction undoes exactly)
- palette/census: W4: determinism restates the golden counts. (is deterministic)
- palette/dither: W4: determinism restates the golden output. (is deterministic)
- palette/extract: W4: size reduction is implied by the same-image same-output and cap cases. (reduces many colours to a smaller palette)
- palette/map: W4: determinism and the extract round trip restate the nearest colour goldens. (is deterministic; maps an extracted palette back without leaving it)
- palette/palette-reorder: W4: the table remap is another state of the render-identical reorder test. (remaps through one table so slot 1 and slot 4 trade places)
- palette/ramp-builder: W4: white and black lightness is inside the oklch round trip of black and white. (reads white as lightness 1 and black as 0)
- palette/sprite-import: W4: determinism restates the dither origin golden. (is the same on every run)
- presets/catalog: W5: a snapshot of the catalog data (family names and a count), changes whenever data is added. (groups the presets by family in catalog order)
- presets/defaults: W5: restate constant tables of palette values per console, covered by the fixed palette and snapping tests. (starts PICO-8 with the full fixed set; starts TIC-80 with Sweetie 16; starts the Game Boy with its four shades)
- presets/fixed-palettes: W5: a snapshot of documented counts of constant data; validity and no repeats stay. (holds the documented count of valid colours)
- presets/snapping: W4: Master System snapping is another state of the covered 2 bit / bits-per-channel model. (snaps Master System colours to 2 bits per channel)

Data-table rows dropped (cases still run): raster/brush-stamp (circle sizes 5 to 8, square size 2 and 7), raster/ellipse (4 boxes), raster/line-points (7 octants), raster/rect (4 rows), raster/symmetry (horizontal axis stroke, brush sizes 4 to 6), raster/flood-fill (2 rows). Reason: W4, boundary and distinct-branch cases stay. raster/pixels-replace-clear lost one line `toBeGreaterThanOrEqual(0)` (W8, cannot fail).

## Rule candidates (W1/W2)

None. No test in these folders reads source files or repeats a lint, type or structure rule.

## Open points

- Vitest tags are not declared in `vitest.config.ts` (`test.tags`). If tag strictness is on, `critical`, `standard` and `e2e` must be declared there; the config is outside this scope.
- `palette/remap-output` (300 by 300 whole-engine golden hash), `raster/engine-output` and `raster/engine-history-bytes` (2048 by 2048 sprite) are tagged `standard` (S2) because they may exceed the one second critical bound. Retag to `critical` if they measure under 1 s.
- Nothing was run (no tests, lint or typecheck), as the brief requires; imports left unused by the deletions were removed by a text scan.
