/* @layer core @kind logic */
const canSeeFolder = (visible: readonly string[] | undefined, folderId: string): boolean => visible === undefined || visible.includes(folderId);

export { canSeeFolder };
