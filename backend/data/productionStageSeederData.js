// productionStageSeederData.js

const ordersWithUnits = [
  { order: "691bd6742b59cae3864196c4", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196c5", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196c6", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196c7", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196c8", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196c9", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196ca", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196cb", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196cc", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196cd", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196ce", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196cf", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196d0", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196d1", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196d2", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196d3", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196d4", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196d5", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196d6", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196d7", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196d8", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196d9", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196da", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196db", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196dc", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196dd", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196de", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196df", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196e0", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196e1", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196e2", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196e3", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196e4", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196e5", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196e6", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196e7", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196e8", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196e9", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196ea", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196eb", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196ec", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196ed", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196ee", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196ef", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196f0", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196f1", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
  { order: "691bd6742b59cae3864196f2", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196f3", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196f4", units: ["691b35dabb8533f140a6540a","691b35dabb8533f140a6540b"] },
  { order: "691bd6742b59cae3864196f5", units: ["691b35dabb8533f140a65408","691b35dabb8533f140a65409"] },
];

const stages = ["Cutting", "Stitching", "Finishing", "Packaging", "Completed"];

function randomDate() {
  const now = new Date();
  return new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000);
}

function stageProgress(stage) {
  return {
    Cutting: 20,
    Stitching: 40,
    Finishing: 70,
    Packaging: 90,
    Completed: 100
  }[stage];
}

const productionStageSeederData = [];

ordersWithUnits.forEach(({ order, units }) => {
  units.forEach(unit => {
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const startedAt = randomDate();
    const completedAt = stage === "Completed" ? new Date(startedAt.getTime() + 3 * 24 * 60 * 60 * 1000) : null;

    productionStageSeederData.push({
      order,
      unit,
      stage,
      startedAt,
      completedAt,
      progress: stageProgress(stage),
      remarks: `${stage} in progress for order ${order.slice(-4)}`
    });
  });
});

export default productionStageSeederData;
