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
  "Jaguar", "Land Rover", "Mini", "Smart", "Alpine", "DS"
];

const TOP_INTERNATIONAL_BRANDS = [
  "Toyota", "Honda", "Nissan", "Mazda", "Hyundai", "Kia",
  "Ford", "Chevrolet", "Tesla", "Lexus", "Mitsubishi", 
  "Subaru", "Suzuki", "Jeep", "Ferrari", "Lamborghini"
];

export async function syncCarData() {
  console.log("Starting car data sync...");
  
  try {
    // 1. Fetch ALL makes for passenger cars from NHTSA
    console.log("Fetching all makes from NHTSA...");
    const makesResponse = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
    const makesData = await makesResponse.json();

    if (!makesData.Results || !Array.isArray(makesData.Results)) {
      throw new Error("Invalid response from NHTSA makes API");
    }

    const allMakes = makesData.Results;
    console.log(`Found ${allMakes.length} makes. Syncing to database...`);

    // 2. Upsert all makes
    for (const makeData of allMakes) {
      const brandName = makeData.MakeName;
      await db.carMake.upsert({
        where: { name: brandName },
        update: {},
        create: {
          name: brandName,
          slug: slugify(brandName)
        }
      });
    }
    console.log(`Successfully synced ${allMakes.length} brands.`);

    // 3. Sync models for TOP brands (to ensure we have data for the most common ones)
    const priorityBrands = [...TOP_EUROPEAN_BRANDS, ...TOP_INTERNATIONAL_BRANDS];
    
    for (const brandName of priorityBrands) {
      try {
        console.log(`Syncing models for priority brand: ${brandName}`);
        
        const make = await db.carMake.findUnique({ where: { name: brandName } });
        if (!make) continue;

        // Fetch models from NHTSA
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${brandName}?format=json`);
        const data = await response.json();

        if (data.Results && Array.isArray(data.Results)) {
          for (const modelData of data.Results) {
            const modelName = modelData.Model_Name;
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
                slug: slugify(modelName),
                makeId: make.id
              }
            });
          }
          console.log(`Synced ${data.Results.length} models for ${brandName}`);
        }
      } catch (error) {
        console.error(`Failed to sync models for ${brandName}:`, error);
      }
    }

  } catch (error) {
    console.error("Global car data sync error:", error);
  }

  console.log("Car data sync complete.");
}
