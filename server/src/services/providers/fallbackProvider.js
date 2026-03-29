const FALLBACK_JOBS = [
  {
    title: "Warehouse Associate",
    company: "Turku Logistics Group",
    location: "Turku, Finland",
    description:
      "Support warehouse operations, order handling, and shift-based inventory work in a busy logistics environment.",
    applicationLink: "https://jobs.example.com/turku-logistics/warehouse-associate",
  },
  {
    title: "Kitchen Assistant",
    company: "Baltic Kitchen Services",
    location: "Turku, Finland",
    description:
      "Assist with food preparation, kitchen hygiene, dishwashing, and daily service support for a fast-moving kitchen team.",
    applicationLink: "https://jobs.example.com/baltic-kitchen/kitchen-assistant",
  },
  {
    title: "Cleaner",
    company: "Nordic Facility Care",
    location: "Turku, Finland",
    description:
      "Carry out scheduled cleaning tasks, maintain hygiene standards, and support facility upkeep across commercial sites.",
    applicationLink: "https://jobs.example.com/nordic-facility/caretaker-cleaner",
  },
  {
    title: "Warehouse Operative",
    company: "Scandic Fulfillment",
    location: "Turku, Finland",
    description:
      "Handle incoming deliveries, packing, picking, and warehouse floor coordination in a structured team environment.",
    applicationLink: "https://jobs.example.com/scandic-fulfillment/warehouse-operative",
  },
];

export async function fetchFallbackJobs() {
  console.log("Using provider: fallback");
  return FALLBACK_JOBS;
}
