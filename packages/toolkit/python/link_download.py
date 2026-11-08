#!/usr/bin/env python3
"""link_download: swappable adapter for downloading a PUBLIC video the user points at, run on the user's machine.
Default adapter: yt-dlp. No cookies, no login, no bypass of age or geo restrictions. Platform terms may restrict this; see link_resolve.
Input: { url, out_dir, adapter?: yt-dlp }  Output: { local_path, adapter, caveats[] }"""
import os
import subprocess
from toolkit_io import ToolError, need_bin, run

CAVEATS = ["Downloaded for analysis on this machine only; registered as commercial_ok false.", "Platform terms of service may restrict downloading; the user is responsible for compliance.", "Reliability varies as sites change; swap the adapter if it breaks."]


def main(inp):
    url, out_dir = inp.get("url"), inp.get("out_dir")
    if not url or not out_dir:
        raise ToolError("INVALID_INPUT", "url and out_dir are required")
    adapter = inp.get("adapter", "yt-dlp")
    if adapter != "yt-dlp":
        raise ToolError("INVALID_INPUT", f"unknown adapter {adapter}")
    need_bin("yt-dlp", "pip install yt-dlp")
    os.makedirs(out_dir, exist_ok=True)
    tmpl = os.path.join(out_dir, "%(id)s.%(ext)s")
    p = subprocess.run(["yt-dlp", "--no-cookies", "--no-playlist", "-f", "mp4/best", "-o", tmpl, "--print", "after_move:filepath", url], capture_output=True, text=True)
    if p.returncode != 0:
        raise ToolError("RUNTIME", "download failed", details=p.stderr[-800:], fix_hint="Ask the user for a local file or a screen recording instead")
    return {"local_path": p.stdout.strip().splitlines()[-1], "adapter": adapter, "caveats": CAVEATS}


if __name__ == "__main__":
    run(main)
