import type { Clasificacion } from "@/lib/types";

const COLORS: Record<Clasificacion, string> = {
  TE: "bg-green-600 text-white",
  "TE+7": "bg-lime-600 text-white",
  "TE+14": "bg-yellow-600 text-white",
  "MA+14": "bg-orange-600 text-white",
  "MA+18": "bg-red-700 text-white",
};

export default function ClasificacionBadge({ value }: { value: Clasificacion }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${COLORS[value]}`}
    >
      {value}
    </span>
  );
}
