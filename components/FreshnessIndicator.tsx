import { ACTUALIZACIONES } from "@/lib/mock-data";

interface FreshnessIndicatorProps {
  cadenaId: string;
  className?: string;
}

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function formatFecha(isoString: string): string {
  const d = new Date(isoString);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

export default function FreshnessIndicator({ cadenaId, className = "" }: FreshnessIndicatorProps) {
  const act = ACTUALIZACIONES.find((a) => a.cadena_id === cadenaId);

  if (!act) {
    return (
      <span className={`flex items-center gap-1 text-xs text-amber-400 ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Sin datos de actualización
      </span>
    );
  }

  if (act.estado === "sin_datos") {
    return (
      <span className={`flex items-center gap-1 text-xs text-red-400 ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        No disponible esta semana
      </span>
    );
  }

  return (
    <span className={`flex items-center gap-1 text-xs text-zinc-400 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Actualizado el {formatFecha(act.fecha_actualizacion)}
    </span>
  );
}
