const https = require('https');
const fs = require('fs');

async function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          statusCode: res.statusCode,
          headers: res.headers,
          bodySnippet: data.slice(0, 300)
        });
      });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

async function audit() {
  console.log('=== STARTING LIVE SEO & SITEMAP AUDIT ===\n');

  // 1. Check robots.txt
  console.log('--- 1. Testing robots.txt ---');
  const robotsRes = await fetchUrl('https://cairocosmo.online/robots.txt');
  console.log('Status:', robotsRes.statusCode);
  console.log('Content:\n' + robotsRes.bodySnippet);

  // 2. Check sitemap.xml
  console.log('\n--- 2. Testing sitemap.xml ---');
  const sitemapRes = await fetchUrl('https://cairocosmo.online/sitemap.xml');
  console.log('Status:', sitemapRes.statusCode);

  // Parse all <loc> from sitemap.xml
  const sitemapXml = fs.readFileSync('public/sitemap.xml', 'utf-8');
  const locs = [];
  const locRegex = /<loc>(https:\/\/cairocosmo\.online[^<]+)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(sitemapXml)) !== null) {
    locs.push(match[1]);
  }

  console.log(`Found ${locs.length} URLs in sitemap.xml to audit.\n`);

  const results = {
    ok: 0,
    redirects: 0,
    forbidden403: 0,
    notFound404: 0,
    errors: 0,
    list: []
  };

  for (let i = 0; i < locs.length; i++) {
    const url = locs[i];
    const res = await fetchUrl(url);
    if (res.statusCode === 200) {
      results.ok++;
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      results.redirects++;
    } else if (res.statusCode === 403) {
      results.forbidden403++;
    } else if (res.statusCode === 404) {
      results.notFound404++;
    } else {
      results.errors++;
    }
    results.list.push({ url, status: res.statusCode, error: res.error });
  }

  console.log('--- Audit Summary ---');
  console.log(`Total URLs Checked: ${locs.length}`);
  console.log(`Status 200 OK: ${results.ok}`);
  console.log(`Status 3xx Redirects: ${results.redirects}`);
  console.log(`Status 403 Forbidden: ${results.forbidden403}`);
  console.log(`Status 404 Not Found: ${results.notFound404}`);
  console.log(`Other Errors: ${results.errors}`);

  if (results.list.filter(r => r.status !== 200).length > 0) {
    console.log('\nNon-200 URLs:');
    console.table(results.list.filter(r => r.status !== 200));
  } else {
    console.log('\n🎉 ALL SITEMAP URLs RETURNED 200 OK!');
  }

  // 3. Check for potential 403 or Soft 404 routes
  console.log('\n--- 3. Testing Special Paths & SPA Fallback ---');
  const specialPaths = [
    'https://cairocosmo.online/admin',
    'https://cairocosmo.online/admin/',
    'https://cairocosmo.online/api/',
    'https://cairocosmo.online/api/data/',
    'https://cairocosmo.online/non-existent-page-test-123',
    'https://cairocosmo.online/ar/non-existent-service-xyz'
  ];

  for (const sp of specialPaths) {
    const r = await fetchUrl(sp);
    console.log(`Path: ${sp} -> Status: ${r.statusCode}`);
  }
}

audit();
