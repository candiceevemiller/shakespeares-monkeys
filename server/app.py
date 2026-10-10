#!/usr/bin/env python3
"""Global best-record API for Shakespeare's Monkeys.

Stdlib-only on purpose: this box doesn't run Node, and the whole job is
"hold one JSON record and let people improve it." Score is always
recomputed here from the submitted text against target.json, so a client
can't just POST a fabricated score.
"""
import json
import os
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", "8787"))
DATA_FILE = os.environ.get("DATA_FILE", "/var/lib/shakespeares-monkeys/best.json")
TARGET_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "target.json")
MAX_BODY_BYTES = 8192

with open(TARGET_FILE, encoding="utf-8") as f:
    TARGET = json.load(f)

_lock = threading.Lock()


def score_attempt(text):
    matches = sum(1 for a, b in zip(text, TARGET) if a == b)
    return matches / len(TARGET)


def load_best():
    try:
        with open(DATA_FILE, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def save_best(record):
    tmp_path = DATA_FILE + ".tmp"
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(record, f)
    os.replace(tmp_path, DATA_FILE)


class Handler(BaseHTTPRequestHandler):
    server_version = "monkeys-api/1"

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path.rstrip("/") != "/best":
            self._send_json(404, {"error": "not found"})
            return
        with _lock:
            best = load_best()
        self._send_json(200, {"best": best})

    def do_POST(self):
        if self.path.rstrip("/") != "/best":
            self._send_json(404, {"error": "not found"})
            return

        length = int(self.headers.get("Content-Length", 0))
        if length <= 0 or length > MAX_BODY_BYTES:
            self._send_json(400, {"error": "bad content length"})
            return

        try:
            payload = json.loads(self.rfile.read(length))
            text = payload["text"]
            attempts = int(payload["attempts"])
        except (KeyError, ValueError, json.JSONDecodeError):
            self._send_json(400, {"error": "bad payload"})
            return

        if not isinstance(text, str) or len(text) != len(TARGET) or attempts < 0:
            self._send_json(400, {"error": "invalid attempt"})
            return

        score = score_attempt(text)

        with _lock:
            current = load_best()
            if current is None or score > current["score"]:
                current = {
                    "text": text,
                    "score": score,
                    "attempts": attempts,
                    "at": int(time.time() * 1000),
                }
                save_best(current)

        self._send_json(200, {"best": current})

    def log_message(self, fmt, *args):
        pass


def main():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"shakespeares-monkeys-api listening on 127.0.0.1:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
