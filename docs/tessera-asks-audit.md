# Tessera asks, final audit

For the Tessera lead. This is what Bxel still asks Tessera to build, checked against Tessera 0.95.0 (the build in the Bxel tree). Each part has its props, states, keys and accessibility, and the Bxel screen that uses it. Where 0.95 already has most of a part, the section asks only for the missing piece and says what Bxel keeps in the app until it lands.

Sources: the "Tessera asks" parts of the specs in `.claude/plans/redesign/*.md`, the 0.88 to 0.95 release notes, the guide pages and types in the package, and the stand-in code under `apps/desktop/src/views`. Names below follow Tessera style: arrow components, props typed, nothing app specific in a prop name.

## Summary

| # | Part | 0.95 has | Ask |
|---|---|---|---|
| 1 | ZoomField | NumberField (ladder, suffix, presets menu, wheel, scrub), Slider | Two small options: `buttons` on NumberField, a log scale on Slider. Optional composite. |
| 2 | AnchoredBar | Anchored with `anchorRect`, `boundary`, `flip` | A clamp and dock mode, a follow mode, focus handling, and a transient readout. |
| 3 | Breadcrumbs trailing slot | Breadcrumbs with icons, siblings, fold, drop, path edit, `trailing` | Nothing to build. Swap the stand-in. One check listed. |
| 4 | ReorderTree | Tree with reorder, multi select, `maxDepth`, `canDrop`, Alt keys, announcer | Nothing to build. Already in use by Layers. |
| 5 | Mixed state | `mixed` on Slider, ToggleGroup, Checkbox, TextInput, ColorSwatch | Missing on Toggle, SegmentedControl, IconButton (pressed), and Slider with `input`. |
| 6 | PixelThumbnail | Canvas, Image `pixelated`, `backdrop="checker"` | New primitive. |
| 7 | Pixel preview player | Image `fit="integer"`, Video, MediaViewer (modal) | New composite. |
| 8 | SpanBar | `useRectDrag`, `ResizeEdges` (two dimensional) | New composite. |
| 9 | ScrubRuler | Nothing | New composite. |
| 10 | Horizontal listbox | VirtualList horizontal with selection and marquee, `useReorderDrag` set drag | Variable item sizes and `reorder` on VirtualList. |
| 11 | VirtualGrid swatch mode | VirtualGrid, `columns`, `renderTile`, ColorSwatch marks | A dense mode with `size-16` tiles and no padding. |
| 12 | Navigator overlays | Navigator with a `children` slot | A typed `overlays` list in surface units, plus wheel zoom and extra keys. |

## 1. ZoomField

**Status.** Tessera says a ZoomField is a recipe over NumberField with `ladder`, `suffix="%"` and `presets`. Bxel agrees for the field itself and asks for two missing options. The composite below is optional and only worth building if the Tessera lead wants one part for every editor.

**Ask A. NumberField `buttons`.** NumberField omits `buttons` from NumberInput, so the minus and plus buttons cannot show beside a laddered value.

| Prop | Type | Default | What it does |
|---|---|---|---|
| `buttons` | `'sides' \| 'stacked'` | none | Shows step buttons. Each press moves to the next ladder stop, or by `step` with no ladder. |

States: a button is disabled at `min` or `max` and when the field is disabled. Buttons are not in the tab order when the input is focusable by keys (Up and Down already step), and each has a name from strings ("Decrease", "Increase"). Bxel passes its own names, "Zoom out" and "Zoom in", so add `stepLabels?: [string, string]`.

**Ask B. Slider log scale.** Bxel maps 25 to 12800 percent onto 0 to 1000 with a logarithm, so one slider covers 9 octaves.

| Prop | Type | Default | What it does |
|---|---|---|---|
| `scale` | `'linear' \| 'log'` | `'linear'` | With `'log'`, the thumb position is the log of the value between `min` and `max`. `min` must be above 0. |

