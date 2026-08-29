import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { MapPin, Calendar, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-neutral-900">
            deyor
          </span>
          <Link to="/build">
            <Button size="sm">Build My Trip</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 leading-tight">
          Build your perfect trip,
          <br />
          <span className="text-neutral-400">step by step.</span>
        </h1>
        <p className="mt-4 text-base text-neutral-500 leading-relaxed max-w-md">
          Tell us what you love, how you travel, and when you want to go. 
          We'll craft a personalized day-by-day itinerary you can download and share.
        </p>
        <div className="mt-8">
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
            },
            {
              icon: Calendar,
              title: "Smart itinerary",
              desc: "Activities matched to your interests, distributed across your trip days.",
            },
            {
              icon: Download,
              title: "Download your plan",
              desc: "Get a designed PDF itinerary — ready to share or print.",
            },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 items-start">
              <div className="mt-0.5 h-8 w-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                <f.icon className="h-4 w-4 text-neutral-500" />
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
