// Metadata a route can attach via its `handle` field.
export type RouteHandle = {
  heading?: string;
};

// useMatches() types `handle` as unknown, so check it instead of casting.
export function getRouteHeading(handle: unknown): string | undefined {
  if (
    typeof handle === "object" &&
    handle !== null &&
    "heading" in handle &&
    typeof handle.heading === "string"
  ) {
    return handle.heading;
  }
  return undefined;
}