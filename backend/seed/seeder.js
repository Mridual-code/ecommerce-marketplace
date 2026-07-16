const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../models/User");
const Department = require("../models/Department");
const Category = require("../models/Category");
const Product = require("../models/Product");

const userData = require("./userData");
const departmentData = require("./departmentData");
const categoryData = require("./categoryData");
const productData = require("./productData");

dotenv.config();

const connectDatabase = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI is missing from the .env file"
    );
  }

  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected");
};

const removeSeededData = async () => {
  /*
    This removes the existing catalogue before rebuilding it.

    Only the listed seeded accounts are removed.
    Other users registered through the frontend are preserved.
  */

  await Product.deleteMany({});
  await Category.deleteMany({});
  await Department.deleteMany({});

  await User.deleteMany({
    email: {
      $in: [
        "admin@autocart.com",
        "manager@autocart.com",
        "customer@autocart.com",
        "mridul@autocart.com"
      ]
    }
  });

  console.log(
    "Previous catalogue and seeded accounts removed"
  );
};

const seedUsers = async () => {
  const usersWithHashedPasswords = await Promise.all(
    userData.map(async (user) => {
      const hashedPassword = await bcrypt.hash(
        user.password,
        10
      );

      return {
        ...user,
        password: hashedPassword
      };
    })
  );

  const createdUsers = await User.insertMany(
    usersWithHashedPasswords
  );

  console.log(
    `${createdUsers.length} seeded Admin account created`
  );

  return createdUsers;
};

const seedDepartments = async () => {
  const createdDepartments =
    await Department.insertMany(departmentData);

  console.log(
    `${createdDepartments.length} departments created`
  );

  return createdDepartments;
};

const seedCategories = async (createdDepartments) => {
  const categoriesWithDepartmentIds = categoryData.map(
    (category) => {
      const department = createdDepartments.find(
        (item) => item.name === category.departmentName
      );

      if (!department) {
        throw new Error(
          `Department not found for category: ${category.name}`
        );
      }

      return {
        name: category.name,
        description: category.description,
        department: department._id
      };
    }
  );

  const createdCategories = await Category.insertMany(
    categoriesWithDepartmentIds
  );

  console.log(
    `${createdCategories.length} categories created`
  );

  return createdCategories;
};

const seedProducts = async (
  createdDepartments,
  createdCategories
) => {
  const productsWithReferences = productData.map(
    (product) => {
      const department = createdDepartments.find(
        (item) =>
          item.name === product.departmentName
      );

      const category = createdCategories.find(
        (item) => item.name === product.categoryName
      );

      if (!department) {
        throw new Error(
          `Department not found for product: ${product.name}`
        );
      }

      if (!category) {
        throw new Error(
          `Category not found for product: ${product.name}`
        );
      }

      const {
        departmentName,
        categoryName,
        ...productFields
      } = product;

      return {
        ...productFields,
        department: department._id,
        category: category._id
      };
    }
  );

  const createdProducts = await Product.insertMany(
    productsWithReferences
  );

  console.log(
    `${createdProducts.length} products created`
  );

  return createdProducts;
};

const importData = async () => {
  try {
    await connectDatabase();

    await removeSeededData();

    await seedUsers();

    const departments = await seedDepartments();

    const categories = await seedCategories(
      departments
    );

    await seedProducts(departments, categories);

    console.log("");
    console.log("AutoCart data seeded successfully");
    console.log("");
    console.log("Seeded Admin account:");
    console.log("Email: mridul@autocart.com");
    console.log("Password: Mridul@123");
  } catch (error) {
    console.error("");
    console.error("Seeder failed:");
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  }
};

const destroyData = async () => {
  try {
    await connectDatabase();

    await removeSeededData();

    console.log(
      "Seeded AutoCart data destroyed successfully"
    );
  } catch (error) {
    console.error("");
    console.error("Destroy operation failed:");
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  }
};

const command = process.argv[2];

if (command === "--destroy") {
  destroyData();
} else {
  importData();
}