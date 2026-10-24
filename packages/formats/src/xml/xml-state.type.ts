/* @layer core @kind types */
import type { OpenNode } from './xml.type';

type XmlState = {
  readonly stack: OpenNode[];
  root: OpenNode | null;
  count: number;
};

export type { XmlState };