Keys: with `log`, Left and Right move one `keyStep` in value space along the ladder if `ladder` is given, else by a fixed share of the track. Bxel uses a share of 50 of 1000. Add `ladder?: readonly number[]` to Slider so Arrow keys land on useful stops. `aria-valuetext` uses `formatValue`.

**Optional composite `ZoomField`.**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `value` | `number \| null` | none | Percent. `null` means there is no view. |
| `onChange` | `(percent: number) => void` | none | Typed, stepped, slid or picked. |
| `min`, `max` | `number` | 25, 12800 | Clamp. |
| `ladder` | `readonly number[]` | powers of two times 25 | Stops for buttons, wheel, Arrow keys and presets. |
| `presets` | `readonly number[]` | the ladder | Shown as a visible chip row, not a menu. |
| `slider` | `boolean` | true | Shows the log slider. |
| `actions` | `ReactNode` | none | Row of buttons below, for Fit, 1:1 and Zoom to selection. |
| `label` | `string` | "Zoom" | Names the group. |

States: no view (`null`: field empty, every control disabled), draft invalid (typed text that is not a number: field `invalid`, Enter does nothing, Escape reverts, blur commits only a valid draft), preset active (chip pressed when equal to the value), at limit (button disabled), focus (text selects on focus).

Keys and a11y: group named Zoom. Field is a text input with `inputMode="numeric"` and an `aria-label` of "Zoom percent". Presets are a group of toggle buttons with `aria-pressed`. Zoom changes are announced once through the app `announce`, not by the component.

**Bxel screen.** The View widget, Zoom section: step buttons around the percent field, the slider, the preset chips, then Fit, 1:1 and Selection. Stand-in: `views/ZoomField`.

## 2. AnchoredBar

**Status.** `Anchored` (0.88) has `anchorRect` as a rect or getter, `boundary`, `placement` (including `bottom-center`) and `flip`. Bxel's Apply bar needs more than a popover.

**Ask. Options on `Anchored`, or a thin `AnchoredBar` over it.**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `inline` | `boolean` | false | Absolute inside the boundary, not in the top layer, so it scrolls and clips with the surface. |
| `margin` | `number` (space token) | `md` | Least distance to the boundary edge. The bar is clamped, not flipped. |
| `gap` | `number` (space token) | `sm` | Distance from the anchor. |
| `dock` | `'top-center' \| 'bottom-center' \| 'none'` | `'none'` | Where the bar goes when the anchor is off screen or null. Sets `data-docked`. |
| `follow` | `boolean` | true | Re-measures when the anchor rect getter's source changes. Needs a `subscribe?: (notify: () => void) => () => void` so the app says when the rect moved (pan, zoom, drag). |
| `role` | `'dialog' \| 'alertdialog' \| 'toolbar' \| 'status'` | `'dialog'` | Semantics. Bxel uses `alertdialog` with `aria-modal="false"`. |
| `initialFocus` | `string` (selector) | none | Moves focus in on show and puts it back on hide. |
| `onEscape` | `() => void` | none | Escape inside the bar, without bubbling. |

States: shown, hidden (nothing rendered), docked (dashed border in Bxel), error (danger border, primary action disabled), measuring (`visibility: hidden` until the first measure, so no jump).

Keys and a11y: the bar is not modal and does not trap focus. Escape cancels. Tab leaves it naturally. The text says in words when it is docked ("The selection is off screen.").

**Second use: transient readout (ZoomHud).** A small label placed in a corner of a surface that fades in on a value change and out after a time.

| Prop | Type | Default | What it does |
|---|---|---|---|
| `value` | `ReactNode` | none | The text. A change shows it. |
| `corner` | `'bottom-end' \| 'bottom-start' \| 'top-end' \| 'top-start'` | `'bottom-end'` | Place inside the surface. |
| `showMs` | `number` | 1000 | How long it stays. |
| `onActivate` | `() => void` | none | Double click action (Bxel resets to Fit). |
| `title` | `string` | none | Hint on hover. |

