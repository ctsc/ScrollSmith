export const site = {
  name: "Scrollsmith AI",
  shortName: "Scrollsmith",
  tagline: "AI short-form video for creators",
  description:
    "Turn one idea into scroll-stopping Reels, TikToks and Shorts. AI video, image and voice in one simple studio built for faceless and short-form creators. Free to sign up.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://scrollsmith.ai",
  social: {
    instagram: "https://www.instagram.com/cubestoriesdaily/",
    tiktok: "https://tiktok.com/",
    youtube: "https://youtube.com/",
  },
  launchCopy: {
    badge: "Launching soon · free to sign up",
    headline: ["Short-form videos", "Made by AI", "Posted by you"],
    subheadline:
      "One idea generated into a finished Reel, TikTok or YouTube Short. Video, images and voice in one simple studio built for faceless creators. No 7 different tabs. No learning curve.",
    cta: "Get early access",
    success: "You're on the list. We'll email you the moment the app opens.",
    duplicate: "You're already on the list. We'll be in touch soon.",
  },
} as const;

export type Platform = "instagram" | "tiktok" | "youtube";

export const platforms: { id: Platform; label: string }[] = [
  { id: "instagram", label: "Instagram Reels" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube Shorts" },
];
