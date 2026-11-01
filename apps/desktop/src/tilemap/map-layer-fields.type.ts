/* @layer renderer-app @kind types */
interface MapLayerFields {
  name?: string;
  visible?: boolean;
  locked?: boolean;
  colour?: string | null;
  opacity?: number;
}

export type { MapLayerFields };
