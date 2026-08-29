import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { MapPin, Calendar, Download, Compass, Users, Sparkles } from "lucide-react";
import { TravelBackground } from "~/components/travel-bg";
import { motion } from "framer-motion";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Deyor — Build Your Perfect Trip" },
    {
      name: "description",
      content:
        "Plan a personalized day-by-day travel itinerary with Deyor. Choose from curated destinations, pick your interests, and download a designed PDF itinerary.",
    },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Deyor — Build Your Perfect Trip" },
    {
      property: "og:description",
      content:
        "Plan a personalized day-by-day travel itinerary. Choose from curated destinations, pick your interests, and download a designed PDF.",
    },
    { property: "og:url", content: "https://deyor-trip-builder.melvingeorge-me.workers.dev/" },
    { property: "og:site_name", content: "Deyor" },
    { property: "og:image", content: "https://deyor-trip-builder.melvingeorge-me.workers.dev/deyor-logo-white.png" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Deyor — Build Your Perfect Trip" },
    {
      name: "twitter:description",
      content:
        "Plan a personalized day-by-day travel itinerary with Deyor.",
    },
    { name: "robots", content: "index, follow" },
  ];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: MapPin,
    title: "Curated destinations",
    desc: "Bali, Goa, Coorg, Manali, Jaipur — handpicked with real activities.",
    accent: "bg-brand-50 border-brand-200 text-brand-600",
  },
  {
    icon: Compass,
    title: "Interest matching",
    desc: "Adventure, leisure, culture, attractions — we build around what you love.",
    accent: "bg-accent-50 border-accent-200 text-accent-600",
  },
  {
    icon: Calendar,
    title: "Smart itinerary",
    desc: "Activities intelligently spread across your trip days — no repetition.",
    accent: "bg-brand-50 border-brand-200 text-brand-600",
  },
  {
    icon: Users,
    title: "Any group size",
    desc: "Solo, couple, friends, or family — with room and traveler planning.",
    accent: "bg-accent-50 border-accent-200 text-accent-600",
  },
  {
    icon: Download,
    title: "Designed PDF",
    desc: "Download a beautiful branded itinerary — ready to share or print.",
    accent: "bg-brand-50 border-brand-200 text-brand-600",
  },
  {
    icon: Sparkles,
    title: "Instant & free",
    desc: "No signup. Fill the wizard, generate, download. Done in minutes.",
    accent: "bg-accent-50 border-accent-200 text-accent-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative">
      <TravelBackground />

      {/* Nav */}
      <nav className="border-b border-neutral-100 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" aria-label="Deyor home">
            <img
              src="/deyor-logo-white.png"
              alt="Deyor"
              className="h-5 brightness-0"
            />
          </Link>
          <Link to="/build">
            <Button size="sm">Build My Trip</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10">
        <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 border border-accent-400/30 text-accent-600 text-xs font-medium mb-6"
          >
            <span>✦</span> Community-led experiential travel
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-semibold tracking-tight text-brand-950 leading-tight"
          >
            Build your perfect trip,
            <br />
            <span className="text-brand-500">step by step.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-neutral-500 leading-relaxed max-w-lg mx-auto"
          >
            Tell us what you love, how you travel, and when you want to go.
            We&apos;ll craft a personalized day-by-day itinerary you can download and share.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex justify-center gap-3"
          >
            <Link to="/build">
              <Button size="lg">
                Start planning
                <span aria-hidden="true" className="ml-1">→</span>
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Feature cards — 3x2 grid */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="group rounded-xl border border-neutral-100 bg-white/70 backdrop-blur-sm p-5 hover:border-brand-200 hover:shadow-sm transition-all duration-300"
              >
                <div className={`h-9 w-9 rounded-lg border flex items-center justify-center mb-3 ${f.accent}`}>
                  <f.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-neutral-900">{f.title}</p>
                <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Destination preview strip */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {["Bali, Indonesia", "Coorg, Karnataka", "Goa", "Manali, Himachal Pradesh", "Jaipur, Rajasthan"].map((name) => (
              <span
                key={name}
                className="px-4 py-2 rounded-full bg-neutral-50 border border-neutral-100 text-sm text-neutral-600 hover:border-brand-200 hover:text-brand-600 transition-colors"
              >
                {name}
              </span>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-neutral-400 text-center">
          Deyor — Community-led experiential travel
        </div>
      </footer>
    </div>
  );
}
