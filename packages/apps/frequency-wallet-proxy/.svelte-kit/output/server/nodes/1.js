

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.WKzU-NKK.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/index.naYil22D.js","_app/immutable/chunks/singletons.39SXkKrd.js"];
export const stylesheets = [];
export const fonts = [];
