import { db } from "@/lib/db";

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')     // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

// Source of Truth: Elite & Best-sellers curated list
const CAR_DATA: Record<string, string[]> = {
  "Peugeot": ["108", "208", "308", "408", "508", "2008", "3008", "5008", "Rifter", "Partner"],
  "Renault": ["Twingo", "Clio", "Captur", "Mégane", "Arkana", "Austral", "Espace", "Rafale", "Scenic", "Zoe", "Kangoo"],
  "Citroën": ["C1", "C3", "C3 Aircross", "C4", "C4 X", "C5 Aircross", "C5 X", "Berlingo", "Ami"],
  "Dacia": ["Sandero", "Jogger", "Duster", "Spring"],
  "Volkswagen": ["Polo", "Golf", "T-Roc", "Tiguan", "Touareg", "Passat", "Arteon", "ID.3", "ID.4", "ID.5", "ID. Buzz"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "e-tron GT", "RS3", "RS6"],
  "BMW": ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "Série 7", "Série 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "i4", "iX", "M3", "M5"],
  "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "CLA", "GLA", "GLB", "GLC", "GLE", "GLS", "EQE", "EQS", "G-Class", "AMG GT"],
  "Porsche": ["718 Boxster/Cayman", "911", "Taycan", "Panamera", "Macan", "Cayenne"],
  "Ferrari": ["Roma", "296 GTB", "SF90 Stradale", "F8 Tributo", "Purosangue", "812 Superfast"],
  "Lamborghini": ["Huracán", "Revuelto", "Urus"],
  "Maserati": ["Grecale", "Levante", "Ghibli", "Quattroporte", "MC20"],
  "Aston Martin": ["Vantage", "DB11", "DBS", "DBX"],
  "Bentley": ["Continental GT", "Flying Spur", "Bentayga"],
  "Rolls-Royce": ["Ghost", "Phantom", "Cullinan"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  "BYD": ["Atto 3", "Dolphin", "Seal", "Han", "Tang"],
  "Lucid": ["Air"],
  "Rivian": ["R1T", "R1S"],
  "Polestar": ["Polestar 2", "Polestar 3"],
  "Toyota": ["Aygo X", "Yaris", "Corolla", "C-HR", "RAV4", "Land Cruiser", "Supra", "Hilux"],
  "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mustang", "Mustang Mach-E", "Ranger"],
  "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Ariya", "Leaf"],
  "Hyundai": ["i10", "i20", "i30", "Kona", "Tucson", "Santa Fe", "Ioniq 5", "Ioniq 6"],
  "Kia": ["Picanto", "Ceed", "Niro", "Sportage", "Sorento", "EV6", "EV9"],
  "Volvo": ["XC40", "XC60", "XC90", "EX30", "V60", "S60"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Velar", "Evoque", "Defender", "Discovery"],
  "Autre": ["Modèle personnalisé"]
};

export async function syncCarData() {
  console.log("🚀 Starting curated car data sync...");
  let brandsCount = 0;
  let modelsCount = 0;
  
  try {
    // We strictly only use our CAR_DATA object, no external API calls
    // to keep the catalog clean and elite.
    
    for (const [makeName, models] of Object.entries(CAR_DATA)) {
      const makeSlug = slugify(makeName);
      
      // Upsert the Make
      const make = await db.carMake.upsert({
        where: { name: makeName },
        update: { slug: makeSlug },
        create: { name: makeName, slug: makeSlug }
      });
      brandsCount++;

      // Upsert the Models for this Make
      for (const modelName of models) {
        const modelSlug = slugify(modelName);
        await db.carModel.upsert({
          where: { name_makeId: { name: modelName, makeId: make.id } },
          update: { slug: modelSlug },
          create: { name: modelName, slug: modelSlug, makeId: make.id }
        });
        modelsCount++;
      }
    }

    console.log(`✨ Curated Sync completed: ${brandsCount} brands and ${modelsCount} models updated.`);
    return { brandsCount, modelsCount };

  } catch (error) {
    console.error("🛑 Curated car data sync error:", error);
    throw error;
  }
}
