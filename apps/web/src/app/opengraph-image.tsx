import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} - ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 50% -20%, rgba(61,208,255,0.45), #05070d 60%)",
          color: "#eef3ff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 600 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg,#3dd0ff,#2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#05070d",
              fontSize: 28,
            }}
          >
            ▶
          </div>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>
            <div>Short-form videos.</div>
            <div style={{ display: "flex", gap: 20 }}>
              <span style={{ color: "#3dd0ff" }}>Made by AI.</span>
              <span>Posted by you.</span>
            </div>
          </div>
          <div style={{ fontSize: 30, color: "#8a97b3" }}>
            AI video, image and voice for Reels, TikTok and Shorts. Free to sign up.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
