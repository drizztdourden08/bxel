/* @layer renderer-app @kind types */
interface LayerBadge {
  id: 'missing' | 'opacity' | 'clip' | 'export';
  text: string;
  title: string;
}

export type { LayerBadge };
