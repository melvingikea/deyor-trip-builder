export type Interest = "adventure" | "leisure" | "culture" | "attractions";

export interface Activity {
  name: string;
  interest: Interest;
}

export interface Destination {
  id: number;
  name: string;
  pricePerNight: number;
  activities: Activity[];
}

export const destinations: Destination[] = [
  {
    id: 1,
    name: "Bali, Indonesia",
    pricePerNight: 4500,
    activities: [
      { name: "Sunrise trek at Mount Batur", interest: "adventure" },
      { name: "White-water rafting, Ayung River", interest: "adventure" },
      { name: "Ubud rice terrace walk", interest: "leisure" },
      { name: "Beach club day, Seminyak", interest: "leisure" },
      { name: "Tanah Lot Temple visit", interest: "culture" },
      { name: "Traditional Balinese cooking class", interest: "culture" },
      { name: "Uluwatu cliff & Kecak dance show", interest: "attractions" },
    ],
  },
  {
    id: 2,
    name: "Coorg, Karnataka",
    pricePerNight: 3500,
    activities: [
      { name: "Trek to Tadiandamol Peak", interest: "adventure" },
      { name: "Coffee plantation walk", interest: "leisure" },
      { name: "Abbey Falls visit", interest: "attractions" },
      { name: "Namdroling Monastery visit", interest: "culture" },
      { name: "River rafting at Barapole", interest: "adventure" },
    ],
  },
  {
    id: 3,
    name: "Goa",
    pricePerNight: 5000,
    activities: [
      { name: "Scuba diving at Grande Island", interest: "adventure" },
      { name: "Sunset cruise on the Mandovi", interest: "leisure" },
      { name: "Old Goa churches walk", interest: "culture" },
      { name: "Fort Aguada visit", interest: "attractions" },
      { name: "Beach hopping — Anjuna to Vagator", interest: "leisure" },
    ],
  },
  {
    id: 4,
    name: "Manali, Himachal Pradesh",
    pricePerNight: 3000,
    activities: [
      { name: "Solang Valley paragliding", interest: "adventure" },
      { name: "Rohtang Pass snow trek", interest: "adventure" },
      { name: "Old Manali café walk", interest: "leisure" },
      { name: "Hot springs at Vashisht", interest: "leisure" },
      { name: "Hadimba Devi Temple visit", interest: "culture" },
      { name: "Great Himalayan National Park trek", interest: "adventure" },
      { name: "Mall Road evening stroll", interest: "attractions" },
    ],
  },
  {
    id: 5,
    name: "Jaipur, Rajasthan",
    pricePerNight: 4000,
    activities: [
      { name: "Hot air balloon ride over Amber Fort", interest: "adventure" },
      { name: "Hawa Mahal photo walk", interest: "attractions" },
      { name: "Block printing workshop", interest: "culture" },
      { name: "Royal cuisine cooking class", interest: "culture" },
      { name: "Nahargarh Fort sunset", interest: "leisure" },
      { name: "Jal Mahal lake visit", interest: "leisure" },
    ],
  },
];

export function getDestination(id: number): Destination | undefined {
  return destinations.find((d) => d.id === id);
}
