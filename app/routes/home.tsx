import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { TravelBackground } from "~/components/travel-bg";
import { motion } from "framer-motion";
import { destinations } from "~/lib/destinations";

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

const destinationVibes: Record<string, { image: string; tagline: string; highlights: string[] }> = {
  "Bali, Indonesia": {
    image: "/dest-bali.jpg",
    tagline: "Temples, rice terraces & beach clubs",
    highlights: ["Sunrise trek at Mount Batur", "Ubud rice terrace walk", "Tanah Lot Temple visit"],
  },
  "Coorg, Karnataka": {
    image: "/dest-coorg.jpg",
    tagline: "Coffee hills & misty waterfalls",
    highlights: ["Trek to Tadiandamol Peak", "Coffee plantation walk", "Abbey Falls visit"],
  },
  "Goa": {
    image: "/dest-goa.jpg",
    tagline: "Sun, sand & Old World charm",
    highlights: ["Scuba diving at Grande Island", "Sunset cruise on the Mandovi", "Old Goa churches walk"],
  },
  "Manali, Himachal Pradesh": {
    image: "/dest-manali.jpg",
    tagline: "Snow peaks & valley adventures",
    highlights: ["Solang Valley paragliding", "Old Manali café walk", "Hadimba Temple visit"],
  },
  "Jaipur, Rajasthan": {
    image: "/dest-jaipur.jpg",
    tagline: "Royal forts & vibrant bazaars",
    highlights: ["Amber Fort elephant ride", "Hawa Mahal walk", "Johari Bazaar shopping"],
  },
};

const experiences = [
  { emoji: "🧗", label: "Adventure", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { emoji: "🌴", label: "Leisure", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { emoji: "🏛️", label: "Culture", color: "bg-violet-50 text-violet-700 border-violet-200" },
  { emoji: "📸", label: "Attractions", color: "bg-sky-50 text-sky-700 border-sky-200" },
];

const steps = [
  { num: "01", text: "Pick your dream destination" },
  { num: "02", text: "Tell us your travel style & interests" },
  { num: "03", text: "Choose your dates & group size" },
  { num: "04", text: "Get a personalized day-by-day itinerary" },
  { num: "05", text: "Download a beautiful PDF to share" },
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

        {/* Destinations — the heart of a travel site */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm font-medium text-neutral-400 uppercase tracking-widest mb-8"
          >
            Explore our destinations
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((dest, i) => {
              const vibe = destinationVibes[dest.name];
              return (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" as const }}
                >
                  <Link
                    to={`/build?destination=${dest.id}`}
                    className="group block rounded-2xl border border-neutral-100 bg-white overflow-hidden hover:shadow-md hover:border-brand-200 transition-all duration-300"
                  >
                    {/* Destination photo */}
                    <div className="h-40 relative overflow-hidden">
                      <img
                        src={vibe?.image ?? "/dest-bali.jpg"}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-2 right-3 text-xs text-white/80 font-medium">
                        from ₹{dest.pricePerNight.toLocaleString()}/night
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 group-hover:text-brand-600 transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        {vibe?.tagline ?? "Discover unique experiences"}
                      </p>

                      {/* Sample activities */}
                      {vibe && (
                        <div className="mt-3 flex flex-col gap-1.5">
                          {vibe.highlights.map((h) => (
                            <span key={h} className="text-xs text-neutral-400 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-brand-300 shrink-0" />
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Experience types */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm font-medium text-neutral-400 uppercase tracking-widest mb-6"
          >
            Travel your way
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {experiences.map((e) => (
              <span
                key={e.label}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium ${e.color}`}
              >
                <span className="text-lg">{e.emoji}</span>
                {e.label}
              </span>
            ))}
          </motion.div>
        </section>

        {/* How it works — simple travel flow, not SaaS features */}
        <section className="max-w-2xl mx-auto px-6 pb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm font-medium text-neutral-400 uppercase tracking-widest mb-8"
          >
            How it works
          </motion.h2>

          <div className="space-y-0">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-4 py-3 group"
              >
                <span className="text-brand-300 font-mono text-xs w-6 shrink-0">{s.num}</span>
                <div className="h-px flex-1 bg-neutral-100 group-hover:bg-brand-200 transition-colors" />
                <span className="text-sm text-neutral-600">{s.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link to="/build">
              <Button size="lg">
                Start planning
                <span aria-hidden="true" className="ml-1">→</span>
              </Button>
            </Link>
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
