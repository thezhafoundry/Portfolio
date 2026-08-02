import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readPage = (page) => readFile(new URL(`../${page}`, import.meta.url), 'utf8');

const policyPages = [
  'policies/terms/index.html',
  'policies/privacy/index.html',
  'policies/refunds/index.html',
];

describe('Payment-readiness content', () => {
  it.each(policyPages)('%s is a public policy page with the shared site shell', async (page) => {
    const html = await readPage(page);

    expect(html).toContain('Sampath Kumar');
    expect(html).toContain('/src/styles/identity.css');
    expect(html).toContain('/src/styles/components.css');
    expect(html).toContain('/src/styles/policy.css');
    expect(html).toContain('USD 350');
    expect(html).toMatch(/remote consulting service/i);
    expect(html).toMatch(/no physical shipping applies/i);
  });

  it('publishes a clear paid consulting offer without claiming Razorpay is active', async () => {
    const html = await readPage('schedule/index.html');

    expect(html).toContain('USD 350');
    expect(html).toContain('60-minute online consultation');
    expect(html).toMatch(/remote consulting service/i);
    expect(html).toContain('Payment link will be added after approval');
    expect(html).not.toMatch(/razorpay.*(live|active)|active.*razorpay/i);
  });

  it.each(['index.html', 'story/index.html', 'results/index.html', 'schedule/index.html'])('%s links the public payment policies', async (page) => {
    const html = await readPage(page);

    expect(html).toContain('href="/policies/terms/"');
    expect(html).toContain('href="/policies/privacy/"');
    expect(html).toContain('href="/policies/refunds/"');
  });
});
