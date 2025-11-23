const units = [
  "69225da28d82dc8d8562c1c4",
  "69225da28d82dc8d8562c1c5",
  "69225da28d82dc8d8562c1c6",
  "69225da28d82dc8d8562c1c7"
];

const inventorySeederData = [
  { unit: units[0], itemName: "Cotton Fabric 180 GSM White", category: "fabric", quantity: 1200, unitOfMeasure: "meters", reorderLevel: 200, supplierName: "ABC Textiles" },
  { unit: units[1], itemName: "Cotton Fabric 220 GSM Black", category: "fabric", quantity: 850, unitOfMeasure: "meters", reorderLevel: 150, supplierName: "Superior Mills" },
  { unit: units[2], itemName: "Polyester Fabric 150 GSM Navy", category: "fabric", quantity: 1000, unitOfMeasure: "meters", reorderLevel: 200, supplierName: "Global Fabrics Ltd" },
  { unit: units[3], itemName: "Denim Fabric 12oz Blue", category: "fabric", quantity: 600, unitOfMeasure: "meters", reorderLevel: 100, supplierName: "Denim House" },
  { unit: units[0], itemName: "Lycra Knit Fabric Black", category: "fabric", quantity: 450, unitOfMeasure: "meters", reorderLevel: 80, supplierName: "Flexi Mills" },
  { unit: units[1], itemName: "Poplin Fabric White", category: "fabric", quantity: 900, unitOfMeasure: "meters", reorderLevel: 150, supplierName: "ABC Textiles" },
  { unit: units[2], itemName: "Viscose Fabric Printed Floral", category: "fabric", quantity: 700, unitOfMeasure: "meters", reorderLevel: 120, supplierName: "ColorTex" },
  { unit: units[3], itemName: "Rayon Fabric Red", category: "fabric", quantity: 520, unitOfMeasure: "meters", reorderLevel: 100, supplierName: "Rayon Ltd" },
  { unit: units[0], itemName: "Jersey Knit Fabric Grey", category: "fabric", quantity: 680, unitOfMeasure: "meters", reorderLevel: 100, supplierName: "KnitPro" },
  { unit: units[1], itemName: "Fleece Fabric Black", category: "fabric", quantity: 400, unitOfMeasure: "meters", reorderLevel: 60, supplierName: "WarmTex" },

  // TRIMS
  { unit: units[2], itemName: "Polyester Thread 40/2 White", category: "trim", quantity: 2500, unitOfMeasure: "pieces", reorderLevel: 300, supplierName: "ThreadWorks" },
  { unit: units[3], itemName: "Polyester Thread 40/2 Black", category: "trim", quantity: 2000, unitOfMeasure: "pieces", reorderLevel: 300, supplierName: "ThreadWorks" },
  { unit: units[0], itemName: "Cotton Thread 30/3 Beige", category: "trim", quantity: 1500, unitOfMeasure: "pieces", reorderLevel: 200, supplierName: "SewLine" },
  { unit: units[1], itemName: "Metal Zipper YKK #3 Silver", category: "trim", quantity: 700, unitOfMeasure: "pieces", reorderLevel: 200, supplierName: "YKK" },
  { unit: units[2], itemName: "Plastic Zipper #5 Black", category: "trim", quantity: 1000, unitOfMeasure: "pieces", reorderLevel: 250, supplierName: "ZipMaster" },
  { unit: units[3], itemName: "Hook & Loop Tape Black 25mm", category: "trim", quantity: 400, unitOfMeasure: "meters", reorderLevel: 100, supplierName: "Velcro Co." },
  { unit: units[0], itemName: "Elastic Band 1 inch White", category: "trim", quantity: 850, unitOfMeasure: "meters", reorderLevel: 150, supplierName: "FlexBand" },
  { unit: units[1], itemName: "Bias Tape Black", category: "trim", quantity: 500, unitOfMeasure: "meters", reorderLevel: 120, supplierName: "TrimHub" },
  { unit: units[2], itemName: "Rib Knit Collar Black", category: "trim", quantity: 350, unitOfMeasure: "meters", reorderLevel: 80, supplierName: "KnitPro" },
  { unit: units[3], itemName: "Button 14L Brown Plastic", category: "trim", quantity: 4000, unitOfMeasure: "pieces", reorderLevel: 500, supplierName: "ButtonWorld" },

  // ACCESSORIES
  { unit: units[0], itemName: "Metal Buttons Antique Brass 20mm", category: "accessory", quantity: 2500, unitOfMeasure: "pieces", reorderLevel: 400, supplierName: "ButtonWorld" },
  { unit: units[1], itemName: "Snap Buttons Silver 12mm", category: "accessory", quantity: 3000, unitOfMeasure: "pieces", reorderLevel: 300, supplierName: "SnapCo" },
  { unit: units[2], itemName: "Woven Label – Brand Logo", category: "accessory", quantity: 1500, unitOfMeasure: "pieces", reorderLevel: 300, supplierName: "LabelWorks" },
  { unit: units[3], itemName: "Care Label White", category: "accessory", quantity: 5000, unitOfMeasure: "pieces", reorderLevel: 600, supplierName: "LabelWorks" },
  { unit: units[0], itemName: "Hang Tag Premium", category: "accessory", quantity: 800, unitOfMeasure: "pieces", reorderLevel: 200, supplierName: "TagCraft" },
  { unit: units[1], itemName: "Plastic Tag Seal Black", category: "accessory", quantity: 2000, unitOfMeasure: "pieces", reorderLevel: 300, supplierName: "TagCraft" },
  { unit: units[2], itemName: "Drawstring Cotton White", category: "accessory", quantity: 600, unitOfMeasure: "meters", reorderLevel: 100, supplierName: "CordHub" },
  { unit: units[3], itemName: "Metal Eyelets 5mm", category: "accessory", quantity: 3500, unitOfMeasure: "pieces", reorderLevel: 400, supplierName: "EyeletPro" },
  { unit: units[0], itemName: "Plastic Buckle 25mm", category: "accessory", quantity: 1800, unitOfMeasure: "pieces", reorderLevel: 250, supplierName: "TrimHub" },
  { unit: units[1], itemName: "Rivets Copper 8mm", category: "accessory", quantity: 2200, unitOfMeasure: "pieces", reorderLevel: 300, supplierName: "MetalCraft" },

  // OTHER
  { unit: units[2], itemName: "Polybag 12x16 inches", category: "other", quantity: 4000, unitOfMeasure: "pieces", reorderLevel: 500, supplierName: "PackPro" },
  { unit: units[3], itemName: "Carton Box Large", category: "other", quantity: 600, unitOfMeasure: "pieces", reorderLevel: 100, supplierName: "BoxHub" },
  { unit: units[0], itemName: "Carton Box Medium", category: "other", quantity: 1300, unitOfMeasure: "pieces", reorderLevel: 200, supplierName: "BoxHub" },
  { unit: units[1], itemName: "Packing Tape Clear", category: "other", quantity: 900, unitOfMeasure: "pieces", reorderLevel: 150, supplierName: "TapeWorld" },
  { unit: units[2], itemName: "Silica Gel Packets", category: "other", quantity: 2500, unitOfMeasure: "pieces", reorderLevel: 400, supplierName: "DryPack" },
  { unit: units[3], itemName: "Garment Packaging Insert Card", category: "other", quantity: 1800, unitOfMeasure: "pieces", reorderLevel: 300, supplierName: "PrintWorks" },
  { unit: units[0], itemName: "Barcode Stickers", category: "other", quantity: 5000, unitOfMeasure: "pieces", reorderLevel: 700, supplierName: "PrintWorks" },
  { unit: units[1], itemName: "Hang Tag String Nylon", category: "other", quantity: 2500, unitOfMeasure: "pieces", reorderLevel: 400, supplierName: "TagCraft" },
  { unit: units[2], itemName: "Size Label Set (S–XXL)", category: "other", quantity: 3000, unitOfMeasure: "pieces", reorderLevel: 500, supplierName: "LabelWorks" },
  { unit: units[3], itemName: "Shrink Wrap Film", category: "other", quantity: 900, unitOfMeasure: "meters", reorderLevel: 150, supplierName: "PackPro" }
];

export default inventorySeederData;
