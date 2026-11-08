"""Shared I/O for toolkit python scripts: JSON in (file path or stdin), JSON out, error.v1 on failure.
Exit codes: 0 ok, 1 invalid input, 2 environment missing, 3 runtime failure."""
import json
import shutil
import subprocess
import sys

EXIT = {"INVALID_INPUT": 1, "ENV_MISSING": 2, "RUNTIME": 3}


class ToolError(Exception):
    def __init__(self, code, message, fix_hint=None, details=None):
        super().__init__(message)
        self.code, self.fix_hint, self.details = code, fix_hint, details

    def to_json(self):
        e = {"code": self.code, "message": str(self), "retryable": self.code in ("RATE_LIMITED", "TIMEOUT", "PROVIDER_ERROR")}
        if self.fix_hint:
            e["fix_hint"] = self.fix_hint
        if self.details is not None:
            e["details"] = self.details
        return e


def read_input(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    files = [a for a in argv if not a.startswith("--")]
    if files:
        with open(files[0], encoding="utf8") as f:
            return json.load(f)
    raw = sys.stdin.read().strip()
    return json.loads(raw) if raw else {}


def need_bin(name, hint=None):
    if shutil.which(name) is None:
        raise ToolError("ENV_MISSING", f"{name} not found on PATH", fix_hint=hint or f"Install {name} and re-run local_env_check")
    return name


def ffmpeg(args, capture=True):
    need_bin("ffmpeg")
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-y", *args], capture_output=capture, text=True)
    if p.returncode != 0:
        raise ToolError("RUNTIME", "ffmpeg failed", details=(p.stderr or "")[-2000:])
    return p.stderr or ""


def ffprobe_json(path):
    need_bin("ffprobe")
    p = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", path], capture_output=True, text=True)
    if p.returncode != 0:
        raise ToolError("INVALID_INPUT", f"ffprobe could not read {path}", details=p.stderr[-500:])
    return json.loads(p.stdout)


def run(fn):
    try:
        out = fn(read_input())
        json.dump(out, sys.stdout, indent=2)
        sys.stdout.write("\n")
    except ToolError as e:
        json.dump(e.to_json(), sys.stdout, indent=2)
        sys.stdout.write("\n")
        sys.exit(EXIT.get("RUNTIME" if e.code not in EXIT else e.code, 3) if e.code in EXIT else 3)
    except (KeyError, ValueError, TypeError) as e:
        json.dump(ToolError("INVALID_INPUT", str(e)).to_json(), sys.stdout, indent=2)
        sys.exit(1)
    except Exception as e:  # noqa: BLE001
        json.dump(ToolError("RUNTIME", str(e)).to_json(), sys.stdout, indent=2)
        sys.exit(3)
