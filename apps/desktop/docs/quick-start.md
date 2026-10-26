<!-- @layer docs @kind doc -->
# Bxel quick start

Bxel is a pixel art editor with a fixed palette. Every pixel is a number that points at a swatch,
so a drawing never gains a colour you did not choose. This page takes you from the installer to
an exported sprite sheet. The labels are the ones on screen.

## Install

1. Run the Bxel Setup file from the release folder. It installs for the current user and starts Bxel.
2. Windows links the Bxel file types to Bxel: sprite (`.bxsprite`), sheet (`.bxsheet`), palette
   (`.bxpalette`), tileset (`.bxtiles`), tilemap (`.bxmap`) and project (`.bxproject`). Double click one to open it.
3. To look around first, open Help, then Open the demo project. Bxel asks where to put a copy,
   writes the folder Bxel Demo there and opens it. Your edits stay in that copy. Choosing the same
   folder again opens the copy as you left it.

## The screen

- The title bar holds the Menu button, Search, Undo, Redo, Save file and Export images and sheet data.
- The open asset decides what shows. A sprite shows the drawing tools, the Palette, Layers and
  Timeline panels and the Sprite menu. A sheet shows the Sheet panel and the Sheet menu. A tileset or
  a tilemap shows the Tileset panel, the map tools and the Tilemap menu. There is no mode to switch.
- The Canvas toolbar mirrors strokes (Mirror X, Mirror Y), shows the pixel grid, major grid, tile
  grid and rulers, previews tiling (Tiled preview), plays the animation (Onion skin, Play), zooms
  (Fit, 1:1) and opens Transform. A sheet shows only the zoom buttons.
- The menu lists File, Edit, the menu of the open asset, View, Project and Help, then Settings,
  About and Quit. New, Open, Open recent, Save, Save as, Save all, Export and Import are in File.
- The Tools toolbar holds Pencil (B), Eraser (E), Fill (G), Picker (I), Shapes (U), Select (M),
  Move (V), Zoom (Z) and Hand (H). Tool options sit in the toolbar above it.
- The panels are Palette, Layers, Sheet, Tileset and Timeline, with Project on the left.
  F6 moves between the toolbars, the canvas and the panels.
- The status bar under the canvas shows the cell under the pointer, the zoom, your two colours and
  whether the file is saved.

## Draw

1. Press Ctrl+N and choose Create sprite in the New asset dialog.
2. Pick a colour in the Palette panel. Left click sets Colour 1, right click sets Colour 2.
   Hold Ctrl for Colour 3 and Colour 4.
3. Draw on the canvas with the Pencil. Hold Shift for a straight line. Mirror X paints the opposite
   side as well. One stroke is one undo step (Ctrl+Z, Ctrl+Y).
4. Turn on Tiled preview in the View menu to see whether a pattern repeats. While it is on, a stroke,
   line, shape or fill that leaves one edge continues from the opposite edge, and the whole stroke
   is still one undo step.
5. Transform opens flips and turns. A preview opens first. Choose Apply or Cancel on the bar.
   Flips and quarter turns never add a colour.

## Palettes

- The colour limit is shown under the swatches, for example 15 opaque + transparent = 16.
  A sprite can never hold more swatches than its limit.
- Double click a swatch to change its colour. Every pixel that uses it follows, and one undo
  puts it back.
- The Palette entry of the Sprite menu holds Delete swatch, Merge swatch and Change colour limit. Each shows what
  will change before it does.
- Import image (Ctrl+I) reads a PNG, GIF or APNG. An animated file arrives as one sprite with a frame for
  each picture and keeps the duration of each frame. The Colours step shows the original beside the reduced
  picture. Choose to map to the file palette, extract the best colours or use a palette file.
  Dithering is off unless you turn it on, and Cancel leaves the file untouched.

## Sprites, animation and sheets

- The Timeline panel holds frames and layers. Add frame adds a column, and the duration field
  sets the time of the selected frames. Add tag on the selected frames names a loop, for example run.
  Onion skin shows the neighbour frames on the canvas.
