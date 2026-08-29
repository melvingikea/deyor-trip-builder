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
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 0;

      // Deyor brand red
      const R = 232, G = 70, B = 76; // #E8464C

      const checkPage = (needed: number) => {
        if (y + needed > pageHeight - 25) {
          doc.addPage();
          y = 25;
        }
      };

      // Cover section - Deyor red header
      doc.setFillColor(R, G, B);
      doc.rect(0, 0, pageWidth, 80, "F");

      // Deyor logo (white on red)
      try {
        const logoData = "data:image/png;base64,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";
        doc.addImage(logoData, "PNG", margin, 18, 30, 10);
      } catch {
        // fallback: text logo
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("DEYOR", margin, 25);
      }

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(destination.name, margin, 50);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 200, 200);
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
      doc.setTextColor(R, G, B);
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
      doc.setTextColor(R, G, B);
      doc.text("Day-by-Day Itinerary", margin, y);
      y += 10;

      for (const day of days) {
        checkPage(30);

        // Red circle for day number
        doc.setFillColor(R, G, B);
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
          const activityText = `•  ${activity.name}`;
          doc.text(activityText, margin + 10, y);
          const activityWidth = doc.getTextWidth(activityText);

          // Tag with a space before it
          doc.setTextColor(R, G, B);
          doc.setFontSize(8);
          doc.setFont("helvetica", "italic");
          const tagText = activity.interest.charAt(0).toUpperCase() + activity.interest.slice(1);
          doc.text(`  ${tagText}`, margin + 10 + activityWidth, y);
          y += 6;
        }
        y += 4;
      }

      // Cost Summary — clean bordered section
      checkPage(55);
      y += 8;

      // Light border box
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 48, 2, 2, "S");

      // Red accent line at top
      doc.setFillColor(R, G, B);
      doc.rect(margin + 0.15, y + 0.15, contentWidth - 0.3, 1.5, "F");

      y += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(R, G, B);
      doc.text("Cost Estimate", margin + 8, y);
      y += 9;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Accommodation (${totalNights} nights x ${input.rooms} rooms x Rs.${destination.pricePerNight.toLocaleString()})`,
        margin + 8,
        y
      );
      doc.setTextColor(23, 23, 23);
      doc.setFont("helvetica", "bold");
      doc.text(`Rs.${accommodationCost.toLocaleString()}`, margin + contentWidth - 8, y, { align: "right" });
      y += 7;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Activities estimate (${input.travelers} travelers)`, margin + 8, y);
      doc.setTextColor(23, 23, 23);
      doc.setFont("helvetica", "bold");
      doc.text(`Rs.${activityCostEstimate.toLocaleString()}`, margin + contentWidth - 8, y, { align: "right" });
      y += 7;

      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(margin + 8, y, margin + contentWidth - 8, y);
      y += 6;

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(R, G, B);
      doc.text("Total", margin + 8, y);
      doc.text(`Rs.${totalCost.toLocaleString()}`, margin + contentWidth - 8, y, { align: "right" });

      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(R, G, B);
        doc.text("deyor - community-led experiential travel", margin, pageHeight - 10);
        doc.setTextColor(180, 180, 180);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
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
                      <span className="ml-2 text-xs text-brand-400 capitalize italic">
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
