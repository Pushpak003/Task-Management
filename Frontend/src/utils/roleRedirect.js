export const roleRedirect = (role) => {
  switch (role) {
    case "super_admin":
      return "/dashboard/super-admin";

    case "admin":
      return "/dashboard/admin";

    case "manager":
      return "/dashboard/manager";

    case "employee":
      return "/dashboard/employee";

    default:
      return "/";
  }
};