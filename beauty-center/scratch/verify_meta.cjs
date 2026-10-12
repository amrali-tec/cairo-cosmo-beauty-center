const https = require('https');

async function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function verifyMeta() {
  const pages = [
    'https://cairocosmo.online/ar',
    'https://cairocosmo.online/en',
    'https://cairocosmo.online/ar/services',
    'https://cairocosmo.online/ar/doctors',
    'https://cairocosmo.online/ar/calculator'
  ];

  for (const p of pages) {
    const html = await fetchPage(p);
    console.log(`\n=== Checking: ${p} ===`);
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
    const descMatch = html.match(/name="description"[\s\S]*?content="([^"]*)"/);
    const canonMatch = html.match(/rel="canonical"[\s\S]*?href="([^"]*)"/);
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

    console.log('Title:', titleMatch ? titleMatch[1].trim() : 'NOT FOUND');
    console.log('Description:', descMatch ? descMatch[1].trim() : 'NOT FOUND');
    console.log('Canonical:', canonMatch ? canonMatch[1].trim() : 'NOT FOUND');
    let schemaValid = false;
    if (jsonLdMatch) {
      try {
        JSON.parse(jsonLdMatch[1]);
        schemaValid = true;
      } catch (e) {
        schemaValid = false;
      }
    }
    console.log('Schema JSON-LD Valid:', schemaValid);
  }
}

verifyMeta();
