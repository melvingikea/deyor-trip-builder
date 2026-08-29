import type { Interest, Activity, Destination } from "./destinations";

export interface TripInput {
  destinationId: number;
  tripType: "group" | "custom";
  travelStyle: "solo" | "friends" | "couple" | "family";
  travelers: number;
  rooms: number;
  adultsPerRoom: number;
  interests: Interest[];
  durationRange: "3-5" | "5-7" | "7-9" | "10+";
  departureDate: string | null;
  flexible: boolean;
  contactName: string;
  contactPhone: string;
}

export interface DayPlan {
  day: number;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  input: TripInput;
  destination: Destination;
  days: DayPlan[];
  totalNights: number;
  accommodationCost: number;
  activityCostEstimate: number;
  totalCost: number;
  createdAt: string;
}

const ACTIVITY_COST_PER_PERSON: Record<Interest, number> = {
  adventure: 2500,
  leisure: 1000,
  culture: 1500,
  attractions: 800,
};

function durationToNights(range: TripInput["durationRange"]): number {
  const map: Record<string, number> = {
    "3-5": 4,
    "5-7": 6,
    "7-9": 8,
    "10+": 11,
  };
  return map[range] ?? 5;
}

/**
 * Distributes activities across days, matching selected interests.
 * - Filters activities by the traveler's chosen interests
 * - Shuffles and distributes so consecutive days always differ
 * - Uses a "least recently used" approach: tracks how recently each
 *   activity was scheduled and always picks the least-recent ones
 * - First/last days get lighter schedules (1-2 activities)
 * - Assigns 2-3 activities per day when possible
 */
export function generateItinerary(
  input: TripInput,
  destination: Destination
): Itinerary {
  const totalNights = durationToNights(input.durationRange);
  const totalDays = totalNights + 1;

  // Filter activities by selected interests
  const matchingActivities = destination.activities.filter((a) =>
    input.interests.includes(a.interest)
  );

  // Fall back to all activities if none match
  const pool =
    matchingActivities.length > 0 ? matchingActivities : destination.activities;

  // Shuffle pool for initial randomness
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // Target 2-3 activities per day
  const targetPerDay = Math.min(3, Math.max(2, Math.ceil(shuffled.length / totalDays)));

  // Track when each activity was last used (lower = used longer ago)
  const lastUsed = new Map<string, number>();
  for (const a of shuffled) {
    lastUsed.set(a.name, -1);
  }

  const days: DayPlan[] = [];

  for (let day = 1; day <= totalDays; day++) {
    const activitiesForDay = day === 1 || day === totalDays
      ? Math.min(2, targetPerDay) // lighter first/last day
      : targetPerDay;

    // Sort pool by least recently used, then pick top N
    const sorted = [...shuffled].sort((a, b) => {
      const aLast = lastUsed.get(a.name) ?? -1;
      const bLast = lastUsed.get(b.name) ?? -1;
      if (aLast !== bLast) return aLast - bLast;
      // tie-break: randomize
      return Math.random() - 0.5;
    });

    const dayActivities: Activity[] = [];
    for (let i = 0; i < activitiesForDay && i < sorted.length; i++) {
      dayActivities.push(sorted[i]);
      lastUsed.set(sorted[i].name, day);
    }

    days.push({ day, activities: dayActivities });
  }

  // Cost calculations
  const accommodationCost = destination.pricePerNight * totalNights * input.rooms;

  let activityCostEstimate = 0;
  for (const day of days) {
    for (const activity of day.activities) {
      activityCostEstimate +=
        ACTIVITY_COST_PER_PERSON[activity.interest] * input.travelers;
    }
  }

  const totalCost = accommodationCost + activityCostEstimate;

  const id = crypto.randomUUID();

  return {
    id,
    input,
    destination,
    days,
    totalNights,
    accommodationCost,
    activityCostEstimate,
    totalCost,
    createdAt: new Date().toISOString(),
  };
}
