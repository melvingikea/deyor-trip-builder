import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { MapPin, Calendar, Download } from "lucide-react";
import { TravelBackground } from "~/components/travel-bg";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative">
      <TravelBackground />
      {/* Nav */}
      <nav className="border-b border-neutral-100 bg-white/80 backdrop-blur-sm">
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
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 border border-accent-400/30 text-accent-600 text-xs font-medium mb-6">
          <span>✦</span> Community-led experiential travel
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-brand-950 leading-tight">
          Build your perfect trip,
          <br />
          <span className="text-brand-500">step by step.</span>
        </h1>
        <p className="mt-4 text-base text-neutral-500 leading-relaxed max-w-md">
          Tell us what you love, how you travel, and when you want to go.
          We&apos;ll craft a personalized day-by-day itinerary you can download and share.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/build">
            <Button size="lg">
              Start planning
              <span aria-hidden="true">→</span>
            </Button>
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-col gap-6">
          {[
            {
              icon: MapPin,
              title: "Curated destinations",
              desc: "Bali, Goa, Coorg, Manali, Jaipur — handpicked with real activities.",
              color: "bg-brand-50 border-brand-100 text-brand-600",
            },
            {
              icon: Calendar,
              title: "Smart itinerary",
              desc: "Activities matched to your interests, distributed across your trip days.",
              color: "bg-accent-50 border-accent-100 text-accent-600",
            },
            {
              icon: Download,
              title: "Download your plan",
              desc: "Get a designed PDF itinerary — ready to share or print.",
              color: "bg-brand-50 border-brand-100 text-brand-600",
            },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 items-start">
              <div className={`mt-0.5 h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${f.color}`}>
                <f.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{f.title}</p>
                <p className="text-sm text-neutral-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-neutral-400">
          Deyor — Community-led experiential travel
        </div>
      </footer>
    </div>
  );
}
