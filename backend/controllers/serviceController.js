const Service = require("../models/Service");

/*
  Create a new service
  Access: Admin and Manager
*/
const createService = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      image,
      startingPrice,
      duration,
      features,
      isAvailable
    } = req.body;

    if (
      !name ||
      !category ||
      !description ||
      startingPrice === undefined ||
      !duration
    ) {
      return res.status(400).json({
        message:
          "Name, category, description, price and duration are required"
      });
    }

    const service = await Service.create({
      name,
      category,
      description,
      image: image || "",
      startingPrice: Number(startingPrice),
      duration,
      features: Array.isArray(features)
        ? features
        : [],
      isAvailable:
        typeof isAvailable === "boolean"
          ? isAvailable
          : true,
      createdBy: req.user._id
    });

    const populatedService =
      await Service.findById(service._id)
        .populate("createdBy", "name email role");

    return res.status(201).json({
      message: "Service created successfully",
      service: populatedService
    });
  } catch (error) {
    console.log("Create service error:", error);

    return res.status(500).json({
      message:
        error.message ||
        "Failed to create service"
    });
  }
};

/*
  Get all services
  Access: Public
  Supports search, category and available filters
*/
const getServices = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      available
    } = req.query;

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          category: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i"
          }
        }
      ];
    }

    if (category.trim()) {
      filter.category = {
        $regex: `^${category.trim()}$`,
        $options: "i"
      };
    }

    if (available === "true") {
      filter.isAvailable = true;
    }

    if (available === "false") {
      filter.isAvailable = false;
    }

    const services = await Service.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: services.length,
      services
    });
  } catch (error) {
    console.log("Get services error:", error);

    return res.status(500).json({
      message: "Failed to fetch services"
    });
  }
};

/*
  Get one service
  Access: Public
*/
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    ).populate(
      "createdBy",
      "name email role"
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    return res.status(200).json({
      service
    });
  } catch (error) {
    console.log(
      "Get service by ID error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid service ID"
      });
    }

    return res.status(500).json({
      message: "Failed to fetch service"
    });
  }
};

/*
  Update service
  Access: Admin and Manager
*/
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    const allowedFields = [
      "name",
      "category",
      "description",
      "image",
      "startingPrice",
      "duration",
      "features",
      "isAvailable"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });

    await service.save();

    const updatedService =
      await Service.findById(service._id)
        .populate("createdBy", "name email role");

    return res.status(200).json({
      message: "Service updated successfully",
      service: updatedService
    });
  } catch (error) {
    console.log("Update service error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid service ID"
      });
    }

    return res.status(500).json({
      message:
        error.message ||
        "Failed to update service"
    });
  }
};

/*
  Delete service
  Access: Admin and Manager
*/
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    await service.deleteOne();

    return res.status(200).json({
      message: "Service deleted successfully"
    });
  } catch (error) {
    console.log("Delete service error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid service ID"
      });
    }

    return res.status(500).json({
      message: "Failed to delete service"
    });
  }
};

/*
  Enable or disable a service
  Access: Admin and Manager
*/
const updateServiceAvailability = async (
  req,
  res
) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message:
          "isAvailable must be true or false"
      });
    }

    const service =
      await Service.findByIdAndUpdate(
        req.params.id,
        { isAvailable },
        {
          new: true,
          runValidators: true
        }
      ).populate(
        "createdBy",
        "name email role"
      );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    return res.status(200).json({
      message: isAvailable
        ? "Service is now available"
        : "Service is now unavailable",
      service
    });
  } catch (error) {
    console.log(
      "Update service availability error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid service ID"
      });
    }

    return res.status(500).json({
      message:
        "Failed to update service availability"
    });
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  updateServiceAvailability
};