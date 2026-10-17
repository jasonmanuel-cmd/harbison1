"""Serve the built Vercel static output with production-like compression/cache headers.

Run after `npm run build`: python scripts/preview-production.py
"""
import gzip
import io
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class Handler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            path = path / 'index.html'
        if not path.is_file():
            return super().send_head()
        content_type = self.guess_type(str(path))
        data = path.read_bytes()
        compress = ('gzip' in self.headers.get('Accept-Encoding', '')
                    and (content_type.startswith('text/') or content_type in
                         ('application/javascript', 'application/json', 'image/svg+xml')))
        if compress:
            data = gzip.compress(data)
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Vary', 'Accept-Encoding')
        self.send_header('Cache-Control', 'public, max-age=31536000, immutable'
                         if '/_astro/' in self.path else 'no-cache')
        if compress:
            self.send_header('Content-Encoding', 'gzip')
        self.end_headers()
        return io.BytesIO(data)


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1] / '.vercel/output/static'
    if not (root / 'index.html').exists():
        raise SystemExit('Run npm run build first.')
    server = ThreadingHTTPServer(('127.0.0.1', 4322), partial(Handler, directory=str(root)))
    print('Production preview: http://127.0.0.1:4322/', flush=True)
    server.serve_forever()
