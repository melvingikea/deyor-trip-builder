import { Link } from "react-router";
import type { Route } from "./+types/itinerary";
import { getItinerary } from "~/lib/store";
import { Button } from "~/components/ui/button";
import {
  Download,
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { useState } from "react";

export async function loader({ params, context }: Route.LoaderArgs) {
  const itinerary = await getItinerary(params.id);
  if (!itinerary) {
    throw new Response("Itinerary not found", { status: 404 });
  }
  return { itinerary };
}

export function meta({ matches }: Route.MetaArgs) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const match = matches.find((m) => m && m.id === "routes/itinerary");
  const dest = (match as Record<string, any>)?.loaderData?.itinerary?.destination?.name ?? "Your Trip";
  return [
    { title: `${dest} Itinerary — Deyor` },
    {
      name: "description",
      content: `Your personalized day-by-day itinerary for ${dest}. View activities, cost breakdown, and download as PDF.`,
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

const interestEmoji: Record<string, string> = {
  adventure: "🧗",
  leisure: "🌴",
  culture: "🏛️",
  attractions: "📸",
};

export default function ItineraryPage({ loaderData }: Route.ComponentProps) {
  const { itinerary } = loaderData;
  const { destination, days, input, totalNights, accommodationCost, activityCostEstimate, totalCost } = itinerary;
  const [generating, setGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 0;

      const checkPage = (needed: number) => {
        if (y + needed > 270) {
          doc.addPage();
          y = 25;
        }
      };

      // Cover section - dark header
      doc.setFillColor(23, 23, 23);
      doc.rect(0, 0, pageWidth, 80, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("deyor", margin, 25);

      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(destination.name, margin, 50);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(180, 180, 180);
      doc.text(
        `${totalNights}-night ${input.travelStyle} trip  |  ${input.travelers} travelers`,
        margin,
        62
      );

      doc.setFontSize(9);
      doc.text(`Prepared for ${input.contactName}  |  ${input.contactPhone}`, margin, 72);

      y = 95;
      doc.setTextColor(23, 23, 23);

      // Trip Summary
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Trip Overview", margin, y);
      y += 8;

      const summaryItems = [
        ["Destination", destination.name],
        ["Trip Type", input.tripType.charAt(0).toUpperCase() + input.tripType.slice(1)],
        ["Travel Style", input.travelStyle.charAt(0).toUpperCase() + input.travelStyle.slice(1)],
        ["Duration", `${totalNights} nights / ${totalNights + 1} days`],
        ["Travelers", `${input.travelers} travelers, ${input.rooms} room(s)`],
        ["Departure", input.flexible ? "Flexible dates" : (input.departureDate ?? "—")],
        ["Interests", input.interests.map((i: string) => i.charAt(0).toUpperCase() + i.slice(1)).join(", ")],
      ];

      for (const [label, value] of summaryItems) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(23, 23, 23);
        doc.text(`${label}:`, margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(String(value), margin + 35, y);
        y += 6;
      }

      y += 10;

      // Day-by-day
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(23, 23, 23);
      doc.text("Day-by-Day Itinerary", margin, y);
      y += 10;

      for (const day of days) {
        checkPage(30);

        doc.setFillColor(23, 23, 23);
        doc.circle(margin + 3, y - 1.5, 3.5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(String(day.day), margin + 3, y, { align: "center" });

        doc.setTextColor(23, 23, 23);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`Day ${day.day}`, margin + 10, y);
        y += 7;

        for (const activity of day.activities) {
          checkPage(10);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          const bulletText = `•  ${activity.name}`;
          doc.text(bulletText, margin + 10, y);
          doc.setTextColor(160, 160, 160);
          doc.setFontSize(8);
          const tagText = activity.interest.charAt(0).toUpperCase() + activity.interest.slice(1);
          doc.text(tagText, margin + 10 + doc.getTextWidth(bulletText) + 3, y);
          y += 6;
        }
        y += 4;
      }

      // Cost Summary box
      checkPage(50);
      y += 5;
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(margin, y, contentWidth, 40, 3, 3, "F");
      doc.setDrawColor(230, 230, 230);
      doc.roundedRect(margin, y, contentWidth, 40, 3, 3, "S");

      y += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(23, 23, 23);
      doc.text("Cost Estimate", margin + 6, y);
      y += 8;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Accommodation (${totalNights} nights x ${input.rooms} rooms x Rs.${destination.pricePerNight.toLocaleString()})`,
        margin + 6,
        y
      );
      doc.setTextColor(23, 23, 23);
      doc.setFont("helvetica", "bold");
      doc.text(`Rs.${accommodationCost.toLocaleString()}`, margin + contentWidth - 6, y, { align: "right" });
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Activities estimate (${input.travelers} travelers)`, margin + 6, y);
      doc.setTextColor(23, 23, 23);
      doc.setFont("helvetica", "bold");
      doc.text(`Rs.${activityCostEstimate.toLocaleString()}`, margin + contentWidth - 6, y, { align: "right" });
      y += 8;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin + 6, y - 2, margin + contentWidth - 6, y - 2);
      doc.setFontSize(11);
      doc.text("Total", margin + 6, y + 3);
      doc.text(`Rs.${totalCost.toLocaleString()}`, margin + contentWidth - 6, y + 3, { align: "right" });

      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(180, 180, 180);
        doc.text("deyor — community-led experiential travel", margin, doc.internal.pageSize.getHeight() - 10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: "right" });
      }

      doc.save(`deyor-${destination.name.replace(/[^a-zA-Z0-9]/g, "-")}-itinerary.pdf`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" aria-label="Deyor home">
            <img
              src="/deyor-logo-white.png"
              alt="Deyor"
              className="h-5 brightness-0"
            />
          </Link>
          <Button size="sm" onClick={handleDownloadPDF} disabled={generating}>
            {generating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
            ) : (
              <><Download className="h-4 w-4" /> Download PDF</>
            )}
          </Button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-10 pb-20">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/build"
            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Build another trip
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            {destination.name}
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Your personalized {totalNights}-night itinerary
          </p>
        </div>

        {/* Trip overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Calendar, label: `${totalNights} nights` },
            { icon: Users, label: `${input.travelers} travelers` },
            { icon: MapPin, label: input.travelStyle },
            { icon: IndianRupee, label: `₹${totalCost.toLocaleString()}` },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-brand-100 bg-brand-50 text-sm"
            >
              <item.icon className="h-4 w-4 text-brand-500" />
              <span className="text-neutral-700 capitalize">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Day-by-day */}
        <div className="space-y-1">
          {days.map((day: { day: number; activities: { name: string; interest: string }[] }) => (
            <div
              key={day.day}
              className="border border-neutral-100 rounded-xl px-5 py-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="h-7 w-7 rounded-full bg-brand-600 text-white text-xs font-medium flex items-center justify-center">
                  {day.day}
                </span>
                <span className="text-sm font-semibold text-neutral-900">
                  Day {day.day}
                </span>
              </div>
              <div className="space-y-2 ml-10">
                {day.activities.map((activity: { name: string; interest: string }, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5">{interestEmoji[activity.interest] ?? "•"}</span>
                    <div>
                      <span className="text-neutral-700">{activity.name}</span>
                      <span className="ml-2 text-xs text-neutral-400 capitalize">
                        {activity.interest}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cost breakdown */}
        <div className="mt-10 rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200">
            <h3 className="text-sm font-semibold text-neutral-900">
              Cost Estimate
            </h3>
          </div>
          <div className="divide-y divide-neutral-100">
            <div className="flex justify-between px-5 py-3 text-sm">
              <span className="text-neutral-500">
                Accommodation ({totalNights} nights × {input.rooms} room(s) × ₹{destination.pricePerNight.toLocaleString()})
              </span>
              <span className="font-medium text-neutral-900">
                ₹{accommodationCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between px-5 py-3 text-sm">
              <span className="text-neutral-500">
                Activities estimate ({input.travelers} travelers)
              </span>
              <span className="font-medium text-neutral-900">
                ₹{activityCostEstimate.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between px-5 py-3 text-sm bg-brand-50">
              <span className="font-semibold text-brand-900">Total</span>
              <span className="font-semibold text-brand-700">
                ₹{totalCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-8 text-sm text-neutral-400">
          Prepared for {input.contactName} · {input.contactPhone}
        </div>
      </div>
    </div>
  );
}
