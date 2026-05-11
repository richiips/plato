import QRCode from "qrcode";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://plato.menu"}/r/${slug}`;

  const buffer = await QRCode.toBuffer(url, {
    type: "png",
    width: 512,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qr-${slug}.png"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
