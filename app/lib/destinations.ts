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
      { name: "ATV ride through rice paddies", interest: "adventure" },
      { name: "Ubud rice terrace walk", interest: "leisure" },
      { name: "Beach club day, Seminyak", interest: "leisure" },
      { name: "Spa & wellness retreat, Ubud", interest: "leisure" },
      { name: "Sunset yoga at Canggu beach", interest: "leisure" },
      { name: "Tanah Lot Temple visit", interest: "culture" },
      { name: "Traditional Balinese cooking class", interest: "culture" },
      { name: "Batik making workshop", interest: "culture" },
      { name: "Uluwatu cliff & Kecak dance show", interest: "attractions" },
      { name: "Tegallalang Rice Terrace viewpoint", interest: "attractions" },
      { name: "Sacred Monkey Forest, Ubud", interest: "attractions" },
    ],
  },
  {
    id: 2,
    name: "Coorg, Karnataka",
    pricePerNight: 3500,
    activities: [
      { name: "Trek to Tadiandamol Peak", interest: "adventure" },
      { name: "River rafting at Barapole", interest: "adventure" },
      { name: "Zip-lining at Madikeri", interest: "adventure" },
      { name: "Coffee plantation walk", interest: "leisure" },
      { name: "Dubare elephant camp visit", interest: "leisure" },
      { name: "Homestay cooking with Kodava family", interest: "leisure" },
      { name: "Namdroling Monastery visit", interest: "culture" },
      { name: "Raja's Seat sunset viewing", interest: "culture" },
      { name: "Kodava heritage museum tour", interest: "culture" },
      { name: "Abbey Falls visit", interest: "attractions" },
      { name: "Iruppu Falls trek", interest: "attractions" },
      { name: "Mandalpatti Peak jeep ride", interest: "attractions" },
    ],
  },
  {
    id: 3,
    name: "Goa",
    pricePerNight: 5000,
    activities: [
      { name: "Scuba diving at Grande Island", interest: "adventure" },
      { name: "Kayaking through mangroves", interest: "adventure" },
      { name: "Jet skiing at Baga Beach", interest: "adventure" },
      { name: "Sunset cruise on the Mandovi", interest: "leisure" },
      { name: "Beach hopping — Anjuna to Vagator", interest: "leisure" },
      { name: "Spa day at a heritage resort", interest: "leisure" },
      { name: "Dudhsagar Falls day trip", interest: "leisure" },
      { name: "Old Goa churches walk", interest: "culture" },
      { name: "Fontainhas Latin Quarter walk", interest: "culture" },
      { name: "Spice plantation tour", interest: "culture" },
      { name: "Fort Aguada visit", interest: "attractions" },
      { name: "Chapora Fort viewpoint", interest: "attractions" },
      { name: "Saturday Night Market, Arpora", interest: "attractions" },
    ],
  },
  {
    id: 4,
    name: "Manali, Himachal Pradesh",
    pricePerNight: 3000,
    activities: [
      { name: "Solang Valley paragliding", interest: "adventure" },
      { name: "Rohtang Pass snow trek", interest: "adventure" },
      { name: "Great Himalayan National Park trek", interest: "adventure" },
      { name: "River crossing & rappelling, Beas", interest: "adventure" },
      { name: "Old Manali cafe walk", interest: "leisure" },
      { name: "Hot springs at Vashisht", interest: "leisure" },
      { name: "Picnic by Beas River", interest: "leisure" },
      { name: "Naggar Castle art gallery visit", interest: "leisure" },
      { name: "Hadimba Devi Temple visit", interest: "culture" },
      { name: "Tibetan monastery visit", interest: "culture" },
      { name: "Kullu shawl weaving demo", interest: "culture" },
      { name: "Mall Road evening stroll", interest: "attractions" },
      { name: "Jogini Waterfall hike", interest: "attractions" },
      { name: "Nehru Kund spring visit", interest: "attractions" },
    ],
  },
  {
    id: 5,
    name: "Jaipur, Rajasthan",
    pricePerNight: 4000,
    activities: [
      { name: "Hot air balloon ride over Amber Fort", interest: "adventure" },
      { name: "Camel safari at Nahargarh", interest: "adventure" },
      { name: "Zip-lining at Neemrana Fort", interest: "adventure" },
      { name: "Nahargarh Fort sunset", interest: "leisure" },
      { name: "Jal Mahal lake visit", interest: "leisure" },
      { name: "Heritage hotel high tea", interest: "leisure" },
      { name: "Sisodia Rani Garden stroll", interest: "leisure" },
      { name: "Block printing workshop", interest: "culture" },
      { name: "Royal cuisine cooking class", interest: "culture" },
      { name: "City Palace museum tour", interest: "culture" },
      { name: "Hawa Mahal photo walk", interest: "attractions" },
      { name: "Jantar Mantar astronomy tour", interest: "attractions" },
      { name: "Johari Bazaar gems & jewelry walk", interest: "attractions" },
    ],
  },
];

export function getDestination(id: number): Destination | undefined {
  return destinations.find((d) => d.id === id);
}
