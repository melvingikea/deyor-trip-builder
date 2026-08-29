import type { TripInput } from "./itinerary";
import type { Interest } from "./destinations";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateTripInput(data: Record<string, unknown>): {
  errors: ValidationError[];
  parsed: TripInput | null;
} {
  const errors: ValidationError[] = [];

  const destinationId = Number(data.destinationId);
  if (!destinationId || destinationId < 1) {
    errors.push({ field: "destinationId", message: "Please select a destination" });
  }

  const tripType = data.tripType as string;
  if (!["group", "custom"].includes(tripType)) {
    errors.push({ field: "tripType", message: "Please select a trip type" });
  }

  const travelStyle = data.travelStyle as string;
  if (!["solo", "friends", "couple", "family"].includes(travelStyle)) {
    errors.push({ field: "travelStyle", message: "Please select a travel style" });
  }

  const travelers = Number(data.travelers);
  if (!travelers || travelers < 1 || travelers > 20) {
    errors.push({ field: "travelers", message: "Travelers must be between 1 and 20" });
  }

  const rooms = Number(data.rooms);
  if (!rooms || rooms < 1 || rooms > 10) {
    errors.push({ field: "rooms", message: "Rooms must be between 1 and 10" });
  }

  const adultsPerRoom = Number(data.adultsPerRoom);
  if (!adultsPerRoom || adultsPerRoom < 1 || adultsPerRoom > 4) {
    errors.push({ field: "adultsPerRoom", message: "Adults per room must be between 1 and 4" });
  }

  const rawInterests = data.interests;
  let interests: Interest[] = [];
  if (typeof rawInterests === "string") {
    interests = rawInterests.split(",").filter(Boolean) as Interest[];
  } else if (Array.isArray(rawInterests)) {
    interests = rawInterests as Interest[];
  }
  const validInterests: Interest[] = ["adventure", "leisure", "culture", "attractions"];
  interests = interests.filter((i) => validInterests.includes(i));
  if (interests.length === 0) {
    errors.push({ field: "interests", message: "Please select at least one interest" });
  }

  const durationRange = data.durationRange as string;
  if (!["3-5", "5-7", "7-9", "10+"].includes(durationRange)) {
    errors.push({ field: "durationRange", message: "Please select a trip duration" });
  }

  const flexible = data.flexible === "true" || data.flexible === true;
  const departureDate = flexible ? null : (data.departureDate as string) || null;
  if (!flexible && !departureDate) {
    errors.push({ field: "departureDate", message: "Please select a departure date or mark as flexible" });
  }

  const contactName = (data.contactName as string || "").trim();
  if (!contactName || contactName.length < 2) {
    errors.push({ field: "contactName", message: "Please enter your name" });
  }

  const contactPhone = (data.contactPhone as string || "").trim();
  if (!contactPhone || contactPhone.length < 10) {
    errors.push({ field: "contactPhone", message: "Please enter a valid phone number" });
  }

  if (errors.length > 0) {
    return { errors, parsed: null };
  }

  return {
    errors: [],
    parsed: {
      destinationId,
      tripType: tripType as TripInput["tripType"],
      travelStyle: travelStyle as TripInput["travelStyle"],
      travelers,
      rooms,
      adultsPerRoom,
      interests,
      durationRange: durationRange as TripInput["durationRange"],
      departureDate,
      flexible,
      contactName,
      contactPhone,
    },
  };
}
