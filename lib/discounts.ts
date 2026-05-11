import type { Descuento, UserPreferences, PrecioCalculado, BancoOperador } from "./types";
import { DESCUENTOS } from "./mock-data";

function getBancoOperadorActivos(prefs: UserPreferences): BancoOperador[] {
  return [...prefs.bancos, ...prefs.operadores, ...prefs.cajas];
}

export function calcularPrecio(
  precio_base: number,
  cadena_id: string,
  prefs: UserPreferences,
): PrecioCalculado {
  const activos = getBancoOperadorActivos(prefs);

  const descuentosAplicables = DESCUENTOS.filter(
    (d) => d.cadena_id === cadena_id && activos.includes(d.banco_operador),
  );

  if (descuentosAplicables.length === 0) {
    return { precio_base, precio_final: precio_base, descuento_aplicado: null, ahorro: 0 };
  }

  const mejorDescuento = descuentosAplicables.reduce<Descuento>((mejor, actual) => {
    if (actual.tipo === "precio_fijo") {
      const ahorro_actual = precio_base - actual.valor;
      if (mejor.tipo === "precio_fijo") {
        return precio_base - actual.valor > precio_base - mejor.valor ? actual : mejor;
      }
      return ahorro_actual > (precio_base * mejor.valor) / 100 ? actual : mejor;
    }
    if (actual.tipo === "porcentaje") {
      if (mejor.tipo === "precio_fijo") {
        return (precio_base * actual.valor) / 100 > precio_base - mejor.valor ? actual : mejor;
      }
      return actual.valor > mejor.valor ? actual : mejor;
    }
    return mejor;
  }, descuentosAplicables[0]);

  let precio_final: number;
  let ahorro: number;

  if (mejorDescuento.tipo === "porcentaje") {
    ahorro = Math.round((precio_base * mejorDescuento.valor) / 100);
    precio_final = precio_base - ahorro;
  } else if (mejorDescuento.tipo === "precio_fijo") {
    precio_final = mejorDescuento.valor;
    ahorro = precio_base - precio_final;
  } else {
    precio_final = precio_base;
    ahorro = 0;
  }

  return { precio_base, precio_final, descuento_aplicado: mejorDescuento, ahorro };
}

export function formatPrecio(valor: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(valor);
}

export function getTotalDescuentos(prefs: UserPreferences): number {
  return prefs.bancos.length + prefs.operadores.length + prefs.cajas.length;
}

export const BANCO_LABELS: Record<BancoOperador, string> = {
  // Bancos y tarjetas
  cmr_falabella: "CMR Falabella",
  bancoestado: "BancoEstado",
  scotiabank_cencosud: "Scotiabank / Cencosud",
  bci: "BCI / Mach",
  itau: "Itaú",
  santander: "Santander",
  chile_edwards: "Banco de Chile / Edwards",
  bice: "BICE / Vida",
  coopeuch: "Coopeuch",
  // Operadores
  entel: "Entel",
  movistar: "Movistar",
  claro: "Claro",
  wom: "WOM",
  virgin_mobile: "Virgin Mobile",
  // Cajas
  los_andes: "Los Andes",
  los_heroes: "Los Héroes",
  la_araucana: "La Araucana",
  "18_septiembre": "18 de Septiembre",
  gabriela_mistral: "Gabriela Mistral",
  fuerza: "Fuerza",
  capredena: "CAPREDENA",
  dipreca: "DIPRECA",
  ninguno: "Sin descuento",
};