- Import image with Import as set to Sheet cuts a sheet into sprites. Set the cell size, the
  offset and the spacing, and name them with a pattern such as part_{n}.
- A sheet is its own file. New, then Sheet of sprites, makes one, and a sheet you open from the Project
  panel shows every sprite of the sheet on one canvas. Only the sheet tools show: zoom, the Sheet
  panel and the Sheet menu. Pick sprites in the Sheet panel with a click and Ctrl+click. Isolate sprite
  in the Sheet menu opens the picked sprites for painting, and Back returns to the sheet. Paint all
  selected (Alt+B) paints one stroke on every picked sprite. Transform on a picked group is one undo
  step for all of them.
- Asset settings (Alt+Enter) holds the sprite name, size and Pivot x and Pivot y.
- Export (Ctrl+Shift+E) writes Sprite PNG, Frames, Animation (GIF or APNG), Sheet and JSON or
  Tilemap. Scale is a whole number from 1 to 8 and is never blurred. Save preset keeps your choices.

## Tilemaps

New, then Tileset, makes a tileset, and New, then Tilemap, makes a map that uses it. A tileset or a
tilemap shows the Tileset panel and the map tools, and the Tilemap menu. Add tile adds a tile. In
Place Tile you put tiles on the map without changing them. Alt+T
switches to Edit Tile, where a change to a tile shows in every cell that uses it. Import, then Tiled
map, in the File menu reads a TMX map with its tileset.

## Projects and the asset files

A project is a folder with a `.bxproject` file. Each asset is its own file, so a sprite shared by two
sheets is stored once.

- Project, then New project makes the folder and the subfolders sprites, sheets, palettes, tilemaps and exports.
- Project, then Open project opens a folder. Open recent project lists the last ones.
- The Project panel lists the assets, filters them by kind and shows which sheets use a sprite.
  Click a row to open it. The Folders view shows every file.
- Save file writes the open asset. Save all (Ctrl+Alt+S) writes every changed asset. A save that
  fails leaves the last good file as it was.
- Pack project puts the project in one `.bxproject` file. Opening a packed project asks for a
  folder and unpacks it there. An older `.bxel` file that holds several assets opens with a
  Split into files button.

## Settings

Ctrl+, opens the settings. The Switch hub buttons choose the level.

- App: General, Canvas, Canvas surround, Palette library, Platform presets, Defaults for new
  assets, Assistant, Assistant programs, Assistant projects and Storage.
- Asset: the settings of the open asset, such as Sprite, Palette, Sheet, Tileset and Tilemap.
- Project: General, Folders, Palettes, Defaults for new assets, Export and Assistant for the open project.

## Connect an assistant

Bxel can let an assistant program edit through the same commands as the screen. It is off until you
turn it on.

1. Open the settings, App hub, Assistant. Turn on Assistant access. Choose what a program can
   see and where it can write.
2. Open Assistant programs in the App hub. Approving connections decides when Bxel asks you.
   The default asks for every connection.
3. On the same page, Copy client config copies the entry to paste into the MCP settings of
   your assistant client. It looks like this:

```json
{
  "mcpServers": {
    "bxel": {
      "type": "stdio",
      "command": "<path to the Bxel helper shown in the panel>",
      "args": [],
      "env": {}
    }
  }
}
```

4. Connect from the client. Bxel asks you to Allow editing or to keep the program read only.
5. A project is invisible to the assistant until you choose its Assistant access: Off, Read only
   or Read and edit. The assistant saves new files in the assistant folder, never over a file you
   did not grant.

The Assistant programs page lists the connected programs with Disconnect and Make read only
buttons, and the recent calls. An edit from the assistant is one undo step in the editor.

## Keyboard

Every action can be done from the keyboard. The map is in [Bxel by keyboard and screen reader](accessibility.md).
F1 lists every shortcut inside the app.
