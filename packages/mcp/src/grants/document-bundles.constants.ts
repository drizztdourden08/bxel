/* @layer core @kind constants */
import { BUNDLES } from '../catalogue/bundle.constants';

const DOCUMENT_BUNDLES: readonly string[] = BUNDLES.filter((bundle) => bundle.document).map((bundle) => bundle.id);

export { DOCUMENT_BUNDLES };
