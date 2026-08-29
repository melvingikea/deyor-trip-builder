import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("build", "routes/build.tsx"),
  route("itinerary/:id", "routes/itinerary.tsx"),
] satisfies RouteConfig;
