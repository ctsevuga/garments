const users = [
  "692259c9ec2d3e1db0b3208d",
  "692259c9ec2d3e1db0b3208e",
  "692259c9ec2d3e1db0b3208f",
  "692259c9ec2d3e1db0b32090",
  "692259c9ec2d3e1db0b32091",
  "692259c9ec2d3e1db0b32092",
  "692259c9ec2d3e1db0b32093",
];

const types = ["order", "inventory", "system"];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const notificationSeederData = Array.from({ length: 50 }).map((_, i) => {
  const type = randomItem(types);

  return {
    user: randomItem(users),
    title:
      type === "order"
        ? `Order Update #${1000 + i}`
        : type === "inventory"
        ? `Inventory Alert #${1000 + i}`
        : `System Notification #${1000 + i}`,
    message:
      type === "order"
        ? "Your order has been updated in the production workflow."
        : type === "inventory"
        ? "A product stock level has changed."
        : "A new system update has been applied.",
    isRead: false,
    type,
  };
});

export default notificationSeederData;
