import { c as create_ssr_component, d as each, v as validate_component, m as missing_component, e as escape } from "../../../chunks/ssr.js";
const SelectWallet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { extensions = [] } = $$props;
  if ($$props.extensions === void 0 && $$bindings.extensions && extensions !== void 0)
    $$bindings.extensions(extensions);
  return `<div class="xs:mx-12 sm:w-500 md:w-800 mx-auto flex flex-col gap-2">${each(extensions, (extension) => {
    return `<button type="button" class="btn-banner font-bold"><div class="flex items-center justify-center gap-3"><div class="basis-3/12">${validate_component(extension.logo.component || missing_component, "svelte:component").$$render($$result, { size: extension.logo.size }, {}, {})}</div> <div class="basis-5/8 ml-8 text-left"><div class="text-3xl">${escape(extension.displayName)}</div> <span class="text-sm italic antialiased">Sign in with ${escape(extension.displayName)}</span> </div></div> </button>`;
  })} <div class="mx-auto mt-8 text-4xl" data-svelte-h="svelte-4iao3h">OR</div> <button type="button" class="btn-banner font-bold" data-svelte-h="svelte-jr8bwr"><div class="flex justify-evenly"> <div class="my-auto text-2xl">Sign in with Amplica Access</div></div></button></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(SelectWallet, "SelectWallet").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
