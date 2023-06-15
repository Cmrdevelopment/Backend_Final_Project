const { isAuth } = require("../../middleware/auth.middleware");
const {
  create,
  deleteRating,
  updateRating,
  getByReference,
} = require("../controllers/rating.controllers");

const express = require("express");
const ratingRoutes = express.Router();

ratingRoutes.post("/", create);
ratingRoutes.delete("/:id", deleteRating);
ratingRoutes.put("/:id", updateRating);
ratingRoutes.get("/:refType/:id", getByReference);

module.exports = ratingRoutes;
