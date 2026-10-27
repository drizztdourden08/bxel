/* @layer core @kind logic */
import { BUNDLES } from '../catalogue/bundle.constants';
import type { BundleId } from '../catalogue/catalogue.type';

const bundleLabel = (bundle: BundleId): string => BUNDLES.find((entry) => entry.id === bundle)?.label ?? bundle;

export { bundleLabel };
