export function _processKeysForInterpolation(key: string) {
  return [...key.matchAll(/\[([-\w]+)]/g)].map(([_, _instanceKey]) => _instanceKey);
}

// TODO: currently only supports simple one-to-one mapping, e.g. item[0] -> item[0], item[1] -> item[1]
export function getInterpolatedKey(template: string, key: string) {
  const keys = _processKeysForInterpolation(key);
  let index = 0;
  return keys.length
    ? template.replace(/\[]/g, () => {
        const k = keys[index++];
        return k !== undefined ? `[${k}]` : '[]';
      })
    : template;
}
