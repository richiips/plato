export type Clasificacion = "TE" | "TE+7" | "TE+14" | "MA+14" | "MA+18";

export type TipoSala = "2D" | "3D" | "IMAX" | "4DX" | "XD";

export type BancoOperador =
  // Bancos y tarjetas
  | "cmr_falabella"
  | "bancoestado"
  | "scotiabank_cencosud"
  | "bci"
  | "itau"
  | "santander"
  | "chile_edwards"
  | "bice"
  | "coopeuch"
  // Operadores móviles
  | "entel"
  | "movistar"
  | "claro"
  | "wom"
  | "virgin_mobile"
  // Cajas de compensación
  | "los_andes"
  | "los_heroes"
  | "la_araucana"
  | "18_septiembre"
  | "gabriela_mistral"
  | "fuerza"
  | "capredena"
  | "dipreca"
  | "ninguno";

export interface Cadena {
  id: string;
  nombre: string;
  logo: string;
  color: string;
  url_base: string;
  url_compra: string;
}

export interface Pelicula {
  id: string;
  titulo: string;
  poster_url: string;
  genero: string[];
  duracion_min: number;
  clasificacion: Clasificacion;
  fecha_estreno: string;
  sinopsis?: string;
  trailer_url?: string;
  cadenas_ids: string[];
}

export interface Funcion {
  id: string;
  pelicula_id: string;
  cadena_id: string;
  fecha: string;
  horario: string;
  sala: TipoSala;
  url_compra: string;
  precio_base: number;
}

export interface Descuento {
  id: string;
  cadena_id: string;
  banco_operador: BancoOperador;
  tipo: "porcentaje" | "precio_fijo" | "2x1";
  valor: number;
  condicion?: string;
  dias_valido?: string[];
  vigente_hasta: string;
}

export interface Actualizacion {
  cadena_id: string;
  fecha_actualizacion: string;
  estado: "ok" | "sin_datos";
}

export interface UserPreferences {
  bancos: BancoOperador[];
  operadores: BancoOperador[];
  cajas: BancoOperador[];
  ciudad: string;
}

export interface PrecioCalculado {
  precio_base: number;
  precio_final: number;
  descuento_aplicado: Descuento | null;
  ahorro: number;
}
