export function isWalletInstalled(injectedName: string): boolean {
  return !!(
    'injectedWeb3' in window &&
    typeof window.injectedWeb3 === 'object' &&
    window.injectedWeb3 &&
    injectedName in window.injectedWeb3
  );
}
