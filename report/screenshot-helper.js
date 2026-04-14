#!/usr/bin/env node
/**
 * screenshot-helper.js
 * 
 * Automated screenshot capture for the Alumni Portal project report.
 * Run this script ONCE while both servers are running:
 *   - Backend:  node backend/server.js   (port 3000)
 *   - Frontend: npm run dev in frontend  (port 5173)
 * 
 * Usage (from project root):
 *   node report/screenshot-helper.js
 * 
 * Requirements: puppeteer
 *   npm install puppeteer --save-dev
 * OR if already installed globally, use npx.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const reportDir = path.join(__dirname);

const BASE = 'http://localhost:5173/AluminiPortal/#';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function shot(page, filename) {
  await sleep(1200);
  await page.screenshot({
    path: path.join(reportDir, filename),
    fullPage: false,
  });
  console.log('📸 Saved:', filename);
}

async function fillInput(page, selector, value) {
  await page.click(selector);
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.type(selector, value);
}

(async () => {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1280, height: 800 } });
  const page = await browser.newPage();

  // ------- 1. Login Page -------
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2' });
  await sleep(800);
  await shot(page, 'screen-login.png');

  // ------- 2. Register Page -------
  // find register link by text
  const regLinks = await page.$$('a, button');
  for (const el of regLinks) {
    const txt = await el.evaluate(e => e.textContent.trim().toLowerCase());
    if (txt.includes('register') || txt.includes('sign up') || txt.includes('create')) {
      await el.click(); break;
    }
  }
  await sleep(900);
  await shot(page, 'screen-register.png');

  // ------- 3. Login as regular user -------
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2' });
  await sleep(800);
  // Fill login form
  const inputs = await page.$$('input');
  if (inputs.length >= 3) {
    await inputs[0].type('Hari Charan');
    await inputs[1].type('hari@alumni.com');
    await inputs[2].type('pass1234');
  }
  const submitBtns = await page.$$('button[type="submit"], button');
  for (const b of submitBtns) {
    const t = await b.evaluate(e => e.textContent.toLowerCase());
    if (t.includes('login') || t.includes('sign in')) { await b.click(); break; }
  }
  await sleep(2500);
  await shot(page, 'screen-dashboard.png');

  // helper to click button by text
  const clickBtn = async (txt) => {
    const bs = await page.$$('button');
    for (const b of bs) {
      const t = await b.evaluate(e => e.textContent.trim());
      if (t.includes(txt)) { await b.click(); return true; }
    }
    return false;
  };

  // ------- 4. Analytics tab -------
  await clickBtn('Analytics');
  await sleep(2200);
  await shot(page, 'screen-analytics.png');

  // ------- 5. By Company sub-tab -------
  await clickBtn('Company');
  await sleep(800);
  await shot(page, 'screen-analytics-company.png');

  // ------- 6. Audit Log -------
  await clickBtn('Audit');
  await sleep(800);
  await shot(page, 'screen-analytics-audit.png');

  // ------- 7. SQL Queries -------
  await clickBtn('SQL');
  await sleep(500);
  // Expand first two expandable cards
  const expandables = await page.$$('button');
  let expanded = 0;
  for (const b of expandables) {
    const t = await b.evaluate(e => e.textContent.trim());
    if (t.includes('CREATE') || t.includes('DDL') || t.includes('SELECT') || t.includes('INSERT')) {
      await b.click();
      await sleep(250);
      if (++expanded >= 2) break;
    }
  }
  await shot(page, 'screen-sql.png');

  // ------- 8. Messages tab -------
  await clickBtn('Messages');
  await sleep(800);
  await shot(page, 'screen-messages.png');

  // ------- 9. Admin login -------
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2' });
  await sleep(700);
  const adminInputs = await page.$$('input');
  if (adminInputs.length >= 3) {
    await adminInputs[0].type('Admin User');
    await adminInputs[1].type('admin@alumni.com');
    await adminInputs[2].type('admin123');
    if (adminInputs[3]) await adminInputs[3].type('ADMIN2026');
  }
  const loginBtns2 = await page.$$('button');
  for (const b of loginBtns2) {
    const t = await b.evaluate(e => e.textContent.toLowerCase());
    if (t.includes('login') || t.includes('sign in')) { await b.click(); break; }
  }
  await sleep(2500);
  await shot(page, 'screen-admin.png');

  // ------- 10. Add Alumni form -------
  await clickBtn('Add Alumni');
  await sleep(800);
  await shot(page, 'screen-add.png');

  console.log('\n✅ All screenshots saved to report/ folder!');
  await browser.close();
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
