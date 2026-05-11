import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";

export async function POST() {
  try {
    await requireSuperAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return NextResponse.json({ error: "Cloudflare not configured" }, { status: 503 });
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requireSignedURLs: false }),
    },
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Cloudflare API error" }, { status: 502 });
  }

  const json = await res.json();
  const { id, uploadURL } = json.result as { id: string; uploadURL: string };
  const accountHash = process.env.CLOUDFLARE_ACCOUNT_HASH ?? accountId;
  const deliveryUrl = `https://imagedelivery.net/${accountHash}/${id}/public`;

  return NextResponse.json({ uploadURL, deliveryUrl });
}
