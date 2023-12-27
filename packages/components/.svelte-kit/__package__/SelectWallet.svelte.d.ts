import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        extensions?: Extension[] | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type SelectWalletProps = typeof __propDef.props;
export type SelectWalletEvents = typeof __propDef.events;
export type SelectWalletSlots = typeof __propDef.slots;
export default class SelectWallet extends SvelteComponent<SelectWalletProps, SelectWalletEvents, SelectWalletSlots> {
}
export {};
