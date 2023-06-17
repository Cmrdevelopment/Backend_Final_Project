const User = require("../models/user.model");
const Ratings = require("../models/ratings.model");
const Comment = require("../models/comment.model");
const Offer = require("../models/offer.model");
const { OfferErrors } = require("../../helpers/jsonResponseMsgs");

//! -----------------------------------------------------------------------
//? -------------------------------CREATE OFFER ---------------------------------
//! -----------------------------------------------------------------------
const createOffer = async (req, res, next) => {
  try {
    const arrayTechnology = req.body.technologies.split(",");
    const offerBody = {
      offerTitle: req.body.offerTitle,
      offerType: req.body.offerType,
      annualSalary: req.body.annualSalary,
      description: req.body.description,
      city: req.body.city,
      jobType: req.body.jobType,
      technologies: arrayTechnology,
      offerState: req.body.offerState,
      owner: req.user._id,
    };

    const newOffer = new Offer(offerBody);

    try {
      // aqui guardamos en la base de datos
      const savedOffer = await newOffer.save();
      if (savedOffer) {
        // ahora lo que tenemos que guardar el id en el array de offer de quien lo creo
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $push: { offersCreated: newOffer._id },
          });
          return res.status(200).json(savedOffer);
        } catch (error) {
          return res.status(404).json("error updating user offer");
        }
      } else {
        return res.status(404).json("Error creating offer");
      }
    } catch (error) {
      return res.status(404).json("error saving offer");
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GET ALL OFFERS --------------------------
//! ---------------------------------------------------------------------

// Añadir oferta al usiario logueado, si está interesado en la oferta
// Add offer to user, if he/she is interested in this offer
// When the user clickes the button "Like offer/follow offer" (or something like this)
const addInterestedOfferToUser = async (req, res, next) => {
  try {
    const offerBody = {
      offerName: req.body.offerName,
      offerType: req.body.offerType,
      annualSalary: req.body.annualSalary,
      description: req.body.description,
      city: req.body.city,
      jobType: req.body.jobType,
      technologies: req.body.technologies,
    };

    const newOffer = new Offer(offerBody);

    try {
      // aqui guardamos en la base de datos
      const savedOffer = await newOffer.save();
      if (savedOffer) {
        // ahora lo que tenemos que guardar el id en el array de offer de quien lo creo
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $push: { offersInterested: newOffer._id },
          });
          return res.status(200).json(savedOffer);
        } catch (error) {
          return res.status(404).json("error updating user offer");
        }
      } else {
        return res.status(404).json("Error creating offer");
      }
    } catch (error) {
      return res.status(404).json("error saving offer");
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GET ALL OFFERS --------------------------
//! ---------------------------------------------------------------------

const getAll = async (req, res, next) => {
  try {
    const Offers = await Offer.find()
      .populate("users")
      .populate("comments")
      .populate("ratings")
      .populate("interestedUsers");

    if (Offers) {
      return res.status(200).json(Offers);
    } else {
      return res.status(404).json(OfferErrors.FAIL_SEARCHING_OFFER);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GETBYID -------------------------------
//! ---------------------------------------------------------------------
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offerById = await Offer.findById(id)
      .populate("users")
      .populate("comments")
      .populate("ratings")
      .populate("interestedUsers");
    if (offerById) {
      return res.status(200).json(offerById);
    } else {
      return res.status(404).json(OfferErrors.FAIL_SEARCHING_OFFER_BY_ID);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- GET BY OFFERNAME ------------------------
//! ---------------------------------------------------------------------
//Pregunta para quien lo revise: ¿Tiene que haber aquí también un .populate?
const getByOfferName = async (req, res, next) => {
  try {
    const { offerName } = req.params;

    const OfferNameByName = await Offer.find({ offerName });

    if (OfferNameByName) {
      return res.status(200).json(OfferNameByName);
    } else {
      return res.status(404).json(AppErrors.FAIL_SEARCHING_APP_BY_NAME);
    }
  } catch (error) {
    return next(error);
  }
};

//! -------------------------------------------------------------------
//? ----------------------------- UPDATE --------------------------------
//! ---------------------------------------------------------------------
//Revisar filterbody. Pregunta a quien revise esto: ¿Se puede meter por filterbody un valor cuyo required sea 'true'? ¿O dará problemas? En caso de problemas, revisar esto.
const updateOffer = async (req, res, next) => {
  try {
    let newImage;

    if (req.file) {
      newImage = req.file.path;
    } else {
      newImage = "https://pic.onlinewebfonts.com/svg/img_181369.png";
    }

    const filterBody = {
      offerType: req.body.offerType,
      annualSalary: req.body.annualSalary,
      description: req.body.description,
      city: req.body.city,
      jobType: req.body.jobType,
      technologies: req.body.technologies,
      experienceYears: req.body.experienceYears,
      image: newImage,
      offerState: req.body.offerState,
    };

    const { id } = req.params;

    const offerById = await Offer.findById(id);
    if (offerById) {
      console.log("updateOffer -> filterBody: ", filterBody);
      const patchOffer = new Offer(filterBody);
      patchOffer._id = id;
      await Offer.findByIdAndUpdate(id, patchOffer); // Guardar los cambios en la base de datos
      return res.status(200).json(await Offer.findById(id)); // Responder con el objeto actualizado
    } else {
      return res.status(404).json(OfferErrors.FAIL_UPDATING_OFFER);
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------
//? -------------------------------DELETE OFFER ---------------------------------
//! -----------------------------------------------------------------------
const deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOffer = await Offer.findByIdAndDelete(id);
    if (deletedOffer) {
      if (await Offer.findById(id)) {
        return res.status(404).json("failed deleting");
      } else {
        try {
          await User.updateMany(
            { offersCreated: id },
            {
              $pull: { offersCreated: id },
            }
          );

          try {
            await User.updateMany(
              { offersCreated: id },
              {
                $pull: { offersInterested: id },
              }
            );

            try {
              // lo que queremos es borrar todos los comentarios de esta oferta priva
              await Comment.deleteMany({ offerPrivates: id });

              /// por ultimo lanzamos un test en el runtime para ver si se ha borrado la review correctamente
              return res.status(200).json({
                deletedObject: deletedOffer,
                test: (await Offer.findById(id))
                  ? "fail deleting offer"
                  : "success deleting offer",
              });
            } catch (error) {
              return res
                .status(404)
                .json("failed updating user offersInterested");
            }
          } catch (error) {
            return res
              .status(404)
              .json("failed updating user offersInterested");
          }
        } catch (error) {
          return res.status(404).json("failed updating user offersCreated");
        }
      }
    } else {
      return res.status(404).json({ message: "Fail deleting offer" });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOffer,
  addInterestedOfferToUser,
  getAll,
  getById,
  getByOfferName,
  updateOffer,
  deleteOffer,
};
