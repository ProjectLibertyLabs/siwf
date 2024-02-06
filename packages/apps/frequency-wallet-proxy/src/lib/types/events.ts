import type { Extension } from '$lib/components/extensionsConfig';
import type { ExtensionAuthorization } from '$lib/stores';

export type WalletSelectedEvent = CustomEvent<{
  extension: Extension;
  extensionAuth: ExtensionAuthorization;
}>;
