/* @layer core @kind types */
import type { BundleId } from '../catalogue/catalogue.type';

type RoutedStep = {
  readonly index: number;
  readonly name: string;
  readonly bundles: readonly BundleId[];
};

export type { RoutedStep };
