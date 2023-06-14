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
    const { score, users, referenceUser, referenceOffer } = req.body;

    // Validar los datos antes de guardar en la base de datos.
    if (!score || !users) {
      return res
        .status(400)
        .json({ message: "Los campos score y users son requeridos" });
    }

    const rating = new Ratings({
      score,
      users,
      referenceUser,
      referenceOffer,
    });

    await rating.save();

    return res.status(200).json({
      message: "La valoración ha sido creada con éxito",
      data: rating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Hubo un error al intentar crear la valoración",
      error: error.message,
    });
  }
};

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

module.exports = {
  create,
  deleteRating,
};

// const create = async (req, res, next) => {
//   try {
//     const ratingBody = {
//       score: req.body.score,
//       users: req.body.users,
//       referenceUser: req.body.referenceUser,
//       referenceOffer: req.body.referenceOffer,
//     };

//     const newRating = new Ratings(ratingBody);
//     const savedRating = await newRating.save();

//     if (savedRating) {
//       return res.status(200).json(savedRating);
//     } else {
//       return res.status(404).json("Error creating rating");
//     }
//   } catch (error) {
//     return next(error);
//   }
// };
