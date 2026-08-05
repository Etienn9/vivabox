import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { getSheetData } from "./sheet"
import type { Experience } from "@/types/experience"

const categoryMap: Record<string,string> = {
  gastro: "gastronomia",
  bienestar: "bienestar",
  aventura: "aventura",
  cultura: "cultura",
  estancias: "estancias"
}

const PLACEHOLDER_IMAGE = "/images/box-includes/vivabox-caja-regalo.png"
const LOCAL_CACHE_DIR = path.join(process.cwd(), "public", "images", "experiences")

function isRemoteExperienceImage(url?: string): url is string {
  return !!url && (url.includes("images.pexels.com") || url.includes("images.unsplash.com"))
}

// Real photos committed to public/images/experiencias-reales/, named after codigo_interno
// (see docs on the sheet's "imagen" column).
function isLocalExperienceImage(url?: string): url is string {
  return !!url && url.startsWith("/images/experiencias-reales/")
}

// Must stay in sync with localFileNameFor() in scripts/cache-experience-images.mjs
function resolveExperienceImage(url?: string): string {
  if (isLocalExperienceImage(url)) return url
  if (!isRemoteExperienceImage(url)) return PLACEHOLDER_IMAGE

  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 16)
  const ext = path.extname(new URL(url).pathname) || ".jpg"
  const localPath = path.join(LOCAL_CACHE_DIR, `${hash}${ext}`)

  return fs.existsSync(localPath) ? `/images/experiences/${hash}${ext}` : url
}

function shuffle<T>(array:T[]):T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

// Cover photo first, then whatever's listed in the sheet's "imagenes_adicionales"
// column (pipe-separated) -- each one resolved the same way as the cover.
function resolveGallery(row: any): string[] {
  const additional: string[] = (row.imagenesAdicionales || "")
    .split("|")
    .map((s: string) => s.trim())
    .filter(Boolean)
    .map(resolveExperienceImage)

  return [resolveExperienceImage(row.image), ...additional]
}

export async function getExperiencesPreview():Promise<Experience[]> {

  const rows:any[] = await getSheetData()

  const categories = [
    "gastronomia",
    "bienestar",
    "aventura",
    "cultura",
    "estancias"
  ]

  const grouped:Record<string,Experience[]> = {}

  for(const cat of categories){

    const activities = rows.filter(
      r => categoryMap[r.category?.toLowerCase()] === cat
    )

    const shuffled = shuffle(activities)

    grouped[cat] = shuffled.slice(0,2).map(row => ({

      title: row.title,
      city: row.city,
      category: cat,
      image: resolveExperienceImage(row.image),
      gallery: resolveGallery(row),

      duration: row.duration,
      zone: row.zone,
      shortDescription: row.shortDescription,

      idealFor: row.idealFor,
      effortLevel: row.effortLevel,
      ambiance: row.ambiance,
      environment: row.environment,
      engagement: row.engagement,
      vivanote: row.vivanote

    }))
  }

  const ordered:Experience[] = []

  for(let i=0;i<2;i++){
    for(const cat of categories){
      if(grouped[cat]?.[i]){
        ordered.push(grouped[cat][i])
      }
    }
  }

  return ordered
}

// Shown only when the sheet has no published row for a category yet (see the
// "estado" filter in services/sheet.ts) -- keeps the section from rendering
// empty while that pipeline is being finished.
const FALLBACK_EXAMPLES: Record<string, { title: string; city: string; image: string }[]> = {
  gastronomia: [
    { title: "Cena con cócteles de autor", city: "Bogotá", image: "/images/experiences/d0f7e6d2bdc4165a.jpeg" },
    { title: "Cata de vinos", city: "Bogotá", image: "/images/experiences/d414628f3844f5c1.jpeg" },
  ],
  bienestar: [
    { title: "Clase de yoga en grupo", city: "Bogotá", image: "/images/experiences/966ad0fefc7cd231.jpeg" },
    { title: "Día de spa", city: "Bogotá", image: "/images/experiences/eb83b6b7863c21a1.jpeg" },
  ],
  aventura: [
    { title: "Buceo guiado", city: "Cartagena", image: "/images/experiences/6321c99cffffb3dc.jpeg" },
    { title: "Circuito en carro deportivo", city: "Bogotá", image: "/images/experiences/8fa789055c36c3df.jpeg" },
  ],
  estancias: [
    { title: "Noche de glamping", city: "Cundinamarca", image: "/images/experiences/260fa8a6b0eaba11.jpeg" },
    { title: "Cabaña de cristal en el bosque", city: "Cundinamarca", image: "/images/experiences/c5f76d7001a5fedc.jpeg" },
  ],
}

// Two experiences per category, for the product page's "algunas experiencias
// que podría elegir" section. Only 4 categories (per docs/08_product-page.md)
// to keep the section shorter than the homepage's -- "cultura" intentionally
// left out.
export async function getExperienceExamples():Promise<Experience[]> {

  const rows:any[] = await getSheetData()

  const categories = [
    "gastronomia",
    "bienestar",
    "aventura",
    "estancias"
  ]

  const grouped:Record<string,Experience[]> = {}

  for(const cat of categories){

    const activities = rows.filter(
      r => categoryMap[r.category?.toLowerCase()] === cat
    )

    const picked:Experience[] = shuffle(activities).slice(0,2).map(row => ({
      title: row.title,
      city: row.city,
      category: cat,
      image: resolveExperienceImage(row.image),
      gallery: resolveGallery(row),

      duration: row.duration,
      zone: row.zone,
      shortDescription: row.shortDescription,

      idealFor: row.idealFor,
      effortLevel: row.effortLevel,
      ambiance: row.ambiance,
      environment: row.environment,
      engagement: row.engagement,
      vivanote: row.vivanote
    }))

    // Top up with fallbacks when the sheet doesn't have two published rows yet.
    const fallbacks = FALLBACK_EXAMPLES[cat] || []
    for(let i = picked.length; i < 2 && i < fallbacks.length; i++){
      picked.push({ title: fallbacks[i].title, city: fallbacks[i].city, category: cat, image: fallbacks[i].image })
    }

    grouped[cat] = picked
  }

  const ordered:Experience[] = []

  for(let i=0;i<2;i++){
    for(const cat of categories){
      if(grouped[cat]?.[i]){
        ordered.push(grouped[cat][i])
      }
    }
  }

  return ordered
}