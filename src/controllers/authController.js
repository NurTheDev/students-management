const { asyncHandler } = require("../helpers/asyncHandler");
const { success } = require("../helpers/apiResponse");
const {CustomError} = require("../helpers/customError");

exports.signUp = asyncHandler(async (req, res) => {
  console.log("signUp");
})
