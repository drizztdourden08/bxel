/* @layer renderer-app @kind constants */
const TEMPLATE_TOKEN = /\{(name|sprite|frame)\}/g;

const TEMPLATE_REPEATED = /([-_ ])[-_ ]+/g;

const TEMPLATE_EDGES = /^[-_. ]+|[-_. ]+$/g;

export { TEMPLATE_EDGES, TEMPLATE_REPEATED, TEMPLATE_TOKEN };
