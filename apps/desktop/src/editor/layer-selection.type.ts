/* @layer renderer-app @kind types */
interface TreeLayer<Id extends string> {
  id: Id;
  parentId?: string;
}

export type { TreeLayer };