States: hidden, visible, first render (never shows). Reduced motion: no fade. Forced colours: solid canvas colours. It is `aria-hidden` because the zoom change is announced elsewhere.

**Bxel screen.** The Stage over the canvas. The Apply bar sits under or over the pending transform or paste (Apply, Cancel, "Arrow keys nudge"). The zoom HUD shows the percent at the bottom right while zooming. Stand-ins: `views/ApplyBar`, `views/CanvasOverlays/sub-components/ZoomHud.tsx`.

## 3. Breadcrumbs trailing chips slot

**Status. Done in 0.95.** Breadcrumbs takes `segments` with `icon` and `siblings` (menu nodes), `maxVisible` fold, `onDropOn`, `path` edit and `trailing`. The stand-in `views/StageHeader/sub-components/BreadcrumbTrail.tsx` can go.

Residual check for Tessera, no new build unless it fails:

- A segment that runs an action and has no navigation target. Bxel crumbs are either a menu, a button with `run`, or plain text for the last one. `onNavigate(id)` covers the button. The check is that a segment with `siblings` and no `onNavigate` effect still opens its menu on click.
- A crumb note in brackets, "Layer Body (locked)". Bxel puts it in `label`. If Tessera wants `note?: string` on a segment, it is read as part of the name.
- `trailing` should stay in the tab order after the last crumb and wrap under the trail when narrow. Bxel puts Tag chips there ("Read only: reason", "Mirrored view", "Painting 4 sprites") with an optional action such as "Unlock layer". The chip group needs its own name, so ask for `trailingLabel?: string`.

**Bxel screen.** The stage header strip above the canvas: Hero > Run > Frame 3 of 8 > Layer Body, then state chips, then actions. Stand-in: `views/StageHeader`.

## 4. ReorderTree

**Status. Done in 0.89.** Tessera `Tree` has everything the Layers spec asked: roving focus, tree roles, fold, `selection` with `mode="multiple"`, pointer drag with gap and into marks, Alt with Up, Down, Left, Right (out of and into a parent), `maxDepth`, `canDrop`, `renderThumbnail`, `rowSize`, `trail`, and a polite announcer. `views/LayerStack/sub-components/LayerList.tsx` already uses it, with `maxDepth` set to the document limit plus one.

No ask. Two items stay on the Bxel side and are not Tessera work:

- `useLayerSweep` (eye and lock column drag) is Bxel's own copy. It should move to Tessera's `useToggleSweep` (0.89). That is a Bxel task.
- The announcer text for key moves comes from Tessera strings. If the Tessera lead wants apps to word them ("Layer Body moved into Group Hero"), add `announce?: (move: TreeMoveRequest, labels: readonly string[]) => string` to `TreeReorder`. Small, optional.

**Bxel screen.** The Layers widget: the layer list with groups, thumbnails, eye and lock toggles, colour tags.

## 5. Mixed state

**Status.** `mixed` exists on Slider, ToggleGroup, Checkbox, TextInput, NumberInput, Select and ColorSwatch (0.88). Layers uses Slider `mixed` for opacity. Four gaps remain, all met in `views/LayerStack`.

| Part | Missing | Bxel use |
|---|---|---|
| Slider with `input` | The number box ignores `mixed`: the rail is hatched but the box shows the last value. | Opacity slider with a number box over several layers. Show the word Mixed (the string `fields.mixed`) as placeholder in the box, empty value. |
| Toggle | No `mixed`. | "Clip" and "Export" switches over a pick where layers differ. |
| SegmentedControl | No `mixed`. | The lock kind control (None, Pixels, Position, All) over layers with different locks. |
| IconButton pressed | `aria-pressed` can be `'mixed'` but no look. | Eye and lock columns on a group row, or a pick where some are on. |

Props: `mixed?: boolean` on Toggle, IconButton and SegmentedControl, and `mixed?: readonly T[]` on SegmentedControl to mark the options that are on for some items (same as ToggleGroup).

