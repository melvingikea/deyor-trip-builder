import { describe, it, expect } from "vitest";
import { generateItinerary } from "../app/lib/itinerary";
import { validateTripInput } from "../app/lib/validation";
import { destinations, getDestination } from "../app/lib/destinations";
import type { TripInput } from "../app/lib/itinerary";

function makeInput(overrides: Partial<TripInput> = {}): TripInput {
  return {
    destinationId: 1,
    tripType: "group",
    travelStyle: "couple",
    travelers: 2,
    rooms: 1,
    adultsPerRoom: 2,
    interests: ["adventure", "culture"],
    durationRange: "3-5",
    departureDate: "2026-10-15",
    flexible: false,
    contactName: "Test User",
    contactPhone: "+919876543210",
    ...overrides,
  };
}

describe("Itinerary Generation", () => {
  it("respects selected interests — only matching activities appear", () => {
    const input = makeInput({ interests: ["adventure"] });
    const dest = getDestination(1)!; // Bali
    const itinerary = generateItinerary(input, dest);

    for (const day of itinerary.days) {
      for (const activity of day.activities) {
        expect(activity.interest).toBe("adventure");
      }
    }
  });

  it("does not leave any day empty", () => {
    const input = makeInput({ durationRange: "10+", interests: ["culture"] });
    const dest = getDestination(2)!; // Coorg — only 1 culture activity
    const itinerary = generateItinerary(input, dest);

    for (const day of itinerary.days) {
      expect(day.activities.length).toBeGreaterThan(0);
    }
    expect(itinerary.days.length).toBe(12); // 11 nights + 1
  });

  it("calculates cost correctly", () => {
    const input = makeInput({
      durationRange: "3-5",
      travelers: 2,
      rooms: 1,
      interests: ["leisure"],
    });
    const dest = getDestination(1)!; // Bali, 4500/night
    const itinerary = generateItinerary(input, dest);

    // Accommodation: 4 nights * 1 room * 4500 = 18000
    expect(itinerary.totalNights).toBe(4);
    expect(itinerary.accommodationCost).toBe(4500 * 4 * 1);

    // Activity cost: each leisure activity = 1000/person, 2 travelers
    const totalActivities = itinerary.days.reduce((sum, d) => sum + d.activities.length, 0);
    expect(itinerary.activityCostEstimate).toBe(totalActivities * 1000 * 2);

    expect(itinerary.totalCost).toBe(itinerary.accommodationCost + itinerary.activityCostEstimate);
  });

  it("avoids unnecessary repetition when enough activities exist", () => {
    const input = makeInput({
      durationRange: "3-5",
      interests: ["adventure", "leisure", "culture", "attractions"],
    });
    const dest = getDestination(1)!; // Bali — 7 activities
    const itinerary = generateItinerary(input, dest);

    // With 5 days and 7 activities, no activity should appear more than twice
    const counts = new Map<string, number>();
    for (const day of itinerary.days) {
      for (const a of day.activities) {
        counts.set(a.name, (counts.get(a.name) ?? 0) + 1);
      }
    }
    for (const [name, count] of counts) {
      expect(count, `"${name}" repeated ${count} times`).toBeLessThanOrEqual(2);
    }
  });
});

describe("Validation", () => {
  it("rejects missing required fields", () => {
    const { errors, parsed } = validateTripInput({});
    expect(parsed).toBeNull();
    expect(errors.length).toBeGreaterThan(0);
    const fields = errors.map((e) => e.field);
    expect(fields).toContain("destinationId");
    expect(fields).toContain("travelStyle");
    expect(fields).toContain("interests");
    expect(fields).toContain("durationRange");
    expect(fields).toContain("contactName");
    expect(fields).toContain("contactPhone");
  });

  it("accepts valid complete input", () => {
    const { errors, parsed } = validateTripInput({
      destinationId: 1,
      tripType: "group",
      travelStyle: "couple",
      travelers: 2,
      rooms: 1,
      adultsPerRoom: 2,
      interests: ["adventure", "culture"],
      durationRange: "5-7",
      departureDate: "2026-12-01",
      flexible: "false",
      contactName: "Melvin George",
      contactPhone: "+919876543210",
    });
    expect(errors).toHaveLength(0);
    expect(parsed).not.toBeNull();
    expect(parsed!.destinationId).toBe(1);
    expect(parsed!.interests).toEqual(["adventure", "culture"]);
  });
});
