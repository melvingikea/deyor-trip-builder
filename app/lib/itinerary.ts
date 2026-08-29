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
 * - Spreads them evenly across days with no unnecessary repetition
 * - If there are fewer matching activities than days, cycles through them
 *   but ensures no day is empty
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

  // Fall back to all activities if none match (shouldn't happen with validation)
  const pool =
    matchingActivities.length > 0 ? matchingActivities : destination.activities;

  // Target 2-3 activities per day
  const targetPerDay = Math.min(3, Math.max(2, Math.ceil(pool.length / totalDays)));

  // Distribute activities across days using round-robin
  // Shuffle the pool first for variety
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  const days: DayPlan[] = [];
  let activityIndex = 0;

  for (let day = 1; day <= totalDays; day++) {
    const dayActivities: Activity[] = [];
    const activitiesForDay = day === 1 || day === totalDays
      ? Math.min(2, targetPerDay) // lighter first/last day
      : targetPerDay;

    for (let i = 0; i < activitiesForDay; i++) {
      dayActivities.push(shuffled[activityIndex % shuffled.length]);
      activityIndex++;
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
