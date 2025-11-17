const { asyncHandler } = require("../helpers/asyncHandler");
const { success } = require("../helpers/apiResponse");

// demo controller
const getUsers = asyncHandler(async (req, res) => {
  // placeholder: fetch users from DB
  success(res, [{ id: 1, name: "Demo User" }], "Users fetched");
});

module.exports = { getUsers };
