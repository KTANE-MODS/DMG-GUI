from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class NoCacheHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


server = ThreadingHTTPServer(("localhost", 8000), NoCacheHTTPRequestHandler)

print("Development server running at http://localhost:8000")

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
    server.server_close()