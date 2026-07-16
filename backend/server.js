const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require(
  "./routes/departmentRoutes"
);
const categoryRoutes = require(
  "./routes/categoryRoutes"
);
const productRoutes = require(
  "./routes/productRoutes"
);
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require(
  "./routes/dashboardRoutes"
);
const serviceRoutes = require(
  "./routes/serviceRoutes"
);
const serviceBookingRoutes = require(
  "./routes/serviceBookingRoutes"
);
const wishlistRoutes = require(
  "./routes/wishlistRoutes"
);

const startOrderTrackingJob = require(
  "./jobs/orderTrackingJob"
);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AutoCart API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/services", serviceRoutes);
app.use(
  "/api/service-bookings",
  serviceBookingRoutes
);
app.use("/api/wishlist", wishlistRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    startOrderTrackingJob();

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on port ${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(
      "MongoDB connection failed",
      error
    );
  });