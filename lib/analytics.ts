export async function trackEvent(
  restaurantId: string,
  eventType: string,
  eventData: Record<string, unknown> = {},
) {
  await fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ restaurantId, eventType, eventData }),
  });
}
