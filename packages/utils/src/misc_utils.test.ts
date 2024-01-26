import { expect, test } from 'vitest';
import { delayMs } from './misc_utils';

test('delayMs waits for at least n millseconds', async () => {
  const t1 = Date.now();
  await delayMs(2000);
  const t2 = Date.now();
  expect(t2 - t1).toBeGreaterThanOrEqual(2000);
});

test('Date.toLocalISOString formats date correctly', () => {
  const d = new Date('2024-01-01T05:00:00-05:00');
  expect(d.toLocalISOString()).toBe('2024-01-01T05:00:00.000-05:00');
  expect(d.toISOString()).toBe('2024-01-01T10:00:00.000Z');
});
