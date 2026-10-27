/* @layer core @kind logic */
import type { BundleId, Level } from '../catalogue/catalogue.type';
import type { Grant } from './grant.type';

const bundleLevel = (grant: Grant, bundle: BundleId): Level => grant.bundles[bundle];

export { bundleLevel };
