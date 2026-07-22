import type { LucideIcon } from "lucide-react"

import {
  Coffee,
  Sparkles,
  Mountain,
  Utensils,
  Hotel,
  Plane
} from "lucide-react"

export type Vivabox = {
  slug: string
  name: string

  signatureColor: string

  price: number
  experiences: number

  validityMonths: number

  delivery: {
    physical: boolean
    digital: boolean
  }

  ribbon: {
    text: string
    color: string
  }

  examples: {
    label: string
    icon: LucideIcon
  }[]

  categories: string[]

  description: string

  image: string
}

export const boxes: Vivabox[] = [

  {
    slug: "esencia",
    name: "Vivabox Esencia",

    signatureColor: "#00aba4",

    price: 185000,
    experiences: 120,

    validityMonths: 12,

    delivery: {
      physical: true,
      digital: true
    },

    ribbon: {
      text: "Super detalle",
      color: "#00aba4"
    },

    examples: [
      { label: "Brunch", icon: Coffee },
      { label: "Masajes", icon: Sparkles },
      { label: "Karting", icon: Mountain },
    ],

    categories: [
      "Gastronomía",
      "Bienestar",
      "Aventura",
      "Cultura"
    ],

    description:
      "Experiencias agradables para sorprender con un regalo original.",

    image: "/images/boxes/esencia.png",
  },

  {
    slug: "selecta",
    name: "Vivabox Selecta",

    signatureColor: "#cb2033",

    price: 395000,
    experiences: 350,

    validityMonths: 12,

    delivery: {
      physical: true,
      digital: true
    },

    ribbon: {
      text: "Más elegida",
      color: "#cb2033"
    },

    examples: [
      { label: "Cenas especiales", icon: Utensils },
      { label: "Spa premium", icon: Sparkles },
      { label: "Aventuras", icon: Mountain },
    ],

    categories: [
      "Gastronomía",
      "Bienestar",
      "Aventura",
      "Cultura",
      "Estancias"
    ],

    description:
      "Experiencias memorables para un regalo que realmente impresiona.",

    image: "/images/boxes/selecta.png",
  },

  {
    slug: "excepcion",
    name: "Vivabox Excep",

    signatureColor: "#c6a45b",

    price: 875000,
    experiences: 700,

    validityMonths: 12,

    delivery: {
      physical: true,
      digital: true
    },

    ribbon: {
      text: "Momento especial",
      color: "#000000"
    },

    examples: [
      { label: "Hoteles boutique", icon: Hotel },
      { label: "Paracaidismo", icon: Plane },
      { label: "Alta gastronomía", icon: Utensils },
    ],

    categories: [
      "Gastronomía",
      "Bienestar",
      "Aventura",
      "Cultura",
      "Estancias"
    ],

    description:
      "Experiencias extraordinarias para ocasiones especiales.",

    image: "/images/boxes/excepcional.png",
  },

]