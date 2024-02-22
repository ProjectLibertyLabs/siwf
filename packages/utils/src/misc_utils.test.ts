import { expect, test } from 'vitest';
import { delayMs, formatWalletAddress, getHandleBase, getHandleSuffix, parseHandle } from './misc_utils';

test('delayMs waits for at least n millseconds', async () => {
  const t1 = Date.now();
  await delayMs(2000);
  const t2 = Date.now();
  expect(t2 - t1).toBeGreaterThanOrEqual(2000);
});

test('Date.toLocalISOString formats date correctly', () => {
  const d = new Date('2024-01-01T05:00:00-05:00');
  // @ts-expect-error Ignore error on monkey-patched '.toLocalISOString'
  expect(d.toLocalISOString()).toBe('2024-01-01T05:00:00.000-05:00');
  expect(d.toISOString()).toBe('2024-01-01T10:00:00.000Z');
});

test('formatWalletAddress works correctly', () => {
  const result = formatWalletAddress('5CfLVBEtQ1TG4SvvFNiY9JBrqbcfKHipm6hVZqbjzsw7SGEa');
  expect(result).toBe('5CfL...SGEa');
});

test('parseHandle works on basic handle', () => {
  const { base, suffix } = parseHandle('foo.37');
  expect(base).toBe('foo');
  expect(suffix).toBe(37);
});

test('parseHandle works on handle with extra dot', () => {
  const { base, suffix } = parseHandle('foo.bar.37');
  expect(base).toBe('foo.bar');
  expect(suffix).toBe(37);
});

test('parseHandle works on corrupt handle', () => {
  let { base, suffix } = parseHandle('foo.bar');
  expect(base).toBe('');
  expect(suffix).toBe(0);

  ({ base, suffix } = parseHandle('foobar'));
  expect(base).toBe('');
  expect(suffix).toBe(0);
});

test('getHandleBase returns base of handle', () => {
  const { base: baseFromParse } = parseHandle('foobar.37');
  const base = getHandleBase('foobar.37');
  expect(base).toBe(baseFromParse);
});

test('getHandleSuffix returns suffix of handle', () => {
  const { suffix: suffixFromParse } = parseHandle('foobar.37');
  const suffix = getHandleSuffix('foobar.37');
  expect(suffix).toBe(suffixFromParse);
});