States and look: mixed is distinct from on and off. Use the hatched fill ToggleGroup already draws, plus italic text where there is text. A mixed Toggle shows the thumb in the middle. A mixed control on press becomes on (first press) and calls `onChange(true)` so the app clears `mixed`. Not colour alone: the hatch is the cue.

Accessibility: `aria-pressed="mixed"` for buttons, `aria-checked="mixed"` for switch and checkbox roles, `aria-valuetext="Mixed"` for the slider thumb (done). The group label carries the count if the app wants it.

**Bxel screen.** The Layers widget strip under the list, shown when more than one layer is picked.

## 6. PixelThumbnail

**Status.** Missing. Today three copies exist: `views/EntryTile/behavior/useThumbnail.ts` and `draw-thumbnail.ts` (Sprites widget, Project tiles), `views/LayerStack/behavior/useLayerThumb.ts` (Layers), and the frame thumbs in the Timeline. Each makes a canvas, puts RGBA in with `putImageData`, scales without smoothing and puts a checker behind it.

**Ask. A `PixelThumbnail` primitive.**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `image` | `{ width: number; height: number; rgba: Uint8ClampedArray } \| null` | none | The picture to draw. `null` clears it. |
| `indexed` | `{ width; height; pixels: ArrayLike<number>; palette: readonly string[]; transparent?: number }` | none | Alternative form. Palette lookup in the part. Use `image` or `indexed`, not both. |
| `box` | `number` (size token 16, 24, 32, 40, 48, 64) | 24 | Square box in px. |
| `fit` | `'step' \| 'contain'` | `'step'` | `'step'`: whole number upscale, fractional only when shrinking, centred. `'contain'`: any scale. |
| `backdrop` | `'checker' \| 'none'` | `'checker'` | Checker behind transparent pixels. |
| `lazy` | `boolean` | false | Draws when the box first scrolls into view (IntersectionObserver). |
| `throttleMs` | `number` | 0 | Least gap between redraws, for a live source. Bxel uses 80. |
| `frames` | `readonly { image; durationMs }[]` | none | Animated form. |
| `playing` | `boolean` | false | Plays `frames` in a loop. Shows frame 0 when false. |
| `label` | `string` | none | Name. With none, the part is `aria-hidden` (decorative). |
| `ref` | `Ref<HTMLCanvasElement>` | none | For callers that draw into it themselves. |

States: empty (`image` null: clear box, checker stays), not yet drawn (lazy, before view), live (redraws throttled), animating, reduced motion (never plays: `playing` is ignored, frame 0 shows), dimmed (caller class, for a hidden layer), high contrast (draws a border in `CanvasText`). Selected and hover looks belong to the parent tile or row.

Keys and a11y: not focusable. Decorative by default because the row or tile carries the name. With `label` it is `role="img"`.

**Bxel screens.** The Layers widget (16, 24, 40 px, follows an open stroke), the Sprites widget grid, list and drag ghost, the Project Browse tiles, and the Timeline frame cells and drag ghost.

## 7. Pixel preview player

**Status.** Missing. `Image` has `pixelated`, `backdrop="checker"` and `fit="integer"`, `Video` plays video, `MediaViewer` is a modal. None plays an indexed animation inline.

