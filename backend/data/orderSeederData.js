import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./models/orderModel.js";

dotenv.config();

// -------------------- DATA -----------------------

const clients = [
  {
    clientId: "692259c9ec2d3e1db0b3208d",
    units: [
      "69225da28d82dc8d8562c1c4",
      "69225da28d82dc8d8562c1c5",
    ],
  },
  {
    clientId: "692259c9ec2d3e1db0b3208e",
    units: [
      "69225da28d82dc8d8562c1c6",
      "69225da28d82dc8d8562c1c7",
    ],
  },
];

// All product IDs provided by you
const productIds = [
  "69225d6f657c932ee18c9803","69225d6f657c932ee18c9804","69225d6f657c932ee18c9805",
  "69225d6f657c932ee18c9806","69225d6f657c932ee18c9807","69225d6f657c932ee18c9808",
  "69225d6f657c932ee18c9809","69225d6f657c932ee18c980a","69225d6f657c932ee18c980b",
  "69225d6f657c932ee18c980c","69225d6f657c932ee18c980d","69225d6f657c932ee18c980e",
  "69225d6f657c932ee18c980f","69225d6f657c932ee18c9810","69225d6f657c932ee18c9811",
  "69225d6f657c932ee18c9812","69225d6f657c932ee18c9813","69225d6f657c932ee18c9814",
  "69225d6f657c932ee18c9815","69225d6f657c932ee18c9816","69225d6f657c932ee18c9817",
  "69225d6f657c932ee18c9818","69225d6f657c932ee18c9819","69225d6f657c932ee18c981a",
  "69225d6f657c932ee18c981b","69225d6f657c932ee18c981c","69225d6f657c932ee18c981d",
  "69225d6f657c932ee18c981e","69225d6f657c932ee18c981f","69225d6f657c932ee18c9820",
  "69225d6f657c932ee18c9821","69225d6f657c932ee18c9822","69225d6f657c932ee18c9823",
  "69225d6f657c932ee18c9824","69225d6f657c932ee18c9825","69225d6f657c932ee18c9826",
  "69225d6f657c932ee18c9827","69225d6f657c932ee18c9828","69225d6f657c932ee18c9829",
  "69225d6f657c932ee18c982a","69225d6f657c932ee18c982b","69225d6f657c932ee18c982c",
  "69225d6f657c932ee18c982d","69225d6f657c932ee18c982e","69225d6f657c932ee18c982f",
  "69225d6f657c932ee18c9830","69225d6f657c932ee18c9831","69225d6f657c932ee18c9832",
  "69225d6f657c932ee18c9833","69225d6f657c932ee18c9834","69225d6f657c932ee18c9835",
  "69225d6f657c932ee18c9836","69225d6f657c932ee18c9837","69225d6f657c932ee18c9838",
  "69225d6f657c932ee18c9839","69225d6f657c932ee18c983a","69225d6f657c932ee18c983b",
  "69225d6f657c932ee18c983c","69225d6f657c932ee18c983d","69225d6f657c932ee18c983e",
  "69225d6f657c932ee18c983f","69225d6f657c932ee18c9840","69225d6f657c932ee18c9841",
  "69225d6f657c932ee18c9842","69225d6f657c932ee18c9843","69225d6f657c932ee18c9844",
  "69225d6f657c932ee18c9845","69225d6f657c932ee18c9846","69225d6f657c932ee18c9847",
  "69225d6f657c932ee18c9848","69225d6f657c932ee18c9849","69225d6f657c932ee18c984a",
  "69225d6f657c932ee18c984b","69225d6f657c932ee18c984c","69225d6f657c932ee18c984d",
  "69225d6f657c932ee18c984e","69225d6f657c932ee18c984f","69225d6f657c932ee18c9850",
  "69225d6f657c932ee18c9851","69225d6f657c932ee18c9852","69225d6f657c932ee18c9853",
  "69225d6f657c932ee18c9854","69225d6f657c932ee18c9855","69225d6f657c932ee18c9856",
  "69225d6f657c932ee18c9857",
];

// ---------- Helpers ----------------

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomStatus = () =>
  ["Created", "In Production", "Quality Check", "Shipped", "Delivered"][
    Math.floor(Math.random() * 5)
  ];

const randomOrderItems = () => {
  const count = Math.floor(Math.random() * 4) + 1; // 1–4 products per order
  const items = [];

  for (let i = 0; i < count; i++) {
    items.push({
      product: randomElement(productIds),
      quantity: Math.floor(Math.random() * 50) + 1, // 1–50 qty
      size: randomElement(["S", "M", "L", "XL"]),
      color: randomElement(["Red", "Blue", "Green", "Black", "White"]),
    });
  }

  return items;
};

// ---------- Seeder ----------------

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");

    await Order.deleteMany();

    const orders = [];

    for (let i = 1; i <= 50; i++) {
      const client = randomElement(clients);

      const items = randomOrderItems();
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

      orders.push({
        orderNumber: `ORD-${1000 + i}`,
        client: client.clientId,
        assignedUnits: client.units,
        items,
        totalQuantity,
        status: randomStatus(),
        dueDate: new Date(Date.now() + Math.random() * 60 * 24 * 3600 * 1000), // within 60 days
        notes: "Auto-generated sample order",
      });
    }

    await Order.insertMany(orders);

    console.log("🌱 50 Orders seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding orders:", err);
    process.exit(1);
  }
};

seedOrders();
