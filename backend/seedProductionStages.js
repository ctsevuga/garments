import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductionStage from "./models/productionStageModel.js";

dotenv.config();

// -----------------------------------------------------------------------------
// Provided order + unit mapping (50 entries)
// -----------------------------------------------------------------------------

const ordersWithUnits = [
  { order: "6922608b44dea12c430903a2", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903a3", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903a4", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903a5", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903a6", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903a7", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903a8", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903a9", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903aa", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903ab", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },

  { order: "6922608c44dea12c430903ac", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903ad", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903ae", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903af", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903b0", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903b1", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903b2", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903b3", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903b4", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903b5", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },

  { order: "6922608c44dea12c430903b6", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903b7", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903b8", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903b9", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903ba", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903bb", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903bc", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903bd", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903be", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903bf", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },

  { order: "6922608c44dea12c430903c0", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903c1", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903c2", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903c3", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903c4", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903c5", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903c6", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903c7", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903c8", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903c9", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },

  { order: "6922608c44dea12c430903ca", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903cb", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903cc", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903cd", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903ce", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903cf", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903d0", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903d1", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
  { order: "6922608c44dea12c430903d2", units: ["69225da28d82dc8d8562c1c4", "69225da28d82dc8d8562c1c5"] },
  { order: "6922608c44dea12c430903d3", units: ["69225da28d82dc8d8562c1c6", "69225da28d82dc8d8562c1c7"] },
];

// -----------------------------------------------------------------------------
//  Seeder Logic
// -----------------------------------------------------------------------------

const stages = ["Cutting", "Stitching", "Finishing", "Packaging", "Completed"];

const seedProductionStages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await ProductionStage.deleteMany();

    const docs = [];

    for (const entry of ordersWithUnits) {
      for (const unitId of entry.units) {
        for (const stage of stages) {
          docs.push({
            order: entry.order,
            unit: unitId,
            stage,
            startedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000),
            completedAt: stage === "Completed" ? new Date() : null,
            progress: stage === "Completed" ? 100 : Math.floor(Math.random() * 100),
            remarks: `Auto-generated stage: ${stage}`,
          });
        }
      }
    }

    await ProductionStage.insertMany(docs);

    console.log(`🌱 Seeded ${docs.length} ProductionStage records successfully!`);
    process.exit();
  } catch (err) {
    console.error("❌ ProductionStage seeding failed:", err);
    process.exit(1);
  }
};

seedProductionStages();
