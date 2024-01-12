import { expect, test } from 'vitest';
import { delayMs } from './index';

test('delayMs waits for at least n millseconds', async () => {
  const t1 = Date.now();
  await delayMs(2000);
  const t2 = Date.now();
  expect(t2 - t1).toBeGreaterThanOrEqual(2000);
});
