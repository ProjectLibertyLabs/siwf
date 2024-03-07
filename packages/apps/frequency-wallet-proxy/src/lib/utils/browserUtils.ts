export async function copyToClipboard(s: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(s);
  } catch (error) {
    console.error('Failed to copy text to clipboard', error);
    return false;
  }

  return true;
}
