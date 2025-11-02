export function normalizeCore(core: any) {
  return {
    valoraiplus_module_id: core.valoraiplus_module_id || "unknown",
    valoraiplus_GILLBTC: core.valoraiplus_GILLBTC || "unknown",
    namespace: core.namespace || "VALORCHAIN-G",
  };
}

export function stableCanonicalJson(obj: any) {
  const sortedObj: any = {};
  Object.keys(obj).sort().forEach(key => {
    sortedObj[key] = obj[key];
  });
  return JSON.stringify(sortedObj);
}
