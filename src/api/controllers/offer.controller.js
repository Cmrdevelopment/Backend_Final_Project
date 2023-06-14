const User = require('../models/user.model');
const Ratings = require('../models/ratings.model');
const Comment = require('../models/comment.model');
const Offer = require('../models/offer.model');

//! -----------------------------------------------------------------------
//? -------------------------------CREATE OFFER ---------------------------------
//! -----------------------------------------------------------------------

const create = async (req, res, next) => {
    try {
      const filterBody = {
        offerName: req.body.offerName,
        offerType: req.body.offerType,
        annualSalary: req.body.annualSalary,
        description: req.body.description,
        city: req.body.city,
        jobType: req.body.jobType,
        technologies: req.body.technologies,
        experienceYears: req.body.technologies,
        image: req.file.path,
        users: req.body.users,
        comments: req.body.comments,
        ratings: req.body.ratings,
        interestedUsers: req.body.interestedUsers,
        offerState: req.body.offerState,
        
      };
  
      const newOffer = new Offer(filterBody);
      const savedOffer = await newOffer.save();
  
      if (savedOffer) {
        return res.status(200).json(savedRating);
      } else {
        return res.status(404).json("Error creating Offer!");
      }
    } catch (error) {
      return next(error);
    }
  };
  
  //! ---------------------------------------------------------------------
//? ------------------------------GET ALL OFFERS --------------------------
//! ---------------------------------------------------------------------

const getAll = async (req, res, next) => {
    try {
      const Offers = await Offer.find()
        .populate('users')
        .populate('comments')
        .populate('ratings')
        .populate('interestedUsers');
  
      if (Offers) {
        return res.status(200).json(Offers);
      } else {
        return res.status(404).json(MobileDevErrors.FAIL_SEARCHING_MOBILEDEV); //Cambiar y adaptar al helper
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
      .populate('users')
      .populate('comments')
      .populate('ratings')
      .populate('interestedUsers');
      if (offerById) {
        return res.status(200).json(offerById);
      } else {
        return res.status(404).json(AppErrors.FAIL_SEARCHING_APP_BY_ID);
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
      const filterBody = {
        offerName: req.body.offerName,
        offerType: req.body.offerType,
        annualSalary: req.body.annualSalary,
        description: req.body.description,
        city: req.body.city,
        jobType: req.body.jobType,
        technologies: req.body.technologies,
        experienceYears: req.body.technologies,
        image: req.file.path,
        users: req.body.users,
        comments: req.body.comments,
        ratings: req.body.ratings,
        interestedUsers: req.body.interestedUsers,
        offerState: req.body.offerState,
      };
      const { id } = req.params;
      const offerById = await Offer.findById(id);
      if (offerById) {
        const patchOffer = new Offer(filterBody);
        patchOffer._id = id;
        await Offer.findByIdAndUpdate(id, patchOffer); // Guardar los cambios en la base de datos
        return res.status(200).json(await Offer.findById(id)); // Responder con el objeto actualizado
      } else {
        return res.status(404).json(MobileDevErrors.FAIL_UPDATING_MOBILEDEV); // Manejar el caso cuando no se encuentra la aplicación
      }
    } catch (error) {
      return next(error);
    }
  };
  
  //! ---------------------------------------------------------------------
  //? ----------------------------- DELETE --------------------------------
  //! ---------------------------------------------------------------------
  
  const deleteOffer = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteOffer = await Offer.findByIdAndDelete(id);
      if (deleteOffer) {
        await User.updateMany({ Offer: id }, { $pull: { Offer: id } });
        await Comment.updateMany({ Offer: id }, { $pull: { Offer: id } });
        await Ratings.updateMany({ Offer: id }, { $pull: { Offer: id } });
        
        const testOffer = await Offer.find({ Offer: id });
        return res.status(200).json({
          deleteOffer: deleteOffer,
          testDelete: (await Offer.findById(id))
            ? MobileDevErrors.FAIL_DELETING_MOBILEDEV
            : MobileDevSuccess.SUCCESS_DELETING_MOBILEDEV,
       //Lo dejamos comentado porque queremos que se nos explique el funcionamiento de estas lineas comentadas
            //   testUpdate:
        //     testOffer.length > 0
        //       ? AppErrors.FAIL_UPDATING_APP
        //       : AppSuccess.SUCCESS_UPDATING_APP,
        });
      } else {
        return res.status(404).json(MobileDevErrors.FAIL_DELETING_MOBILEDEV);
      }
    } catch (error) {
      return next(error);
    }
  };
  
//   //! ---------------------------------------------------------------------
//   //? ----------------------------- UPDATE APP--------------------------------
//   //! ---------------------------------------------------------------------
  //! ------¿Sería necesario usar este controlador?---------------------------
//   const updateApp = async (req, res, next) => {
//     try {
//       const { id } = req.params;
//       const oldMobileDev = await MobileDev.findByIdAndUpdate(id, req.body);
//       if (oldMobileDev) {
//         return res.status(200).json({
//           oldMobileDev: oldMobileDev,
//           newMobileDev: await MobileDev.findById(id),
//           status: 'Succesfully updated!',
//         });
//       } else {
//         return res.status(404).json(MobileDevErrors.FAIL_UPDATING_MOBILEDEV);
//       }
//     } catch (error) {
//       return next(error);
//     }
//   };
  
  //! ---------------------------------------------------------------------
  //? ------------------------------GETFAV --------------------------------
  //! ---------------------------------------------------------------------
  //Lineas 207 y 208: lo que viene despues del await, debe ir en mayuscula o en minusculas?
  const addFavorite = async (req, res, next) => {
    try {
      const offerFav = await Offer.findById(req.params.id); //--->Offer
      const user = await User.findById(req.user._id); //--->Nuestro user
  
      if (!offerFav.users.includes(user._id)) {
        await Offer.updateOne({ $push: { users: user._id } });
        await User.updateOne({ $push: { offerInterested: offer._id } });
        res.status(200).json('Added to favourites!');
      } else {
        await Offer.updateOne({ $pull: { users: user._id } });
        await User.updateOne({ $pull: { offerInterested: offer._id } });
        res.status(200).json('Removed from favourites');
      }
    } catch (error) {
      return next('Error while adding to favourites', error);
    }
  };


//   //! ---------------------------------------------------------------------
//   //? ------------------------------GET-STATUS-FAV --------------------------------
//   //! ---------------------------------------------------------------------
//!---CONTROLADOR COMENTADO, NO SÉ SI LLEGAMOS A HACER USO DE EL-------------
//   const getFavoriteStatus = async (req, res, next) => {
//     try {
//       const mobileFav = await MobileDev.findById(req.params.id);
//       const user = await User.findById(req.user._id);
  
//       if (mobileFav.users.includes(user._id)) {
//         res.status(200).json({ isFavorite: true });
//       } else {
//         res.status(200).json({ isFavorite: false });
//       }
//     } catch (error) {
//       return next('Error while getting favorite status', error);
//     }
//   };


  module.exports = {
    create,
    getAll,
    getById,
    getByOfferName,
    updateOffer,
    deleteOffer,
    addFavorite,
  };