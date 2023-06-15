const User = require("../models/user.model");
const Offer = require("../models/offer.model");
const Ratings = require("../models/ratings.model");
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const BASE_URL_COMPLETE = `${BASE_URL}${PORT}`;

//! -----------------------------------------------------------------------
//? -------------------------------CREATE RATING ---------------------------------
//! -----------------------------------------------------------------------

const create = async (req, res, next) => {
  try {
    const ratingBody = {
      score: req.body.score,
      users: req.body.users,
      referenceUser: req.body.referenceUser,
      referenceOffer: req.body.referenceOffer,
    };
    const newRating = new Ratings(ratingBody);
    try {
      const savedRating = await newRating.save();
      if (savedRating) {
        await User.findByIdAndUpdate(req.body.users);
        if (req.body.referenceOffer) {
        }
        if (req.body.referenceUser) {
        }
        await Ratings.findById(savedRating._id);

        return res.status(200).json(savedRating);
      } else {
        return res.status(404).json("Error creating rating");
      }
    } catch (error) {
      return res.status(404).json("error saving rating");
    }
  } catch (error) {
    return next(error);
  }
};
//! -----------------------------------------------------------------------
//? -------------------------------GET ALL ---------------------------------
//! -----------------------------------------------------------------------

//! -----------------------------------------------------------------------
//? -------------------------------DELETE RATING ---------------------------------
//! -----------------------------------------------------------------------
const deleteRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRating = await Ratings.findByIdAndDelete(id);
    if (deletedRating) {
      if (await Ratings.findById(id)) {
        next("Fail deleting rating");
      } else {
        await User.updateMany(
          { ratings: id },
          {
            $pull: { ratings: id },
          }
        );
        await Offer.updateMany(
          { ratings: id },
          {
            $pull: { ratings: id },
          }
        );
      }
      return res.status(200).json({
        deletedObject: deletedRating,
        test: (await Ratings.findById(id))
          ? "fail_deleting_rating"
          : "success_deleting_rating",
      });
    } else {
      return res.status(404).json({ message: "Fail deleting rating" });
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------
//? -------------------------------UPDATE RATING ---------------------------------
//! -----------------------------------------------------------------------

const updateRating = async (req, res, next) => {
  try {
    const { score, users, referenceUser, referenceOffer } = req.body;

    const filterBody = {
      score,
      users,
      referenceUser,
      referenceOffer,
    };
    const { id } = req.params;
    const ratingById = await Ratings.findById(id);
    if (ratingById) {
      const patchRating = new Ratings(filterBody);
      patchRating._id = id;
      await Ratings.findByIdAndUpdate(id, patchRating);
      return res.status(200).json(await Ratings.findById(id));
    } else {
      return res.status(404).json({ message: "FAIL_UPDATING_RATING" });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
  deleteRating,
  updateRating,
};
