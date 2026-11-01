/* @layer renderer-app @kind types */
type FileClip = { readonly paths: readonly string[]; readonly cut: boolean };

interface FileClipboardState {
  readonly clip: FileClip | null;
  readonly hold: (clip: FileClip) => void;
  readonly clear: () => void;
}

export type { FileClip, FileClipboardState };
