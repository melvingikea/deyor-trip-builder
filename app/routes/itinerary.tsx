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
import { useState, useEffect } from "react";
import Confetti from "react-confetti";

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
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const update = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
      {/* Confetti celebration */}
      {showConfetti && (
        <Confetti
          numberOfPieces={150}
          recycle={false}
          colors={["#e8464c", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#fbbf24"]}
          gravity={0.25}
          confettiSource={{ x: 0, y: 0, w: windowSize.w, h: 0 }}
          initialVelocityX={4}
          initialVelocityY={15}
          tweenDuration={100}
          width={windowSize.w}
          height={windowSize.h}
          onConfettiComplete={() => setShowConfetti(false)}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 50, pointerEvents: "none" }}
        />
      )}
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