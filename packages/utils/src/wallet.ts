export function isExtensionInstalled(injectedName: string): boolean {
  return (
    'injectedWeb3' in window &&
    typeof window.injectedWeb3 === 'object' &&
    window.injectedWeb3 !== null &&
    injectedName in window.injectedWeb3
  );
}
