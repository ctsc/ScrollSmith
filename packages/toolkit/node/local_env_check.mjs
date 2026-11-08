#!/usr/bin/env node
/**
 * local_env_check: verify the creator's machine can run the script skills.
 * Input: {} (optional { want: ["render", "footage", "audio"] })
 * Output: { ok, platform, found: {tool: version}, missing: [], optional_missing: [], install_steps, notes[] }
 * Checks ffmpeg, ffprobe, node, python3, Chromium (for Remotion), optional whisperx, mediapipe, librosa, yt-dlp, tesseract.
 */
import { execFileSync } from "node:child_process";
import { platform, arch } from "node:os";
import { run } from "./lib/io.mjs";

function ver(cmd, args = ["-version"]) {
  try {
    return execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"], timeout: 8000 }).toString().split("\n")[0].trim();
  } catch {
    return null;
  }
}

function pyModule(mod) {
  try {
    execFileSync("python3", ["-c", `import ${mod}`], { stdio: "ignore", timeout: 6000 });
    return true;
  } catch {
    return false;
  }
}

const INSTALL = {
  darwin: {
    ffmpeg: "brew install ffmpeg",
    node: "brew install node (or https://nodejs.org, version 20 or newer)",
    python3: "brew install python@3.11",
    chromium: "Remotion downloads a headless Chrome on first render: npx remotion browser ensure",
    tesseract: "brew install tesseract",
    "yt-dlp": "brew install yt-dlp",
    python_extras: "python3 -m venv .venv && source .venv/bin/activate && pip install -r toolkit/requirements.txt",
  },
  win32: {
    ffmpeg: "winget install Gyan.FFmpeg (then restart the terminal)",
    node: "winget install OpenJS.NodeJS.LTS",
    python3: "winget install Python.Python.3.11 (use py -3 or python)",
    chromium: "npx remotion browser ensure",
    tesseract: "winget install UB-Mannheim.TesseractOCR",
    "yt-dlp": "winget install yt-dlp.yt-dlp",
    python_extras: "python -m venv .venv && .venv\\Scripts\\activate && pip install -r toolkit\\requirements.txt",
  },
  linux: {
    ffmpeg: "sudo apt install ffmpeg",
    node: "https://nodejs.org or nvm install 20",
    python3: "sudo apt install python3 python3-venv python3-pip",
    chromium: "npx remotion browser ensure (needs libnss3, libatk, libgbm; see remotion.dev/docs/miscellaneous/linux-dependencies)",
    tesseract: "sudo apt install tesseract-ocr",
    "yt-dlp": "pipx install yt-dlp",
    python_extras: "python3 -m venv .venv && source .venv/bin/activate && pip install -r toolkit/requirements.txt",
  },
};

export function checkEnv({ probe_python = true, probe_optional = true } = {}) {
  const os = platform();
  const steps = INSTALL[os] ?? INSTALL.linux;
  const found = {};
  const missing = [];
  const optional = [];
  const nodeV = process.versions.node;
  found.node = `v${nodeV}`;
  if (Number(nodeV.split(".")[0]) < 20) missing.push({ tool: "node", why: "Node 20 or newer is required", install: steps.node });
  for (const t of ["ffmpeg", "ffprobe"]) {
    const v = ver(t);
    if (v) found[t] = v; else missing.push({ tool: t, why: "needed by every audio, caption, QA and render script", install: steps.ffmpeg });
  }
  const py = ver("python3", ["--version"]) ?? ver("python", ["--version"]);
  if (py) found.python = py; else missing.push({ tool: "python3", why: "needed for audio_align, footage_ingest, beat_detect", install: steps.python3 });
  for (const [mod, why] of [["librosa", "beat_detect, footage_ingest emphasis"], ["whisperx", "audio_align and transcribe (free local path)"], ["mediapipe", "face tracks for auto_reframe and F3/F4"], ["soundfile", "audio I/O"]]) {
    if (py && probe_python) (pyModule(mod) ? (found[mod] = "installed") : optional.push({ tool: mod, why, install: steps.python_extras }));
  }
  for (const [t, why, key] of probe_optional ? [["tesseract", "OCR for qa_check text boxes and edit_style_create captions", "tesseract"], ["yt-dlp", "link_resolve step 2 (public video download on your machine; reliability not guaranteed)", "yt-dlp"]] : []) {
    const v = ver(t, ["--version"]);
    if (v) found[t] = v; else optional.push({ tool: t, why, install: steps[key] });
  }
  const chrome = probe_optional ? ["google-chrome", "chromium", "chromium-browser"].map((c) => ver(c, ["--version"])).find(Boolean) : null;
  if (chrome) found.chromium = chrome; else if (probe_optional) optional.push({ tool: "chromium", why: "Remotion renders in headless Chrome; it can download its own", install: steps.chromium });
  const gpu = os === "darwin" && arch() === "arm64" ? "Apple silicon: hardware encode via h264_videotoolbox available" : "GPU encoder not probed; use CPU libx264 unless you know your encoder (h264_nvenc, h264_qsv, h264_videotoolbox)";
  return {
    ok: missing.length === 0,
    platform: `${os}-${arch()}`,
    found,
    missing,
    optional_missing: optional,
    install_steps: steps,
    notes: [
      gpu,
      "Remotion license: you (or your organization) are the licensee because rendering happens on your machine. Free for individuals and teams of up to 3; organizations of 4 or more may need a company license. HyperFrames (Apache 2.0) is the license-free engine alternative.",
      "Nothing here uploads footage. All scripts write into your local project folder.",
    ],
  };
}

if (import.meta.url === `file://${process.argv[1]}`) run((input) => checkEnv(input));
