/* @layer renderer-app @kind types */
import type {} from '@drizztdourden08/tessera';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    'bxel': {
      parts:
        | 'ApplyBar'
        | 'ContextBar'
        | 'EditorCanvas'
        | 'EditorScreen'
        | 'EditorStatus'
        | 'LayersPanel'
        | 'PalettePanel'
        | 'PixelViewport'
        | 'RecoveryDialog'
        | 'ToolRail'
        | 'TransformDialog'
        | 'TransformPanel';
    };
  }
}
