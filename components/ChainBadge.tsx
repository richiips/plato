import { CADENAS } from "@/lib/mock-data";

interface ChainBadgeProps {
  cadenaId: string;
  size?: "sm" | "md";
}

export default function ChainBadge({ cadenaId, size = "sm" }: ChainBadgeProps) {
  const cadena = CADENAS.find((c) => c.id === cadenaId);
  if (!cadena) return null;

  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span
      className={`inline-flex items-center rounded font-semibold tracking-wide uppercase ${sizeClasses}`}
      style={{
        backgroundColor: cadena.color + "22",
        color: cadena.color,
        border: `1px solid ${cadena.color}44`,
      }}
    >
      {cadena.nombre}
    </span>
  );
}
