const { test, expect } = require('@playwright/test');

const path = require('path');
const PAGE_URL = 'file://' + path.resolve(__dirname, '..', 'index.html');

const IMAGE_SELECTORS = [
  '.hero-photo-band',
  '.model-photo-card:nth-child(1) .model-photo',
  '.model-photo-card:nth-child(2) .model-photo',
  '.model-photo-card:nth-child(3) .model-photo',
  '.model-photo-card:nth-child(4) .model-photo',
  '.newsroom-article-card:nth-child(1) .newsroom-photo',
  '.newsroom-article-card:nth-child(2) .newsroom-photo',
  '.cta-band-photo',
];

test.describe('Jeep Collection Landing Page', () => {

  test('loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');
    expect(errors.filter(e => !e.includes('fonts.googleapis'))).toEqual([]);
  });

  test('shows JEEP wordmark in top nav', async ({ page }) => {
    await page.goto(PAGE_URL);
    const wordmark = page.locator('.top-nav .wordmark');
    await expect(wordmark).toHaveText('JEEP');
  });

  test('hero headline reads THE JEEP COLLECTION', async ({ page }) => {
    await page.goto(PAGE_URL);
    const h1 = page.locator('.hero-content h1.display-xl');
    await expect(h1).toHaveText('THE JEEP COLLECTION');
  });

  test('hero has EXPLORE CTA button', async ({ page }) => {
    await page.goto(PAGE_URL);
    const cta = page.locator('#heroCta');
    await expect(cta).toHaveText('EXPLORE');
  });

  test('renders exactly 4 model cards with correct names', async ({ page }) => {
    await page.goto(PAGE_URL);
    const cards = page.locator('.model-photo-card');
    await expect(cards).toHaveCount(4);
    const names = await page.locator('.model-photo-card .model-name').allTextContents();
    expect(names).toEqual(['WRANGLER', 'GRAND CHEROKEE', 'GLADIATOR', 'WAGONEER']);
  });

  test('each model card has a DISCOVER link and a photo background', async ({ page }) => {
    await page.goto(PAGE_URL);
    const count = await page.locator('.model-photo-card').count();
    for (let i = 0; i < count; i++) {
      const card = page.locator('.model-photo-card').nth(i);
      await expect(card.locator('.text-link')).toHaveText('DISCOVER');
      const photo = card.locator('.model-photo');
      const bg = await photo.evaluate(el => getComputedStyle(el).backgroundImage);
      expect(bg).toContain('loremflickr.com');
    }
  });

  test('spec table shows 4 spec cells with values and labels', async ({ page }) => {
    await page.goto(PAGE_URL);
    const cells = page.locator('.spec-cell');
    await expect(cells).toHaveCount(4);
    const values = await page.locator('.spec-cell .spec-value').allTextContents();
    expect(values).toEqual(['470', '470', '4.7', '10.1']);
    const labels = await page.locator('.spec-cell .spec-label').allTextContents();
    expect(labels).toEqual(['HORSEPOWER', 'TORQUE (LB-FT)', '0–60 MPH (SECONDS)', 'GROUND CLEARANCE (INCHES)']);
  });

  test('editorial heritage section has SINCE 1941 caption and body paragraphs', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('#heritage .caption-uppercase')).toHaveText('SINCE 1941');
    await expect(page.locator('#heritage h2.display-lg')).toHaveText('EIGHTY YEARS OF TRAIL-RATED HERITAGE');
    const paras = page.locator('#heritage .body-md');
    await expect(paras).toHaveCount(2);
  });

  test('newsroom shows 2 article cards with dates and titles', async ({ page }) => {
    await page.goto(PAGE_URL);
    const cards = page.locator('.newsroom-article-card');
    await expect(cards).toHaveCount(2);
    await expect(page.locator('.newsroom-article-card').first().locator('.date-pill')).toHaveText('12. NOVEMBER 2025');
    await expect(page.locator('.newsroom-article-card').nth(1).locator('.date-pill')).toHaveText('05. OCTOBER 2025');
  });

  test('CTA band has DISCOVER THE COLLECTION heading and BOOK A TEST DRIVE button', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('.cta-band-photo h2.display-md')).toHaveText('DISCOVER THE COLLECTION');
    await expect(page.locator('#ctaButton')).toHaveText('BOOK A TEST DRIVE');
  });

  test('footer has 4 columns and JEEP wordmark', async ({ page }) => {
    await page.goto(PAGE_URL);
    const cols = page.locator('.footer-col');
    await expect(cols).toHaveCount(4);
    const headings = await page.locator('.footer-col h4').allTextContents();
    expect(headings).toEqual(['JEEP', 'MODELS', 'HERITAGE', 'CONNECT']);
    await expect(page.locator('.footer-wordmark')).toHaveText('JEEP');
  });

  test('footer year updates to current year via JS', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.waitForFunction(() => {
      const el = document.getElementById('footer-year');
      return el && el.textContent === String(new Date().getFullYear());
    });
    const year = await page.locator('#footer-year').textContent();
    expect(year).toBe(String(new Date().getFullYear()));
  });

  test('clicking BOOK A TEST DRIVE opens the modal dialog', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.locator('#ctaButton').click();
    await expect(page.locator('#testDriveModal')).toHaveClass(/open/);
  });

  test('closing the modal with the close button hides it', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.locator('#ctaButton').click();
    await expect(page.locator('#testDriveModal')).toHaveClass(/open/);
    await page.locator('.modal-close').click();
    await expect(page.locator('#testDriveModal')).not.toHaveClass(/open/);
  });

  test('Escape key closes nav menu', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.locator('.nav-toggle').click();
    await expect(page.locator('#navMenu')).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#navMenu')).not.toHaveClass(/open/);
  });

  test('nav menu shows 5 links when opened', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.locator('.nav-toggle').click();
    const links = page.locator('#navMenu a');
    await expect(links).toHaveCount(5);
    const texts = await links.allTextContents();
    expect(texts).toEqual(['MODELS', 'SPECIFICATIONS', 'HERITAGE', 'NEWSROOM', 'CONNECT']);
  });

  test('body background is pure black (#000000)', async ({ page }) => {
    await page.goto(PAGE_URL);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(0, 0, 0)');
  });

  test('no font weights exceed 400 across the page', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');
    const heavyWeights = await page.evaluate(() => {
      const all = document.querySelectorAll('*');
      const offenders = [];
      all.forEach(el => {
        const w = getComputedStyle(el).fontWeight;
        const numeric = parseInt(w, 10);
        if (!isNaN(numeric) && numeric > 400) offenders.push({ tag: el.tagName, weight: w, text: el.textContent.slice(0, 30) });
      });
      return offenders;
    });
    expect(heavyWeights).toEqual([]);
  });

  test('all border radii are 0 except pill buttons (9999px) and icon buttons (50%)', async ({ page }) => {
    await page.goto(PAGE_URL);
    const offendingRadii = await page.evaluate(() => {
      const offenders = [];
      document.querySelectorAll('*').forEach(el => {
        const r = getComputedStyle(el).borderRadius;
        if (r === '0px' || r === '' || r === '0%') return;
        if (el.classList.contains('button-primary')) return;
        if (el.classList.contains('button-icon')) return;
        offenders.push({ tag: el.tagName, class: el.className, radius: r });
      });
      return offenders;
    });
    expect(offendingRadii).toEqual([]);
  });

  test('hero image background is set to an unsplash URL', async ({ page }) => {
    await page.goto(PAGE_URL);
    const bg = await page.locator('.hero-photo-band').evaluate(el => getComputedStyle(el).backgroundImage);
    expect(bg).toContain('loremflickr.com');
  });

  test('every background-image URL returns HTTP 200 (images actually load)', async ({ page, request }) => {
    await page.goto(PAGE_URL);
    const urls = await page.evaluate((sels) => sels.map(s => {
      const el = document.querySelector(s);
      if (!el) return null;
      const bg = getComputedStyle(el).backgroundImage;
      const match = bg.match(/url\(["']?(.+?)["']?\)/);
      return match ? match[1] : null;
    }), IMAGE_SELECTORS);
    expect(urls.every(Boolean)).toBe(true);
    for (const url of urls) {
      const res = await request.get(url);
      expect(res.status(), `expected 200 for ${url}`).toBe(200);
      const contentType = res.headers()['content-type'] || '';
      expect(contentType).toContain('image');
    }
  });

  test('visual smoke — captures full-page screenshot', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: 'screenshot-desktop.png', fullPage: true });
  });

  test('mobile responsive — 375px viewport renders without horizontal overflow', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('submitting modal form shows REQUEST RECEIVED confirmation', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.locator('#ctaButton').click();
    await page.locator('.text-input[type="text"]').fill('Test User');
    await page.locator('.text-input[type="email"]').fill('test@example.com');
    await page.locator('#modalSubmit').click();
    await expect(page.locator('text=REQUEST RECEIVED')).toBeVisible({ timeout: 1000 });
  });
});