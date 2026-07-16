const Order = require("../models/Order");

const statuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered"
];

const getSchedule = () => {
  if (process.env.TRACKING_MODE === "demo") {
    const minute = 60 * 1000;

    return [
      {
        status: "Pending",
        after: 0
      },
      {
        status: "Processing",
        after: 2 * minute
      },
      {
        status: "Shipped",
        after: 4 * minute
      },
      {
        status: "Out for Delivery",
        after: 6 * minute
      },
      {
        status: "Delivered",
        after: 8 * minute
      }
    ];
  }

  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  return [
    {
      status: "Pending",
      after: 0
    },
    {
      status: "Processing",
      after: 12 * hour
    },
    {
      status: "Shipped",
      after: day
    },
    {
      status: "Out for Delivery",
      after: 2 * day
    },
    {
      status: "Delivered",
      after: 3 * day
    }
  ];
};

const advanceOrderTracking = async (order) => {
  if (
    order.status === "Cancelled" ||
    order.status === "Delivered"
  ) {
    return order;
  }

  // Support orders created before tracking was added
  if (!order.estimatedDeliveryDate) {
    order.estimatedDeliveryDate = new Date(
      new Date(order.createdAt).getTime() +
        3 * 24 * 60 * 60 * 1000
    );
  }

  const elapsed =
    Date.now() -
    new Date(order.createdAt).getTime();

  let expectedStatus = "Pending";

  getSchedule().forEach((step) => {
    if (elapsed >= step.after) {
      expectedStatus = step.status;
    }
  });

  const currentIndex = statuses.indexOf(
    order.status
  );

  const expectedIndex = statuses.indexOf(
    expectedStatus
  );

  // Do not move an order backwards
  if (expectedIndex <= currentIndex) {
    /*
      The old order may only require its missing
      estimatedDeliveryDate to be saved.
    */
    if (order.isModified()) {
      await order.save();
    }

    return order;
  }

  const missingStatuses = statuses.slice(
    currentIndex + 1,
    expectedIndex + 1
  );

  missingStatuses.forEach((status) => {
    order.trackingHistory.push({
      status,
      timestamp: new Date()
    });
  });

  order.status = expectedStatus;

  if (expectedStatus === "Delivered") {
    order.deliveredAt = new Date();
  }

  await order.save();

  return order;
};

const updateAllOrderTracking = async () => {
  const orders = await Order.find({
    status: {
      $nin: ["Delivered", "Cancelled"]
    }
  });

  for (const order of orders) {
    await advanceOrderTracking(order);
  }
};

module.exports = {
  advanceOrderTracking,
  updateAllOrderTracking
};