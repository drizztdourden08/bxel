<!-- @layer docs @kind doc -->
# Bxel by keyboard and screen reader

Every core action in Bxel works from the keyboard. This page is the map. The same keys show in
the Keyboard shortcuts list (F1) and in the Canvas controls hint on the status bar.

## Moving around

| Keys | What they do |
| --- | --- |
| Tab and Shift+Tab | Move to the next or previous control. A toolbar, a tab strip and a grid are one Tab stop each. |
| F6 and Shift+F6 | Jump to the next or previous region: Canvas toolbar, Tool options, Tools, Open assets, the canvas, then each panel (Palette, Layers, Sheet, Tileset, Timeline). It wraps around. |
| Arrow keys | Move inside a toolbar (Left and Right in a horizontal one, Up and Down in a vertical one), a tab strip, a list or a grid. |
| Enter or Space | Press the focused button. |
| Escape | Close the open menu, popover or dialog and give focus back to the button that opened it. |
| Ctrl+, | Open the settings. Switch hubs (App, Asset, Project) with the Switch hub buttons. |
| F1 | List every keyboard shortcut. |

While a dialog is open, F6 stays inside it.

## Drawing on the Sprite canvas

Focus the canvas (F6, or Tab to the canvas named Sprite canvas), then:

| Keys | What they do |
| --- | --- |
| Arrow keys | Move the drawing cursor one cell. The first press places it in the middle of the sprite. The cell and its colour are spoken. |
| Space | Apply the current tool at the cursor with the front colour. |
| Enter | The same with the back colour (the right mouse button). |
| Shift+Space | Draw a straight line from the last point (pencil and eraser). |
| Ctrl+Space or Ctrl+Enter | Use the third or fourth colour. |
| Shapes tool | Press once to set the corner and again to finish the shape. Escape drops the corner. |
| Picker and Fill | Space picks the colour or fills the area under the cursor. |
| Shift+arrow | Pan the view. The view also follows the cursor. |
| Ctrl+Z and Ctrl+Y | Undo and redo. One press of Space is one undo step. |

Space only paints after an arrow key has placed the cursor. Before that, Space with a mouse drag
still pans, as it always did. When a floating selection is up, the arrow keys nudge it instead.
The tool keys (B, E, G, I, U and the rest) work while focus is on the canvas.

## Placing tiles on the Tilemap canvas

Arrow keys move a cell cursor and say the cell and its tile. Space or Enter applies the current
tool to the cell. With the Rectangle and Select tools, press once for the first corner and again
for the last one. Escape drops the corner and the selection.

## Sheet canvas

With the sheet canvas focused, the arrow keys move the picked sprites by 1 pixel and Shift with
an arrow by 8. Enter isolates one sprite and Escape returns. Pick sprites in the Sheet panel,
which is a grid of buttons you reach with F6.

## What is spoken

A polite live region says changes that have no focus move:

- the tool changing ("Eraser tool"), the mode changing ("Sheet mode") and the file being saved ("Saved hero.bxsprite");
- the drawing cursor moving, painting, picking, filling and finishing a shape;
- toasts, such as an export finishing, which are status regions of their own;
- the zoom level, while focus is on a canvas.

## Motion and contrast

- The marching ants of a selection and the app's own transitions stop when the system asks for
  reduced motion. Animation playback only runs when you press Play and stops with Pause.
- Text meets WCAG AA contrast on the Bxel theme. The automated check (`pnpm e2e accessibility`)
  runs axe on the editor, the settings hubs, the dialogs and the panels and fails on a new
  serious or critical finding.
