/* @layer renderer-app @kind types */
import type {} from '@drizztdourden08/tessera';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    'bxel': {
      parts:
        | 'EditorCanvas'
        | 'EditorScreen'
        | 'EditorStatus'
        | 'PalettePanel'
        | 'PixelViewport'
        | 'RecoveryDialog'
        | 'ToolRail';
    };
  }
}
