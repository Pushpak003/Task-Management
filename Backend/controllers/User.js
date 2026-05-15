const bcrypt = require("bcryptjs");

const User = require("../models/User");

// CREATE USER
exports.createUser = async (
  req,
  res
) => {

  try {

    const currentUser = req.user;

    const {
      name,
      email,
      password,
      role
    } = req.body;

    // CHECK EXISTING USER

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    // ROLE HIERARCHY

    const roleMap = {

      super_admin: [
        "admin",
        "manager",
        "employee"
      ],

      admin: [
        "manager",
        "employee"
      ],

      manager: [
        "employee"
      ],

      employee: []
    };

    const allowedRoles =
      roleMap[currentUser.role];

    // CHECK ROLE ACCESS

    if (
      !allowedRoles.includes(role)
    ) {

      return res.status(403).json({
        success: false,
        message:
          "You cannot create this role",
      });
    }

    // HASH PASSWORD

    const salt =
      await bcrypt.genSalt(10);

    const passwordHash =
      await bcrypt.hash(
        password,
        salt
      );

    // CREATE USER

    const user =
      await User.create({

        name,
        email,

        passwordHash,

        role,

        reportsTo:
          currentUser.id,
      });

    res.status(201).json({

      success: true,

      message:
        `${role} created successfully`,

      user,
      data: user,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "User creation failed",
    });
  }
};

// GET USERS
exports.getUsers = async (
  req,
  res
) => {

  try {

    const currentUser =
      req.user;

    let users = [];

    // SUPER ADMIN
    if (
      currentUser.role ===
      "super_admin"
    ) {

      users =
        await User.find()
          .select("-passwordHash");

    }

    // ADMIN
    else if (
      currentUser.role ===
      "admin"
    ) {

      users =
        await User.find({

          reportsTo:
            currentUser.id,

        }).select("-passwordHash");
    }

    // MANAGER
    else if (
      currentUser.role ===
      "manager"
    ) {

      users =
        await User.find({

          reportsTo:
            currentUser.id,

        }).select("-passwordHash");
    }

    // EMPLOYEE
    else {

      users =
        await User.findById(
          currentUser.id
        ).select("-passwordHash");
    }

    const userList =
      Array.isArray(users) ? users : [users];

    res.status(200).json({

      success: true,

      users: userList,
      data: userList,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch users",
    });
  }
};

// UPDATE USER
exports.updateUser = async (
  req,
  res
) => {

  try {

    const user =
      await User.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
        }

      ).select("-passwordHash");

    res.status(200).json({

      success: true,

      message:
        "User updated",

      user,
      data: user,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Update failed",
    });
  }
};

// DELETE USER
exports.deleteUser = async (
  req,
  res
) => {

  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({

      success: true,

      message:
        "User deleted",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Delete failed",
    });
  }
};
