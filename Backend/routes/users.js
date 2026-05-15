const express = require("express");

const router = express.Router();

const auth =
  require("../middleware/auth");

const authorizeRoles =
  require("../middleware/roles");

const {

  createUser,
  getUsers,
  updateUser,
  deleteUser,

} = require("../controllers/User");

// CREATE USER
router.post(
  "/",
  auth,
  authorizeRoles(
    "super_admin",
    "admin",
    "manager"
  ),
  createUser
);

// GET USERS
router.get(
  "/",
  auth,
  getUsers
);

// UPDATE USER
router.patch(
  "/:id",
  auth,
  authorizeRoles(
    "super_admin",
    "admin"
  ),
  updateUser
);

// DELETE USER
router.delete(
  "/:id",
  auth,
  authorizeRoles("super_admin"),
  deleteUser
);

module.exports = router;