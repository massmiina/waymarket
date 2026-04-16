import { 
  Car, 
  Sofa, 
  Smartphone, 
  Gamepad2, 
  Shirt, 
  Home, 
  Box,
  Wrench
} from 'lucide-react';
import { Category } from '@/contexts/MarketContext';

export const CATEGORIES: { id: Category; label: string; icon: any }[] = [
  { id: 'Véhicules', label: 'Véhicules', icon: Car },
  { id: 'Équipements auto', label: 'Équipements', icon: Wrench },
  { id: 'Immobilier', label: 'Immobilier', icon: Home },
  { id: 'Électronique', label: 'Électronique', icon: Smartphone },
  { id: 'Mobilier', label: 'Mobilier', icon: Sofa },
  { id: 'Vêtements', label: 'Vêtements', icon: Shirt },
  { id: 'Jouets', label: 'Jouets', icon: Gamepad2 },
  { id: 'Autres', label: 'Autres', icon: Box },
];

export const CAR_DATA: Record<string, string[]> = {
  "Peugeot": ["208", "308", "508", "2008", "3008", "5008", "Partner", "Expert", "Autre"],
  "Renault": ["Clio", "Megane", "Captur", "Kadjar", "Arkana", "Twingo", "Zoe", "Kangoo", "Autre"],
  "Citroën": ["C1", "C3", "C4", "C5", "Berlingo", "Picasso", "Autre"],
  "Volkswagen": ["Polo", "Golf", "Passat", "Tiguan", "Touareg", "ID.3", "ID.4", "Autre"],
  "Audi": ["A1", "A3", "A4", "A6", "Q2", "Q3", "Q5", "e-tron", "Autre"],
  "BMW": ["Série 1", "Série 3", "Série 5", "X1", "X3", "X5", "i3", "Autre"],
  "Mercedes-Benz": ["Classe A", "Classe C", "Classe E", "GLA", "GLC", "GLE", "Autre"],
  "Toyota": ["Yaris", "Corolla", "Auris", "RAV4", "C-HR", "Aygo", "Autre"],
  "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mondeo", "Autre"],
  "Dacia": ["Sandero", "Duster", "Lodgy", "Jogger", "Autre"],
  "Fiat": ["500", "Panda", "Tipo", "Ducato", "Autre"],
  "Opel": ["Corsa", "Astra", "Mokka", "Grandland", "Autre"],
  "Hyundai": ["i10", "i20", "i30", "Tucson", "Kona", "Autre"],
  "Kia": ["Picanto", "Rio", "Ceed", "Sportage", "Niro", "Autre"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
  "Nissan": ["Micra", "Juke", "Qashqai", "Leaf", "Autre"],
  "Mini": ["Hatch", "Countryman", "Clubman", "Autre"],
  "Volvo": ["XC40", "XC60", "XC90", "V40", "Autre"],
  "Autre": ["Modèle personnalisé"]
};

export const CONDITIONS = [
  "Neuf",
  "Très bon état",
  "Bon état",
  "Satisfaisant"
];

export const FUEL_TYPES = [
  "Essence",
  "Diesel",
  "Hybride",
  "Électrique"
];

export const GEARBOX_TYPES = [
  "Manuelle",
  "Automatique"
];

export const COLORS = [
  "Noir",
  "Blanc",
  "Gris",
  "Bleu",
  "Rouge",
  "Vert",
  "Jaune",
  "Argent",
  "Beige",
  "Marron",
  "Orange",
  "Rose",
  "Autre"
];

export const CRITAIR = [
  "Électrique",
  "1",
  "2",
  "3",
  "4",
  "5"
];

export const CLOTHING_SIZES = [
  "XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL",
  "34", "36", "38", "40", "42", "44", "46", "48",
  "28", "29", "30", "31", "32", "33", "34", "36"
];

export const STORAGE_CAPACITIES = [
  "16 Go",
  "32 Go",
  "64 Go",
  "128 Go",
  "256 Go",
  "512 Go",
  "1 To",
  "2 To"
];

export const HEATING_TYPES = [
  "Électrique",
  "Gaz",
  "Fioul",
  "Bois",
  "Pompe à chaleur",
  "Solaire",
  "Collectif"
];
