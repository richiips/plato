import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

interface TrackPayload {
  restaurant_id: string;
  event_type: string;
  event_data?: Record<string, unknown>;
  session_id?: string;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { restaurant_id, event_type, event_data, session_id } = body as TrackPayload;

  if (!restaurant_id || !event_type) {
    return NextResponse.json({ error: "restaurant_id and event_type are required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("analytics_events").insert({
    restaurant_id,
    event_type,
    event_data: event_data ?? {},
    session_id: session_id ?? null,
  });

  return NextResponse.json({ ok: true });
}
