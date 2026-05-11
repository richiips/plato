const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN!;
const IMAGES_HASH = process.env.CLOUDFLARE_IMAGES_HASH!;

export type ImageVariant = "thumbnail" | "hero" | "public";

export function getImageUrl(imageId: string, variant: ImageVariant = "public") {
  return `https://imagedelivery.net/${IMAGES_HASH}/${imageId}/${variant}`;
}

export async function getUploadUrl() {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    },
  );
  const json = (await res.json()) as { result: { uploadURL: string; id: string } };
  return json.result;
}
