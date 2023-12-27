

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.ov2NoWLe.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/index.naYil22D.js"];
export const stylesheets = [];
export const fonts = [];
