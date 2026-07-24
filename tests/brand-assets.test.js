import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const svgAssets = [
  'public/brand/sampath-signature.svg',
  'public/brand/sampath-signature-reversed.svg',
  'public/brand/sampath-s-mark.svg',
  'public/favicon.svg',
];

const signatureMasters = svgAssets.slice(0, 2);
const primaryBrandAssets = [
  'public/brand/sampath-signature.svg',
  'public/brand/sampath-s-mark.svg',
];
const pngAssets = [
  'public/brand/png/sampath-signature-720.png',
  'public/brand/png/sampath-signature-1440.png',
  'public/brand/png/sampath-signature-reversed-1440.png',
  'public/brand/png/sampath-s-mark-512.png',
];

const readAsset = (asset) => readFile(new URL(`../${asset}`, import.meta.url));

describe('Editorial Orchid brand assets', () => {
  it.each(svgAssets)('%s is a self-contained SVG with a viewBox', async (asset) => {
    const svg = (await readAsset(asset)).toString('utf8');

    expect(svg.trimStart()).toMatch(/^<svg\b/);
    expect(svg).toMatch(/\bviewBox=["'][^"']+["']/);
    expect(svg).not.toMatch(/<text\b|font-family|<script\b|(?:href|src)=["']https?:\/\//i);
  });

  it.each(signatureMasters)('%s is outlined with custom path geometry', async (asset) => {
    const svg = (await readAsset(asset)).toString('utf8');

    expect(svg).toMatch(/<path\b/);
    expect(svg).toMatch(/<title\b/);
  });

  it('uses white linework for the reversed signature', async () => {
    const svg = (await readAsset('public/brand/sampath-signature-reversed.svg')).toString('utf8');
    expect(svg).toMatch(/(?:fill|stroke)=["'](?:#fff|#ffffff|white)["']/i);
  });

  it.each(primaryBrandAssets)('%s uses explicit deep-violet linework for external image use', async (asset) => {
    const svg = (await readAsset(asset)).toString('utf8');

    expect(svg).toMatch(/stroke=["']#2E1065["']/);
    expect(svg).not.toMatch(/currentColor/i);
  });

  it.each([
    'public/favicon.svg',
    'public/brand/sampath-s-mark.svg',
  ])('%s uses a square viewBox', async (asset) => {
    const svg = (await readAsset(asset)).toString('utf8');
    const [, , width, height] = svg.match(/viewBox=["']([^"']+)["']/)[1].trim().split(/\s+/).map(Number);
    expect(width).toBe(height);
  });

  it.each(pngAssets)('%s is a non-empty PNG derivative', async (asset) => {
    const png = await readAsset(asset);
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(png.length).toBeGreaterThan(100);
  });
});
