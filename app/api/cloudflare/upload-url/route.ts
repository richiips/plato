import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  const missing = [
    !accountId && "R2_ACCOUNT_ID",
    !accessKeyId && "R2_ACCESS_KEY_ID",
    !secretAccessKey && "R2_SECRET_ACCESS_KEY",
    !bucketName && "R2_BUCKET_NAME",
    !publicUrl && "R2_PUBLIC_URL",
  ].filter(Boolean);

  if (missing.length > 0) {
    console.error("[cloudflare/upload-url] Missing env vars:", missing.join(", "));
    return NextResponse.json(
      { error: `R2 not configured: missing ${missing.join(", ")}` },
      { status: 503 },
    );
  }

  let filename = "image";
  let contentType = "image/jpeg";

  try {
    const body = await req.json();
    if (typeof body.filename === "string" && body.filename.length > 0) {
      filename = body.filename;
    }
    if (typeof body.contentType === "string" && body.contentType.length > 0) {
      contentType = body.contentType;
    }
  } catch {
    // body is optional — defaults above are used
  }

  const uuid = crypto.randomUUID();
  const key = `uploads/${uuid}/${filename}`;

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId!}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });

  const command = new PutObjectCommand({
    Bucket: bucketName!,
    Key: key,
    ContentType: contentType,
  });

  const uploadURL = await getSignedUrl(client, command, { expiresIn: 300 });
  const deliveryUrl = `${publicUrl!.replace(/\/$/, "")}/${key}`;

  return NextResponse.json({ uploadURL, deliveryUrl });
}
