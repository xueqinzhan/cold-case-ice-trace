"""Local dev server with Cache-Control: no-store to defeat stale browser caches."""
import http.server
import os
import socketserver

PORT = 8900
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), "web"))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # 静默日志

if __name__ == "__main__":
    with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), NoCacheHandler) as httpd:
        print(f"Serving on http://127.0.0.1:{PORT} (no-cache)")
        httpd.serve_forever()
