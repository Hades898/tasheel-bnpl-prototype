const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
const index = path.join(dist, 'index.html');
const notFound = path.join(dist, '404.html');
if (!fs.existsSync(index)) {
  console.error(`Missing ${index}. Run npm run export:web first.`);
  process.exit(1);
}
const projectBase = '/tasheel-bnpl-prototype';
let html = fs.readFileSync(index, 'utf8');
html = html
  .replaceAll('href="/favicon.ico"', `href="${projectBase}/favicon.ico"`)
  .replaceAll('href="./favicon.ico"', `href="${projectBase}/favicon.ico"`)
  .replaceAll('src="/_expo/', `src="${projectBase}/_expo/`)
  .replaceAll('src="./_expo/', `src="${projectBase}/_expo/`)
  .replaceAll('href="/_expo/', `href="${projectBase}/_expo/`)
  .replaceAll('href="./_expo/', `href="${projectBase}/_expo/`);
fs.writeFileSync(index, html);
fs.writeFileSync(notFound, html);

const bundleDir = path.join(dist, '_expo', 'static', 'js', 'web');
const patchedBundles = [];
if (fs.existsSync(bundleDir)) {
  for (const file of fs.readdirSync(bundleDir)) {
    if (!file.endsWith('.js')) continue;
    const bundlePath = path.join(bundleDir, file);
    let bundle = fs.readFileSync(bundlePath, 'utf8');
    const next = bundle
      .replaceAll('uri:"/assets/', 'uri:"./assets/')
      .replaceAll("uri:'/assets/", "uri:'./assets/");
    if (next !== bundle) {
      fs.writeFileSync(bundlePath, next);
      patchedBundles.push(bundlePath);
    }
  }
}

fs.writeFileSync(path.join(dist, '.nojekyll'), '');
console.log('Patched Expo Web export for GitHub Pages project hosting:', { index, notFound, patchedBundles });
