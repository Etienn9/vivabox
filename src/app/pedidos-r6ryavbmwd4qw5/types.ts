// Types et helpers purs, sans dépendance serveur — seul fichier de ce
// dossier qu'un Client Component (components.tsx) peut importer sans
// entraîner tout le code Supabase/Server Actions dans le bundle client.

export const PAGE_PATH = "/pedidos-r6ryavbmwd4qw5"
export const HISTORY_LIMIT = 50

export type Order = {
  id: string
  created_at: string
  box_slug: string
  quantity: number
  buyer_name: string
  buyer_email: string
  recipient_name: string | null
  recipient_contact: string | null
  delivery_direccion: string | null
  delivery_ciudad: string | null
  delivery_detalles: string | null
  prepared_at: string | null
  shipped_at: string | null
  code: string | null
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })
}
