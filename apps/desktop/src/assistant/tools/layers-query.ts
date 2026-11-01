/* @layer renderer-app @kind logic */
const layersQuery = (layers: readonly string[] | undefined): string => (layers === undefined ? '' : `&layers=${layers.join(',')}`);

export { layersQuery };
