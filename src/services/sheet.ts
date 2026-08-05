import Papa from "papaparse"

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vR4Jf6eOcGsbnRYIPVP60JVWDp1KkqZMGdcj3t8ABR9hdaFY9t3bLcvqgVjTVWVtz9GFUDtWADB_iLx/pub?output=csv"

// The published sheet's real column headers are in Spanish. This map is the only
// place that needs to know that -- everything downstream (services/experiences.ts,
// data/categories.ts, ExperienceModal...) keeps reading the English keys it always has.
const HEADER_MAP: Record<string, string> = {
  nombre_experiencia: "title",
  categoria: "category",
  ciudad: "city",
  zona: "zone",
  duracion_min: "duration",
  imagen: "image",
  descripcion_corta: "shortDescription",
  ideal_para: "idealFor",
  nivel_esfuerzo: "effortLevel",
  ambiente_animo: "ambiance",
  entorno: "environment",
  ritmo: "engagement",
  nota_vivabox: "vivanote",
  imagenes_adicionales: "imagenesAdicionales",
}

function translateRow(row: Record<string, string>) {
  const translated: Record<string, string> = {}
  for (const [key, value] of Object.entries(row)) {
    translated[HEADER_MAP[key] || key] = value
  }
  return translated
}

export async function getSheetData() {

  const res = await fetch(SHEET_URL, {
    next: { revalidate: 3600 } // refresh every hour
  })

  const csv = await res.text()

  const { data } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true
  })

  // Only rows marked "publicado" in the sheet's estado column should ever reach
  // the site -- drafts and experiences still being validated stay invisible.
  return (data as Record<string, string>[])
    .filter((row) => row.estado === "publicado")
    .map(translateRow)
}