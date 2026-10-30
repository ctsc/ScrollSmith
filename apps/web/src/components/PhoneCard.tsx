import { Play } from "lucide-react";

export type Scene = {
  title: string;
  style: string;
  gradient: string;
  views: string;
  meta: string;
};

export const scenes: Scene[] = [
  { title: "What if the moon was a lamp?", style: "Pastel clay", gradient: "from-sky-400/70 via-indigo-600/60 to-slate-900", views: "2.4M", meta: "EP 3 · 0:42" },
  { title: "Day in the life of a Roman baker", style: "Documentary", gradient: "from-amber-300/60 via-orange-700/50 to-slate-950", views: "812K", meta: "EP 12 · 1:15" },
  { title: "Cities after humans left", style: "Cinematic", gradient: "from-emerald-300/60 via-teal-700/50 to-slate-950", views: "1.1M", meta: "EP 1 · 0:58" },
  { title: "5 facts about deep sea fish", style: "Anime", gradient: "from-fuchsia-400/60 via-purple-700/50 to-slate-950", views: "3.7M", meta: "EP 7 · 0:34" },
  { title: "The noir detective who hates rain", style: "Film noir", gradient: "from-slate-300/50 via-slate-600/50 to-black", views: "640K", meta: "EP 2 · 1:02" },
  { title: "Tiny chef cooks a giant pancake", style: "Claymation", gradient: "from-rose-300/60 via-red-600/50 to-slate-950", views: "5.2M", meta: "EP 19 · 0:27" },
  { title: "The last arcade on Earth", style: "Pixel art", gradient: "from-violet-400/60 via-indigo-800/60 to-slate-950", views: "1.9M", meta: "EP 4 · 0:49" },
  { title: "A letter that took 40 years to arrive", style: "Watercolor", gradient: "from-teal-200/60 via-cyan-700/50 to-slate-950", views: "476K", meta: "EP 1 · 1:24" },
  { title: "Why do cats knock things over?", style: "Paper cutout", gradient: "from-yellow-300/60 via-lime-700/50 to-slate-950", views: "8.1M", meta: "EP 9 · 0:31" },
  { title: "Building a city in 60 seconds", style: "Low-poly 3D", gradient: "from-orange-300/60 via-pink-700/50 to-slate-950", views: "2.2M", meta: "EP 5 · 1:00" },
];

export const heroScenes: Scene[] = [
  { title: "The lighthouse keeper's last night", style: "Stop motion", gradient: "from-blue-300/60 via-blue-800/60 to-slate-950", views: "3.1M", meta: "EP 6 · 0:47" },
  { title: "How ants built an empire", style: "Comic book", gradient: "from-red-400/60 via-amber-700/50 to-slate-950", views: "6.8M", meta: "EP 2 · 0:39" },
  { title: "Where do dreams go after you wake?", style: "Oil painting", gradient: "from-purple-300/60 via-indigo-800/60 to-slate-950", views: "1.4M", meta: "EP 11 · 0:55" },
];

export function PhoneCard({ scene, className = "" }: { scene: Scene; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/16] w-40 shrink-0 overflow-hidden rounded-[1.4rem] border border-white/10 bg-gradient-to-b ${scene.gradient} shadow-2xl shadow-black/60 sm:w-48 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 text-[10px] text-white/80">
        <span className="rounded-full bg-black/30 px-2 py-0.5 backdrop-blur">{scene.style}</span>
        <span>{scene.views} views</span>
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur">
          <Play className="ml-0.5 size-4 fill-white text-white" />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
        <p className="text-xs font-semibold leading-snug text-white">{scene.title}</p>
        <p className="mt-1 text-[10px] text-white/60">{scene.meta}</p>
      </div>
    </div>
  );
}