**Ask. A `PixelPlayer` composite.**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `frames` | `readonly { image: RgbaImage; durationMs: number }[]` | none | One frame is a still. |
| `label` | `string` | none | Name of the picture (required). |
| `mode` | `'compact' \| 'large'` | `'large'` | Compact hides the bar and the counter. |
| `zoom` | `'fit' \| number` | `'fit'` | `'fit'` is the largest whole number that fits the stage, never below 1. |
| `backdrop` | `'checker' \| 'none'` | `'checker'` | Behind transparent pixels. |
| `loop` | `{ direction: 'forward' \| 'reverse' \| 'pingpong'; repeat: number }` | forward, 0 | `repeat` 0 is forever. |
| `speeds` | `readonly number[]` | `[0.5, 1, 2]` | Speed choices. |
| `tags` | `readonly { id: string; name: string; from: number; to: number }[]` | none | Named frame ranges. With tags, a picker limits play to one range. |
| `tagId` and `onTagChange` | `string \| null`, `(id) => void` | none | Controlled range. |
| `cells` | `readonly { id: string; x; y; width; height; label? }[]` | none | Rectangles that outline on hover (sheet cells). |
| `onCellHover` | `(id \| null) => void` | none | Report the hovered cell. |
| `controls` | `boolean` | true | The bar: Step back, Play and Pause, Step forward, speed, tag picker, counter. |
| `autoPlay` | `boolean` | false | Bxel starts stopped. |

States: still (one frame: no bar, no counter), stopped at start, playing, paused, finished (a loop with a count: Play becomes Replay), stepping, hover on a cell (outline and caption), page hidden (stops by itself), reduced motion (waits for Play, never autoplays), empty (placeholder icon slot for a file with no picture), tag chosen (counter says "3 of 6").

Keys and a11y: the stage is one tab stop. Space plays and pauses, Left and Right step, Home and End jump. The picture is `role="img"` with the label. Controls are a named group of labelled buttons. The counter is `role="status"` and is read when a step changes it, not on every tick of playback (throttle to stop or step). The zoom shows in a corner label.

**Bxel screens.** Project window Browse: the right pane preview of the picked file (`ProjectBrowser/sub-components/OnePreview.tsx`, `PreviewPane.tsx`). Properties: the subject card at the top. Stand-in: `views/AssetPreview` (`PixelStage`, `FramesPlayer`, `PlaybackBar`).

## 8. SpanBar

**Status.** Missing. `useRectDrag` and `ResizeEdges` in `composites/rect-drag` work in two dimensions and in free pixels.

**Ask. A `SpanBar` composite: a one dimensional range bar over a row of cells.**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `start`, `end` | `number` | none | First and last cell, inclusive. |
| `cells` | `{ lefts: readonly number[]; widths: readonly number[] }` | none | Cell geometry in px. Cells may have different widths (time mode). |
| `count` | `number` | `cells.lefts.length` | Number of cells. |
| `onChange` | `(span: { start: number; end: number }) => void` | none | Called once at the end of a drag or a key step. |
| `onDraft` | `(span \| null) => void` | none | Called while dragging, so the app can show a live label. |
| `label` | `string` | none | Name for assistive tools, such as "walk, pingpong, frames 1 to 6". |
| `readOnly` | `boolean` | false | No drag and no keys. Shows a lock look. |
| `selected` | `boolean` | false | Pressed look. |
| `onSelect` | `(event) => void` | none | Click. Shift click is passed through. |
| `onActivate` | `() => void` | none | Enter and double click. Bxel opens a popover. |
| `snap` | `'cell' \| 'none'` | `'cell'` | Edges and moves land on cell borders. |
| `minLength` | `number` | 1 | Fewest cells. |
| `children` | `ReactNode` | none | Content in the body: icon, name, repeat, facing. |
| `colour` | `string` (token name) | none | A tone from Tag colours. |
| `onCreate` | `(span) => void` | none | Optional drag on the empty lane makes a new span. Offered through a `SpanLane` helper. |

Gestures: drag the body to move (clamped so it never leaves 0 to count minus 1), drag the start or end edge to resize (start cannot pass end), drag on the empty lane to create. A press without movement is a click.

States: rest, hover (edges show a resize cursor), focus (ring on the body), selected, dragging (draft geometry, lifted look), read only, mirrored or linked (not editable), colour tone, narrow (name truncates, edges stay 8 px hit areas at 24 px minimum).

Keys and a11y: the body is a button with `aria-pressed` for selected and a name from `label`. Enter activates. Alt+Shift with Left or Right moves the end by one cell. Alt+Ctrl with Left or Right moves the whole span. Each change is announced with the new range through the app `announce`. The edges are `aria-hidden` pointer handles because the keys do the same job. Every key step is one undo step on the app side.

