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

const CAR_DATA: Record<string, string[]> = {
  "Toyota": ["Corolla", "Yaris", "Camry", "RAV4", "C-HR", "Prius", "Land Cruiser", "Hilux"],
  "Volkswagen": ["Golf", "Polo", "Passat", "Tiguan", "Touareg", "T-Roc", "Arteon", "ID.3", "ID.4"],
  "BMW": ["Series 1", "Series 2", "Series 3", "Series 4", "Series 5", "Series 7", "X1", "X3", "X5", "X6", "i4", "iX"],
  "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "GLS", "EQA", "EQB", "EQC"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron", "Q4 e-tron"],
  "Renault": ["Clio", "Megane", "Twingo", "Captur", "Arkana", "Austral", "Scenic", "Zoe", "Kangoo"],
  "Peugeot": ["108", "208", "308", "508", "2008", "3008", "5008", "408", "e-208"],
  "Citroën": ["C1", "C3", "C4", "C5 Aircross", "Berlingo", "SpaceTourer", "Ami"],
  "Dacia": ["Sandero", "Duster", "Jogger", "Spring", "Logan", "Lodgy"],
  "Ford": ["Fiesta", "Focus", "Mondeo", "Puma", "Kuga", "Explorer", "Ranger", "Mustang"],
  "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Navara"],
  "Honda": ["Civic", "Jazz", "Accord", "CR-V", "HR-V", "e"],
  "Hyundai": ["i10", "i20", "i30", "Tucson", "Kona", "Ioniq 5", "Ioniq 6", "Santa Fe"],
  "Kia": ["Picanto", "Rio", "Ceed", "Sportage", "Niro", "EV6", "Sorento"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck", "Roadster"],
  "BYD": ["Atto 3", "Han", "Tang", "Seal", "Dolphin"],
  "Volvo": ["XC40", "XC60", "XC90", "EX30", "EX90", "S60", "V60"],
  "Land Rover": ["Range Rover Evoque", "Range Rover Sport", "Defender", "Discovery", "Velar"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Boxster"],
  "Lexus": ["UX", "NX", "RX", "ES", "LS", "LC"],
  "Ferrari": ["Roma", "SF90", "296 GTB", "Purosangue", "F8 Tributo"],
  "Lamborghini": ["Huracán", "Aventador", "Urus", "Revuelto"],
  "Maserati": ["Ghibli", "Levante", "Grecale", "MC20", "GranTurismo"],
  "Bentley": ["Bentayga", "Continental GT", "Flying Spur"],
  "Rolls-Royce": ["Ghost", "Phantom", "Cullinan", "Wraith"],
  "McLaren": ["570S", "720S", "Artura", "P1"],
  "Aston Martin": ["DBX", "Vantage", "DB11", "DBS"],
  "Bugatti": ["Chiron", "Divo", "Bolide", "Mistral"],
  "Chevrolet": ["Spark", "Malibu", "Camaro", "Corvette", "Tahoe"],
  "Jeep": ["Renegade", "Compass", "Wrangler", "Grand Cherokee", "Avenger"],
  "Mazda": ["Mazda2", "Mazda3", "CX-3", "CX-5", "CX-60", "MX-5"],
  "Subaru": ["Impreza", "Forester", "Outback", "BRZ"],
  "Suzuki": ["Swift", "Vitara", "S-Cross", "Jimny"],
  "Mitsubishi": ["Space Star", "ASX", "Outlander", "L200"],
  "Skoda": ["Fabia", "Octavia", "Superb", "Kodiaq", "Enyaq"],
  "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
  "Cupra": ["Formentor", "Leon", "Born", "Ateca"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "Giulietta"],
  "Mini": ["Cooper", "Clubman", "Countryman"],
  "Fiat": ["500", "Panda", "Tipo", "500X", "Doblo"],
  "Opel": ["Corsa", "Astra", "Mokka", "Grandland"],
  "Saab": ["9-3", "9-5"],
  "Genesis": ["GV60", "GV70", "G80"],
  "Lucid": ["Air", "Gravity"],
  "Rivian": ["R1T", "R1S"],
  "Polestar": ["Polestar 2", "Polestar 3", "Polestar 4"]
};

export async function syncCarData() {
  console.log("🚀 Starting car data sync...");
  let brandsCount = 0;
  let modelsCount = 0;
  
  try {
    // 1. Fetch ALL makes for passenger cars from NHTSA
    console.log("📡 Fetching all makes from NHTSA...");
    const makesResponse = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
    const makesData = await makesResponse.json();

    if (!makesData.Results || !Array.isArray(makesData.Results)) {
      throw new Error("Invalid response from NHTSA makes API");
    }

    const allMakes = makesData.Results;
    console.log(`🔍 Found ${allMakes.length} makes in API. Syncing to database...`);

    // Use a Set to track processed slugs and avoid unique constraint violations
    const processedSlugs = new Set<string>();

    // 2. Populate from our curated list (CAR_DATA)
    console.log("🛠️ Seeding curated car data...");
    for (const [makeName, models] of Object.entries(CAR_DATA)) {
      const makeSlug = slugify(makeName);
      const make = await db.carMake.upsert({
        where: { name: makeName },
        update: { slug: makeSlug },
        create: { name: makeName, slug: makeSlug }
      });
      brandsCount++;

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
    console.log(`✅ Curated sync complete: ${Object.keys(CAR_DATA).length} brands.`);

    // 3. Fetch additional makes from NHTSA to ensure diversity
    console.log("📡 Fetching additional makes from NHTSA...");
    const makesResponse = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
    const makesData = await makesResponse.json();
    
    if (makesData.Results && Array.isArray(makesData.Results)) {
      const allMakes = makesData.Results;
      const processedSlugs = new Set<string>(Object.keys(CAR_DATA).map(slugify));

      for (const makeData of allMakes) {
        const brandName = makeData.MakeName.trim();
        if (!brandName) continue;
        const slug = slugify(brandName);
        if (processedSlugs.has(slug)) continue;

        try {
          await db.carMake.upsert({
            where: { name: brandName },
            update: {},
            create: { name: brandName, slug: slug }
          });
          processedSlugs.add(slug);
          brandsCount++;
        } catch (err) { continue; }
      }
    }

    console.log(`✨ Sync completed: ${brandsCount} brands and ${modelsCount} models added/updated.`);
    return { brandsCount, modelsCount };

  } catch (error) {
    console.error("🛑 Global car data sync error:", error);
    throw error;
  }
}
