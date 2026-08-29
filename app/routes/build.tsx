import { useState } from "react";
import { Form, redirect, useNavigation, useActionData, Link, useSearchParams } from "react-router";
import type { Route } from "./+types/build";
import { destinations } from "~/lib/destinations";
import { generateItinerary } from "~/lib/itinerary";
import { saveItinerary } from "~/lib/store";
import { validateTripInput } from "~/lib/validation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/cn";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Loader2,
} from "lucide-react";

const STEPS = [
  { label: "Trip Basics" },
  { label: "Travelers" },
  { label: "Interests" },
  { label: "Duration" },
  { label: "Review" },
] as const;

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Build My Trip — Deyor" },
    {
      name: "description",
      content:
        "Create your personalized travel itinerary in 5 easy steps. Choose a destination, pick your interests, and get a day-by-day plan.",
    },
    { name: "robots", content: "index, follow" },
  ];
}

export async function action({ request, context }: Route.ActionArgs) {

  const formData = await request.formData();
  const data: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "interests") {
      if (!data.interests) data.interests = [];
      (data.interests as string[]).push(value as string);
    } else {
      data[key] = value;
    }
  }

  const { errors, parsed } = validateTripInput(data);
  if (errors.length > 0 || !parsed) {
    return { errors };
  }

  const destination = destinations.find((d) => d.id === parsed.destinationId);
  if (!destination) {
    return { errors: [{ field: "destinationId", message: "Destination not found" }] };
  }

  const itinerary = generateItinerary(parsed, destination);
  await saveItinerary(itinerary);
  return redirect(`/itinerary/${itinerary.id}`);
}

