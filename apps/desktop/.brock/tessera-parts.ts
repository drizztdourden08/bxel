/* @layer renderer-app @kind types */
import type {} from '@drizztdourden08/tessera';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    'bxel': {
      parts:
        | 'ApplyBar'
        | 'ContextBar'
        | 'CreateDialog'
        | 'DialogHost'
        | 'EditorCanvas'
        | 'EditorScreen'
        | 'EditorStatus'
        | 'ImagePreview'
        | 'ImportWizard'
        | 'LayersPanel'
        | 'MismatchBar'
        | 'ModeBar'
        | 'PaletteChangeDialog'
        | 'PaletteFields'
        | 'PalettePanel'
        | 'PixelViewport'
        | 'RecoveryDialog'
        | 'SheetCanvas'
        | 'SpritesPanel'
        | 'ToolRail'
        | 'TransformDialog'
        | 'TransformPanel';
    };
  }
}
