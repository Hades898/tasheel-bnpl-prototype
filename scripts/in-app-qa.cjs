const { chromium } = require('playwright');
const fs = require('fs');

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4174/tasheel-bnpl-prototype';
const routes = [
  'checkout',
  'checkout/app-home',
  'checkout/home',
  'checkout/detail',
  'checkout/details',
  'checkout/insights',
  'checkout/purchases',
  'checkout/dues',
];
const viewports = [
  ['mobile', { width: 390, height: 844 }],
  ['short', { width: 390, height: 640 }],
  ['desktop', { width: 1280, height: 720 }],
];

(async () => {
  fs.mkdirSync('audits/fix-verify', { recursive: true });
  fs.mkdirSync('screenshots/fix-verify', { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const summary = [];
  for (const [viewportName, viewport] of viewports) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('pageerror', (err) => errors.push(String(err)));
      const url = `${base}/${route}?qa=${Date.now()}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const before = await page.evaluate(() => {
        const scrollables = [...document.querySelectorAll('*')].filter((el) => el.scrollHeight > el.clientHeight + 5);
        return {
          text: document.body.innerText.replace(/\s+/g, ' ').trim(),
          scrollableCount: scrollables.length,
          scrollables: scrollables.map((el) => ({ scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, scrollTop: el.scrollTop })).slice(0, 5),
        };
      });
      await page.screenshot({ path: `screenshots/fix-verify/${route.replace('/', '-')}-${viewportName}.png`, fullPage: true });
      await page.evaluate(() => {
        for (const el of [...document.querySelectorAll('*')]) {
          if (el.scrollHeight > el.clientHeight + 5) el.scrollTop = el.scrollHeight;
        }
      });
      await page.waitForTimeout(100);
      await page.screenshot({ path: `screenshots/fix-verify/${route.replace('/', '-')}-${viewportName}-bottom.png`, fullPage: true });
      const after = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
      const required = route.includes('detail') ? ['Reference', 'Pay Next Installment'] : route.includes('purchases') ? ['AirPods Pro 3', 'Completed'] : route.includes('dues') ? ['4 Dues Selected', 'Remaining 1200'] : [];
      const missing = required.filter((item) => !after.includes(item));
      summary.push({ route, viewportName, errors: errors.length, missing, scrollableCount: before.scrollableCount, text: before.text.slice(0, 90) });
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync('audits/fix-verify/in-app-qa-summary.json', JSON.stringify(summary, null, 2));
  console.table(summary);
  const failed = summary.filter((row) => row.errors || row.missing.length);
  if (failed.length) {
    console.error('QA failed', failed);
    process.exit(1);
  }
})();
