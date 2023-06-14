const { isAuth } = require("../../middleware/auth.middleware");
const {
  create,
  deleteRating,
  updateRating,
} = require("../controllers/rating.controllers");

const express = require("express");
const ratingRoutes = express.Router();

ratingRoutes.post("/", create);
ratingRoutes.delete("/:id", deleteRating);
ratingRoutes.put("/:id", create);

module.exports = ratingRoutes;
