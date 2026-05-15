const bcrypt = require("bcryptjs");

const User = require("../models/User");

const createSuperAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      role: "super_admin",
    });

    if (existingAdmin) {
      console.log("Super Admin already exists");

      return;
    }

    const passwordHash = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",

      email: "superadmin@gmail.com",

      passwordHash,

      role: "super_admin",

      reportsTo: null,
    });

    console.log("Super Admin created");
  } catch (error) {
    console.error(error);
  }
};

module.exports = createSuperAdmin;
