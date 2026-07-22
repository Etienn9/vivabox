export type ExperienceCategory =
  | "Gastronomía"
  | "Bienestar"
  | "Aventura"
  | "Cultura"
  | "Estancias";

export interface ExperiencePreview {
  title: string;
  city: string;
  category: ExperienceCategory;
  image: string;
}

export const experiencesPreview: ExperiencePreview[] = [
  {
    title: "Cena gastronómica",
    city: "Bogotá",
    category: "Gastronomía",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
  },
  {
    title: "Brunch gourmet",
    city: "Bogotá",
    category: "Gastronomía",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2",
  },
  {
    title: "Día de spa",
    city: "Medellín",
    category: "Bienestar",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6",
  },
  {
    title: "Masaje relajante",
    city: "Bogotá",
    category: "Bienestar",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
  },
  {
    title: "Parapente",
    city: "Roldanillo",
    category: "Aventura",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    title: "Cuatrimotos",
    city: "Guatavita",
    category: "Aventura",
    image: "https://images.unsplash.com/photo-1560275619-4662e36fa65c",
  },
  {
    title: "Noche en hotel boutique",
    city: "Villa de Leyva",
    category: "Estancias",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
  },
  {
    title: "Glamping",
    city: "Cundinamarca",
    category: "Estancias",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  },
];