**Bxel screen.** The Timeline widget tag lanes above the ruler: animation tags with direction icon, name, repeat and facing. In time mode the same part sizes in milliseconds. Stand-ins: `views/TimelinePanel/sub-components/TagBarView.tsx`, `TagBarEdges.tsx`, `TagBarBody.tsx`, `behavior/useTagDrag.ts`.

## 9. ScrubRuler

**Status.** Missing.

**Ask. A `ScrubRuler` composite: ticks, a playhead that scrubs, markers and a range band.**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `cells` | `{ lefts; widths }` | none | Cell geometry in px, as in SpanBar. |
| `value` | `number` | none | Playhead cell index. |
| `onChange` | `(index: number) => void` | none | Click and drag, and keys. |
| `tickLabel` | `(index: number) => string` | index plus 1 | Text per cell (frame number, or time in time mode). |
| `tickEvery` | `number \| 'auto'` | `'auto'` | `'auto'` skips labels so they keep a least gap of 28 px. Time mode shows every label. |
| `markers` | `readonly { id: string; index: number; min: number; max: number; label: string; tone?: string }[]` | none | Draggable markers (the onion handles), each its own slider. |
| `onMarkerChange` | `(id: string, index: number) => void` | none | |
| `band` | `{ from: number; to: number } \| null` | none | A range band (the loop range). |
| `onBandChange` | `(band \| null) => void` | none | Shift and drag draws a band, a click on its clear button removes it. |
| `bandLabel` | `(band) => string` | none | Title for the clear button. |
| `valueText` | `(index: number, count: number) => string` | "Frame n of N" | `aria-valuetext`. |
| `label` | `string` | none | Name. |
| `readOnly` | `boolean` | false | |

States: rest, hover, focus (ring on the ruler or the marker), scrubbing (pointer captured, playhead follows), drawing a band (draft), band set (shows clear button), marker dragging, current tick emphasised, read only, empty (no cells: nothing drawn). Colour is not the only cue for markers: Bxel draws a before and an after shape.

Keys and a11y: the ruler is `role="slider"` with min 1, max count, `aria-valuenow` and `aria-valuetext`. Left and Right step one cell, Home and End go to the ends, Page Up and Page Down step by ten. Ctrl, Alt and Meta with an arrow are left alone for the app. Each marker is also a `slider` with its own min, max, value and label, moved by Left and Right (the sign follows its side). Pointer events stop at the marker so a marker drag does not scrub.

**Bxel screen.** The Timeline widget ruler row, above the frame track. Click or drag scrubs the playhead (not the pick), onion handles flank it, Shift and drag draws the preview loop range. Stand-ins: `views/TimelinePanel/sub-components/TimelineRuler.tsx`, `OnionHandles.tsx`, `behavior/useScrub.ts`.

## 10. Horizontal virtualised multi-select listbox with roving focus

**Status.** Mostly there. `VirtualList orientation="horizontal"` (0.88) is a multi select listbox with roving focus, `useSelectionModel`, `getRects`, `scrollRef`, `bind` and `overlay` for `useMarqueeSelect`. `useReorderDrag` (0.88) drags a whole set with `axis: 'horizontal'`, and `DragGhost` shows a count and thumbnails. Bxel's `FrameTrack` already composes these hooks by hand. It can move to VirtualList only if two things are added.

**Ask A. Variable item size.** Frames are 40 to 120 px wide, and in time mode the width follows the duration. `itemSize` is one size token today.

| Prop | Type | Default | What it does |
|---|---|---|---|
| `itemSize` | `VirtualSize \| ((index: number) => number)` | token | A function gives each item its width (or height) in px. The window then reads offsets from a prefix sum. |
| `endGutter` | `number` | 0 | Empty space after the last item, so the last item can scroll clear of an end control. |
| `itemSizeKey` | `string` | none | A value that changes when sizes change (zoom, time mode), so the list re-measures. |

