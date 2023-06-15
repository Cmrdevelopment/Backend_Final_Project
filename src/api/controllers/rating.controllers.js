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
      // aqui guardamos en la base de datos
      const savedRating = await newRating.save();
      if (savedRating) {
        // ahora lo que tenemos que guardar el id en el array de rating de quien lo creo
        try {
          await User.findByIdAndUpdate(req.body.users, {
            $push: { ratingsByMe: newRating._id },
          });
          try {
            if (req.body.referenceOffer) {
              await Offer.findByIdAndUpdate(req.body.referenceOffer, {
                $push: { ratings: newRating._id },
              });
              return res.status(200).json(savedRating);
            }
            try {
              if (req.body.referenceUser) {
                await User.findByIdAndUpdate(req.body.referenceUser, {
                  $push: { ratingsByOthers: newRating._id },
                });
                return res.status(200).json(savedRating);
              }
            } catch (error) {
              return res
                .status(404)
                .json("error updating user reviews with him");
            }
          } catch (error) {
            return res.status(404).json("error updating referenceOffer model");
          }
        } catch (error) {
          return res.status(404).json("error updating owner user rating ");
        }
      } else {
        return res.status(404).json("Error creating rating");
      }
    } catch (error) {
      return res.status(404).json("error saving rating");
    }
  } catch (error) {
    return res.status(500).json(error.message);
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
        return res.status(404).json("failed deleting");
      } else {
        try {
          await User.updateMany(
            { ratings: id },
            {
              $pull: { ratingsByMe: id },
              $pull: { ratingsByOthers: id },
            }
          );

          try {
            await Offer.updateMany(
              { ratings: id },
              {
                $pull: { ratings: id },
              }
            );

            /// por ultimo lanzamos un test en el runtime para ver si se ha borrado la review correctamente
            return res.status(200).json({
              deletedObject: deletedRating,
              test: (await Ratings.findById(id))
                ? "fail_deleting_rating"
                : "success_deleting_rating",
            });
          } catch (error) {
            return res.status(404).json("failed updating offer");
          }
        } catch (error) {
          return res.status(404).json("failed updating user");
        }
      }
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
    const { score } = req.body;
    const filterBody = {
      score,
    };
    const { id } = req.params;
    const ratingById = await Ratings.findById(id);
    if (ratingById) {
      const patchRating = new Ratings(filterBody);
      patchRating._id = id;
      try {
        await Ratings.findByIdAndUpdate(id, patchRating);
        return res.status(200).json(await Ratings.findById(id));
      } catch (error) {
        return res.status(404).json("failed updating rating");
      }
    } else {
      return res.status(404).json({ message: "FAIL_UPDATING_RATING" });
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------
//? -------------------------------GET_BY_REFERENCE ---------------------------------
//! -----------------------------------------------------------------------

const getByReference = 


(module.exports = {
  create,
  deleteRating,
  updateRating,
});
