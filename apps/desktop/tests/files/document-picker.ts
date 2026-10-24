/* @layer renderer-app @kind test */
import type { DocumentDialogOptions, DocumentPicker } from '@drizztdourden08/brock-core';

const documentPicker =
  (read: () => string | null): DocumentPicker =>
  ((options?: DocumentDialogOptions) => {
    const path = read();
    if (options?.grantFolder === undefined) return Promise.resolve(path);
    return Promise.resolve(path === null ? null : { path, folderGranted: false });
  }) as DocumentPicker;

export { documentPicker };
