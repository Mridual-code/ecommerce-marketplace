const cron = require("node-cron");

const {
  updateAllOrderTracking
} = require("../utils/orderTracking");

const startOrderTrackingJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await updateAllOrderTracking();
      console.log("Order tracking updated");
    } catch (error) {
      console.log(
        "Order tracking error:",
        error.message
      );
    }
  });

  console.log("Order tracking job started");
};

module.exports = startOrderTrackingJob;