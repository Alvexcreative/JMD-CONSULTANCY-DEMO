#!/usr/bin/env python3
"""Dev server for a single concept, on its own port.

Serves the real file rather than a copy, so changes here are changes to
the concept itself. Watches that file plus the shared assets it depends
on and reloads the browser when any of them change.

    python3 chalk-dev.py [port] [file]

    python3 chalk-dev.py                       8750, 08-chalk.html
    python3 chalk-dev.py 8755 08-chalk-original.html
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json, sys, threading, time

ROOT = Path(__file__).parent.resolve()
ENTRY = "/concepts/" + (sys.argv[2] if len(sys.argv) > 2 else "08-chalk.html")

# Only these are watched; the other concepts are irrelevant to this server.
WATCH = [
    ROOT / ENTRY.lstrip("/"),
    ROOT / "shared/review.css",
    ROOT / "shared/review.js",
]

# Injected into the served HTML so the page can listen for a reload ping.
# Kept out of the source file deliberately — nothing about this dev loop
# should end up in the concept or in git.
LIVE = """
<script>
(function () {
  let last = null;
  setInterval(async () => {
    try {
      const r = await fetch('/__changed', { cache: 'no-store' });
      const { stamp } = await r.json();
      if (last !== null && stamp !== last) location.reload();
      last = stamp;
    } catch (e) { /* server restarting — ignore and keep polling */ }
  }, 500);
})();
</script>
""".encode("utf-8")


def stamp():
    """Newest mtime across the watched files, as a change fingerprint."""
    return max((p.stat().st_mtime for p in WATCH if p.exists()), default=0)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def do_GET(self):
        if self.path.startswith("/__changed"):
            body = json.dumps({"stamp": stamp()}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            return

        # Serve the entry page with the reload listener appended.
        if self.path.split("?")[0] in (ENTRY, "/", "/index.html"):
            target = ROOT / ENTRY.lstrip("/")
            if target.exists():
                body = target.read_bytes()
                # The concept switcher belongs to the multi-concept server;
                # here it is noise, and its relative links 404 because this
                # page is served from the root. Stripped in transit only —
                # the source file is untouched and still works on 8745.
                body = body.replace(
                    b'<script src="../shared/review.js"></script>', b"")
                body = body.replace(
                    b'<link rel="stylesheet" href="../shared/review.css">', b"")
                body = body.replace(b"</body>", LIVE + b"</body>")
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(body)
                return

        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8750
    missing = [str(p.relative_to(ROOT)) for p in WATCH if not p.exists()]
    if missing:
        print("  warning — not found, so not watched: " + ", ".join(missing))
    srv = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    srv.daemon_threads = True
    print(f"Dev server  ->  http://localhost:{port}/   ({ENTRY})")
    print(f"  serving          {ROOT / ENTRY.lstrip(chr(47))}")
    print(f"  live reload on   {', '.join(str(p.relative_to(ROOT)) for p in WATCH if p.exists())}")
    srv.serve_forever()
