/* @layer renderer-app @kind types */
import type {} from '@drizztdourden08/tessera';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    'bxel': {
      parts:
        | 'ContextBar'
        | 'CreateDialog'
        | 'DialogHost'
        | 'EditorCanvas'
        | 'EditorScreen'
        | 'EditorStatus'
        | 'ImagePreview'
        | 'ImportWizard'
        | 'LayersPanel'
        | 'PaletteChangeDialog'
        | 'PaletteFields'
        | 'PalettePanel'
        | 'PixelViewport'
        | 'RecoveryDialog'
        | 'ToolRail';
    };
  }
}
