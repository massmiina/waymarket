import { syncCarData } from "../lib/cars/sync";

async function main() {
  console.log("Seeding car data...");
  await syncCarData();
  console.log("Seed complete.");
}

main().catch(e => {
  console.error("Seed failed:", e);
  process.exit(1);
});