export default function BuildPage() {
  const [searchParams] = useSearchParams();
  const preselectedDest = Number(searchParams.get("destination")) || 0;

  const [step, setStep] = useState(0);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Form state
  const [destinationId, setDestinationId] = useState<number>(preselectedDest);
  const [tripType, setTripType] = useState<string>("group");
  const [travelStyle, setTravelStyle] = useState<string>("friends");
  const [travelers, setTravelers] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [adultsPerRoom, setAdultsPerRoom] = useState(2);
  const [interests, setInterests] = useState<string[]>(["leisure", "attractions"]);
  const [durationRange, setDurationRange] = useState<string>("");
  const [departureDate, setDepartureDate] = useState("");
  const [flexible, setFlexible] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Step validation
  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return destinationId > 0 && !!travelStyle;
      case 1:
        return travelers >= 1 && rooms >= 1 && adultsPerRoom >= 1;
      case 2:
        return interests.length > 0;
      case 3:
        return !!durationRange && (flexible || !!departureDate);
      case 4:
        return contactName.length >= 2 && contactPhone.length >= 10;
      default:
        return false;
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
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
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 pt-10 pb-20">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-lg font-semibold text-brand-950">{STEPS[step].label}</h2>
            <span className="text-xs text-neutral-400">{step + 1} / 5</span>
          </div>
          <div className="h-1 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
              style={{ width: `${25 + step * 18.75}%` }}
            />
          </div>
        </div>

        <Form method="post">
          {/* Hidden fields to persist state across steps */}
          <input type="hidden" name="destinationId" value={destinationId} />
          <input type="hidden" name="tripType" value={tripType} />
          <input type="hidden" name="travelStyle" value={travelStyle} />
          <input type="hidden" name="travelers" value={travelers} />
          <input type="hidden" name="rooms" value={rooms} />
          <input type="hidden" name="adultsPerRoom" value={adultsPerRoom} />
          {interests.map((i) => (
            <input key={i} type="hidden" name="interests" value={i} />
          ))}
          <input type="hidden" name="durationRange" value={durationRange} />
          <input type="hidden" name="departureDate" value={departureDate} />
          <input type="hidden" name="flexible" value={String(flexible)} />
          <input type="hidden" name="contactName" value={contactName} />
          <input type="hidden" name="contactPhone" value={contactPhone} />

          {/* Step 1: Trip Basics */}
          {step === 0 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  Where do you want to go?
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Pick a destination and tell us how you like to travel.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Destination</Label>
                <div className="grid gap-2">
                  {destinations.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDestinationId(d.id)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-lg border text-left text-sm transition-all cursor-pointer",
                        destinationId === d.id
                          ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                          : "border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-neutral-400" />
                        <span className="font-medium text-neutral-900">{d.name}</span>
                      </div>
                      <span className="text-neutral-400">₹{d.pricePerNight.toLocaleString()}/night</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Trip Type</Label>
                <div className="flex gap-2">
                  {["group", "custom"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTripType(t)}
                      className={cn(
                        "flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium capitalize transition-all cursor-pointer",
                        tripType === t
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Travel Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["solo", "friends", "couple", "family"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTravelStyle(s)}
                      className={cn(
                        "px-4 py-2.5 rounded-lg border text-sm font-medium capitalize transition-all cursor-pointer",
                        travelStyle === s
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Travelers & Rooms */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  Who's coming along?
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Tell us about your group and room preferences.
                </p>
              </div>

              {[
                {
                  label: "Number of travelers",
                  value: travelers,
                  set: setTravelers,
                  min: 1,
                  max: 20,
                },
                {
                  label: "Rooms needed",
                  value: rooms,
                  set: setRooms,
                  min: 1,
                  max: 10,
                },
                {
                  label: "Adults per room",
                  value: adultsPerRoom,
                  set: setAdultsPerRoom,
                  min: 1,
                  max: 4,
                },
              ].map(({ label, value, set, min, max }) => (
                <div key={label} className="space-y-2">
                  <Label>{label}</Label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => set(Math.max(min, value - 1))}
                      className="h-10 w-10 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-lg font-semibold text-neutral-900">
                      {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => set(Math.min(max, value + 1))}
                      className="h-10 w-10 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  What are you into?
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Select the experiences you'd enjoy. We'll tailor your itinerary around these.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "adventure", label: "Adventure", emoji: "🧗" },
                  { value: "leisure", label: "Leisure", emoji: "🌴" },
                  { value: "culture", label: "Culture", emoji: "🏛️" },
                  { value: "attractions", label: "Attractions", emoji: "📸" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => toggleInterest(item.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 px-4 py-6 rounded-xl border text-sm font-medium transition-all cursor-pointer",
                      interests.includes(item.value)
                        ? "border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600"
                        : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                    )}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Duration & Dates */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  When and how long?
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Choose your trip length and preferred dates.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Trip Duration</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "3-5", label: "3–5 days" },
                    { value: "5-7", label: "5–7 days" },
                    { value: "7-9", label: "7–9 days" },
                    { value: "10+", label: "10+ days" },
                  ].map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDurationRange(d.value)}
                      className={cn(
                        "px-4 py-3 rounded-lg border text-sm font-medium transition-all cursor-pointer",
                        durationRange === d.value
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Departure Date</Label>
                <div className="space-y-3">
                  <Input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    disabled={flexible}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flexible}
                      onChange={(e) => {
                        setFlexible(e.target.checked);
                        if (e.target.checked) setDepartureDate("");
                      }}
                      className="h-4 w-4 rounded border-neutral-300 accent-brand-600"
                    />
                    I'm flexible with dates
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Contact */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  Review & generate
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Confirm your selections, then we'll build your itinerary.
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-neutral-200 divide-y divide-neutral-100">
                {[
                  {
                    label: "Destination",
                    value: destinations.find((d) => d.id === destinationId)?.name ?? "—",
                  },
                  { label: "Trip Type", value: tripType },
                  { label: "Travel Style", value: travelStyle },
                  { label: "Travelers", value: `${travelers} travelers, ${rooms} room(s)` },
                  {
                    label: "Interests",
                    value: interests.map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(", "),
                  },
                  {
                    label: "Duration",
                    value: `${durationRange} days`,
                  },
                  {
                    label: "Departure",
                    value: flexible ? "Flexible" : departureDate,
                  },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-neutral-500">{row.label}</span>
                    <span className="font-medium text-neutral-900 capitalize">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-neutral-700">Contact details</p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactName">Full name</Label>
                    <Input
                      id="contactName"
                      name="name"
                      autoComplete="name"
                      placeholder="John Doe"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contactPhone">Phone number</Label>
                    <Input
                      id="contactPhone"
                      name="tel"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Server errors */}
              {actionData && "errors" in actionData && actionData.errors.length > 0 && (
                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  <ul className="list-disc pl-4 space-y-1">
                    {actionData.errors.map((e: { field: string; message: string }) => (
                      <li key={e.field}>{e.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-neutral-100">
            {step > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <Link to="/">
                <Button type="button" variant="ghost">
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Button>
              </Link>
            )}

            {step < 4 ? (
              <Button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={!canProceed() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    Generate Itinerary
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Form>
      </div>

    </div>
  );
}
