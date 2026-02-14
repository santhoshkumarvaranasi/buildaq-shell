const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'dist', 'buildaq-shell', 'browser');
const port = Number(process.env.PORT || 4200);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8'
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    ...headers
  });
  res.end(body);
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const joined = path.join(root, decoded);
  const normalized = path.normalize(joined);
  if (!normalized.startsWith(root)) {
    return null;
  }
  return normalized;
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    return send(res, 400, 'Bad Request', { 'Content-Type': 'text/plain' });
  }

  if (req.url.startsWith('/@vite/client')) {
    return send(res, 200, 'export {};\n', { 'Content-Type': 'text/javascript; charset=utf-8' });
  }

  let filePath = safePath(req.url);
  if (!filePath) {
    return send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain' });
  }

  if (filePath.endsWith(path.sep)) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      if (ext) {
        return send(res, 404, 'Not Found', { 'Content-Type': 'text/plain' });
      }

      const indexPath = path.join(root, 'index.html');
      if (filePath !== indexPath && fs.existsSync(indexPath)) {
        const indexData = fs.readFileSync(indexPath, 'utf8').replace('<script type="module" src="/@vite/client"></script>', '');
        return send(res, 200, indexData, { 'Content-Type': 'text/html; charset=utf-8' });
      }
      return send(res, 404, 'Not Found', { 'Content-Type': 'text/plain' });
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    if (path.basename(filePath) === 'index.html') {
      fs.readFile(filePath, 'utf8', (readErr, data) => {
        if (readErr) {
          return send(res, 500, 'Server Error', { 'Content-Type': 'text/plain' });
        }
        const patched = data.replace('<script type="module" src="/@vite/client"></script>', '');
        return send(res, 200, patched, { 'Content-Type': contentType });
      });
      return;
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        return send(res, 500, 'Server Error', { 'Content-Type': 'text/plain' });
      }
      return send(res, 200, data, { 'Content-Type': contentType });
    });
  });
});

server.listen(port, () => {
  console.log(`Serving ${root} on http://localhost:${port}/`);
});
