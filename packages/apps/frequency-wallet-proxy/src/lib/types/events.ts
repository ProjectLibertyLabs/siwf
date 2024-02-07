import type { ConfiguredExtension } from '$lib/components/extensionsConfig';
import type { CachedExtension } from '$lib/stores';

export type WalletSelectedEvent = CustomEvent<{
  extension: ConfiguredExtension;
  extensionAuth: CachedExtension;
}>;