**Ask B. `reorder` on VirtualList.** Same shape as `VirtualGrid`.

| Prop | Type | Default | What it does |
|---|---|---|---|
| `reorder.onMove` | `(move: { keys; to: number; modifier: ReorderModifier }) => void` | none | Drag of the pick as a block, or Alt with an arrow. The modifier is reported at drop (Ctrl copies, Alt links). |
| `reorder.renderThumbnail` | `(item, index) => ReactNode` | none | First three in the ghost. |
| `reorder.canDrop` | `(move) => boolean` | none | Refuse a drop. The list sets `data-refused` and announces the refusal. |
| `reorder.dropLabel` | `(position: number, modifier) => string` | none | Text on the insertion mark ("Move to 4", "Copy to 4"). |

Also: a `renderOption` variant like VirtualGrid `renderTile`, receiving the cell props (role `option`, `aria-posinset`, `aria-setsize`, `aria-selected`, `aria-current`, `tabIndex`, data attributes), so each frame cell is the one focus target.

States: rest, hover, focus (roving, one tab stop), current (`aria-current`, the playhead frame), selected, dragging (source dimmed), drop before and after, refused drop, empty cell, linked cell, marquee in progress, scrolled out but focused (stays drawn).

Keys and a11y: `role="listbox"`, `aria-orientation="horizontal"`, `aria-multiselectable="true"`. Left and Right move focus, Home and End jump, Shift with an arrow extends, Ctrl and A selects all, Space toggles, Escape clears. Alt with an arrow moves the set. Apps can mark keys as theirs (Bxel's timeline keeps Enter, Ctrl+C, V, D): add `ownsKey?: (event) => boolean` so the list skips them. Moves are announced politely.

**Bxel screen.** The Timeline widget frame strip: thumbnails with number, duration chip, badges, link marks. It can hold hundreds of frames. Stand-ins: `views/TimelinePanel/sub-components/FrameTrack.tsx`, `FrameOption.tsx`, `behavior/useStripFocus.ts`, `useFrameSelection.ts`, `useReorderDrag` and `useMarqueeSelect` calls.

## 11. VirtualGrid swatch mode

**Status.** Mostly there. VirtualGrid has `selection` with rectangle ranges, `columns`, `reorder`, sections with `onDrop`, `renderTile`, `holes`, `getLabel`. `ColorSwatch` has up to four corner `marks`, `unused`, `mixed` and `focusRing="apart"`. The Palette widget still draws its own CSS grid (`views/PalettePanel/sub-components/SwatchGrid.tsx`, `GridCell.tsx`, `behavior/grid-key-down.ts`) because the tile sizes and padding do not fit swatches.

**Ask. A swatch mode on VirtualGrid.**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `tileSize` | adds `'size-16'` and `'size-20'` to `VirtualSize` | none | Bxel swatches are 16, 24 and 32 px. |
| `density` | `'cell' \| 'swatch'` | `'cell'` | `'swatch'`: no inner padding, a `space-2xs` gap, the tile is the focus ring target (the swatch). |
| `trailing` | `ReactNode` | none | An "add" tile after the last item, inside the same arrow key order and tab stop. |
| `onWheelSize` | `(direction: 1 \| -1) => void` | none | Ctrl and wheel changes the tile size. Bxel keeps its own step table. |
| `reorder.onMove` modifier | already there | | Ctrl copies a swatch into another palette, as in the Palette spec. |

States per tile: rest, hover (hint shown in a readout), focus (apart from selected), selected, held mark (corner numbers 1 to 4), unused (dimmed, dashed edge), transparent slot (checker), dragging, drop before and after, edited (open in the editor). A tile in a section header drop state (`into`) is already supported.

Keys and a11y: the grid is a multi select grid. Arrows move by a tile, Home and End by row, Shift extends as a rectangle, Space toggles, Ctrl and A selects all. Alt with an arrow moves the picked set. Digits 1 to 4 set the held colours, F2 edits and Delete removes: apps own these, so add `ownsKey` as in section 10. Each tile has an accessible name built by the app (slot name, hex, marks, usage count) through `getLabel`. Colour alone never carries the held marks: they are numerals.

**Bxel screen.** The Palette widget Swatches view: a grid of the bank slots with held-colour numerals, usage dimming and drag to reorder, with the readout under it. The Ramps view uses `RampStrip` (0.95) and needs nothing new.

## 12. Navigator overlays

**Status.** Tessera `Navigator` (0.88) takes `surface`, `viewport`, `onViewportChange`, `children` (the thumbnail, no pointer events), `label` and `step`. The viewport frame is a slider with arrow, Shift and Page keys and value text. Bxel's own `views/Navigator` also draws a selection outline, and the canvas spec adds the other split view.

**Overlays Bxel needs, from the code and `canvas.md`:**

1. The visible frame (Tessera draws it).
2. The selection outline: a dashed box, pixel rect in surface units. Drawn today (`view-map__mark`).
3. The other split view's visible rectangle: a second frame, different tone, dashed, not draggable from the minimap (the other view has its own Navigator state). Named in `canvas.md` "Shows the selection and the other view". Not drawn yet.
4. Optional later: guides (lines), the sheet cell grid at coarse zoom, and the part of a tilemap that is out of bounds. Not needed now.

**How Tessera's Navigator can take them.**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `overlays` | `readonly { id: string; rect: NavigatorViewport; kind: 'selection' \| 'view' \| 'region'; label: string; interactive?: boolean }[]` | none | Rects in surface units, drawn above the thumbnail and below the viewport frame. Percent positions like the frame, so no pixel math in the app. |
| `onOverlayPress` | `(id: string) => void` | none | Only for `interactive` ones. A press on the other view's rect could focus that view. |
| `onWheelZoom` | `(direction: 1 \| -1, at: { x: number; y: number }) => void` | none | Wheel over the map zooms the editor at that point. Today Bxel adds its own wheel listener. |
| `onKey` | `(event: KeyboardEvent) => boolean` | none | Return true to take a key first. Bxel maps Plus, Minus and Home to zoom in, out and fit. |
| `empty` | `ReactNode` | none | Shown when `surface` has no size. |
| `caption` | `ReactNode` | none | Text under the map ("512 x 512, 400%"). |

Overlay look: `selection` is a dashed box in the primary tone, `view` is a dashed box in a second tone with a different dash so colour is not the only cue, `region` is a soft fill. Clip to the surface. At least 1 px even when the rect is smaller. Forced colours: `Highlight` and `CanvasText`.

States: no surface (empty slot), no selection (overlay absent), other view hidden when there is no split, dragging the frame (overlays stay put), focus on the frame (ring), pointer over an interactive overlay.

Keys and a11y: the frame stays the one slider. Overlays are `aria-hidden` shapes. Their facts go into `aria-valuetext` or a described-by line through `describe?: string`: "Selection 12 to 40 across, other view 0 to 30 across". Bxel keeps the visible range and zoom as text under the map.

**Bxel screen.** The View widget, Navigator section, on sprites, sheets and maps. Stand-in: `views/Navigator` (`useNavigatorDraw`, `place-box`, `navigator-key`, `useNavigatorWheel`).

## Order of work

1. Small options first, each a few lines: NumberField `buttons`, Slider `scale="log"` and `ladder`, `mixed` on Toggle, SegmentedControl and IconButton, Slider `input` with `mixed`.
2. `PixelThumbnail`, then `PixelPlayer` (the player draws frames the same way).
3. VirtualGrid swatch mode, VirtualList variable sizes and `reorder`.
4. `Navigator` overlays.
5. `AnchoredBar` options.
6. `SpanBar` and `ScrubRuler` together, since they share cell geometry.
