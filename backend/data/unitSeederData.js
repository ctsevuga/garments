import mongoose from "mongoose";

const unitSeederData = [
  // ============================
  // Owner: 692259c9ec2d3e1db0b3208d
  // ============================

  {
    name: "Alpha Garments Unit 1",
    owner: new mongoose.Types.ObjectId("692259c9ec2d3e1db0b3208d"),
    managers: [new mongoose.Types.ObjectId("692259c9ec2d3e1db0b3208f")],
    address: {
      address: "12/3 Industrial Layout",
      city: "Tiruppur",
      pincode: "641601",
      phoneNumber: "9876543210",
    },
    capacity: 1500,
    isActive: true,
  },
  {
    name: "Alpha Garments Unit 2",
    owner: new mongoose.Types.ObjectId("692259c9ec2d3e1db0b3208d"),
    managers: [
      new mongoose.Types.ObjectId("692259c9ec2d3e1db0b32090"),
      new mongoose.Types.ObjectId("692259c9ec2d3e1db0b32091"),
    ],
    address: {
      address: "22/7 Textile Park Road",
      city: "Coimbatore",
      pincode: "641002",
      phoneNumber: "9876501234",
    },
    capacity: 2200,
    isActive: true,
  },

  // ============================
  // Owner: 692259c9ec2d3e1db0b3208e
  // ============================

  {
    name: "Beta Textiles Unit 1",
    owner: new mongoose.Types.ObjectId("692259c9ec2d3e1db0b3208e"),
    managers: [new mongoose.Types.ObjectId("692259c9ec2d3e1db0b32092")],
    address: {
      address: "5/90 Mill Road",
      city: "Erode",
      pincode: "638001",
      phoneNumber: "9000012345",
    },
    capacity: 1800,
    isActive: true,
  },
  {
    name: "Beta Textiles Unit 2",
    owner: new mongoose.Types.ObjectId("692259c9ec2d3e1db0b3208e"),
    managers: [new mongoose.Types.ObjectId("692259c9ec2d3e1db0b32093")],
    address: {
      address: "45/12 Garment Hub",
      city: "Salem",
      pincode: "636007",
      phoneNumber: "9000098765",
    },
    capacity: 2000,
    isActive: true,
  },
];

export default unitSeederData;
