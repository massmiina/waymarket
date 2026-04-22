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

const TOP_EUROPEAN_BRANDS = [
  "Peugeot", "Renault", "Citroën", "Dacia", "Fiat", "Opel", 
  "Volkswagen", "Audi", "BMW", "Mercedes-Benz", "Porsche",
  "Volvo", "Skoda", "Seat", "Cupra", "Alfa Romeo", "Lancia",
  "Jaguar", "Land Rover", "Mini", "Smart", "Alpine", "DS",
  "Bugatti", "Bentley", "Rolls-Royce", "Aston Martin", "Maserati",
  "Lotus", "McLaren", "Ferrari", "Lamborghini", "Pagani", "Koenigsegg"
];

const TOP_INTERNATIONAL_BRANDS = [
  "Toyota", "Honda", "Nissan", "Mazda", "Hyundai", "Kia",
  "Ford", "Chevrolet", "Tesla", "Lexus", "Mitsubishi", 
  "Subaru", "Suzuki", "Jeep", "Cadillac", "Chrysler", "Dodge",
  "Ram", "GMC", "Buick", "Lincoln", "Infiniti", "Acura", "Genesis",
  "Rivian", "Lucid", "Polestar", "BYD", "MG", "Geely"
];

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

    // 2. Upsert all makes
    for (const makeData of allMakes) {
      const brandName = makeData.MakeName.trim();
      if (!brandName) continue;

      const slug = slugify(brandName);
      if (!slug || processedSlugs.has(slug)) continue;
      
      try {
        await db.carMake.upsert({
          where: { name: brandName },
          update: {},
          create: {
            name: brandName,
            slug: slug
          }
        });
        processedSlugs.add(slug);
        brandsCount++;
      } catch (err) {
        // Skip individual errors (like duplicate slugs that somehow bypassed the set)
        continue;
      }
    }
    console.log(`✅ Successfully synced ${brandsCount} unique brands.`);

    // 3. Sync models for priority brands
    const priorityBrands = [...TOP_EUROPEAN_BRANDS, ...TOP_INTERNATIONAL_BRANDS];
    
    for (const brandName of priorityBrands) {
      try {
        const make = await db.carMake.findUnique({ where: { name: brandName } });
        if (!make) continue;

        console.log(`📦 Syncing models for: ${brandName}`);
        
        // Fetch models from NHTSA
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(brandName)}?format=json`);
        const data = await response.json();

        if (data.Results && Array.isArray(data.Results)) {
          const processedModelSlugs = new Set<string>();

          for (const modelData of data.Results) {
            const modelName = modelData.Model_Name.trim();
            if (!modelName) continue;

            const modelSlug = slugify(modelName);
            if (processedModelSlugs.has(modelSlug)) continue;

            await db.carModel.upsert({
              where: {
                name_makeId: {
                  name: modelName,
                  makeId: make.id
                }
              },
              update: {},
              create: {
                name: modelName,
                slug: modelSlug,
                makeId: make.id
              }
            });
            processedModelSlugs.add(modelSlug);
            modelsCount++;
          }
        }
      } catch (error) {
        console.error(`❌ Failed to sync models for ${brandName}:`, error);
      }
    }

    console.log(`✨ Sync completed: ${brandsCount} brands and ${modelsCount} models added/updated.`);
    return { brandsCount, modelsCount };

  } catch (error) {
    console.error("🛑 Global car data sync error:", error);
    throw error;
  }
}
