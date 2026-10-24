/* @layer core @kind types */
type ProjectId = `prj_${string}`;

type FolderId = `fld_${string}`;

type ByteProvider = (length: number) => Uint8Array;

export type { ByteProvider, FolderId, ProjectId };
