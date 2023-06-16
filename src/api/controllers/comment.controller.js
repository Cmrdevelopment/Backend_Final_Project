const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const {
  CommentErrors,
  CommentSuccess,
} = require("../../helpers/jsonResponseMsgs");

//! -----------------------------------------------------------------------
//? -------------------------------CREATE COMMENT ---------------------------------
//! -----------------------------------------------------------------------
//Nota de Jonathan: Con tal de no modificar el codigo para este controlador Create, cuyo autor original es Igor, añadiré los mensajes de error en forma de comentarios junto a sus respectivas lineas.
const createComment = async (req, res, next) => {
  try {
    const filterBody = {
      commentContent: req.body.commentContent,
      commentType: req.body.commentType,
      users: req.user._id,
      referenceOfferComment: req.body.referenceOfferComment,
      referenceUser: req.body.referenceUser,
    };

    const newComment = new Comment(filterBody);

    try {
      // aqui guardamos en la base de datos
      const savedComment = await newComment.save();
      if (savedComment) {
        // ahora lo que tenemos que guardar el id en el array de offer de quien lo creo
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $push: { offersCreated: newOffer._id },
          });
          return res.status(200).json(savedComment);
        } catch (error) {
          return res.status(404).json("error updating user comment"); //CommentErrors.FAIL_UPDATING_COMMENT
        }
      } else {
        return res.status(404).json("Error creating comment"); //CommentErrors.FAIL_CREATING_COMMENT
      }
    } catch (error) {
      return res.status(404).json("error saving comment"); //CommentErrors.ERROR_SAVING_COMMENT
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GET ALL -------------------------------
//! ---------------------------------------------------------------------

const getAll = async (req, res, next) => {
  try {
    const allComments = await Comment.find()
      .populate("users")
      .populate("references");
    if (allComments) {
      return res.status(200).json(allComments);
    } else {
      return res.status(404).json(CommentErrors.FAIL_SEARCHING_COMMENTS);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GETBYID -------------------------------
//! ---------------------------------------------------------------------
// const getById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const commentById = await Comment.findById(id)
//       .populate("users")
//       .populate("references");
//     if (commentById) {
//       return res.status(200).json(commentById);
//     } else {
//       return res.status(404).json(CommentErrors.FAIL_SEARCHING_COMMENT_BY_ID);
//     }
//   } catch (error) {
//     return next(error);
//   }
// };
//! ---------------------------------------------------------------------
//? ----------------------------- GET BY APPNAME ------------------------
//! ---------------------------------------------------------------------
//Duda: Vamos a tener un buscador por nombre en comentarios?
// const getByAppName = async (req, res, next) => {
//     try {
//       const { appName } = req.params;

//       const AppNameByName = await App.find({ appName });

//       if (AppNameByName) {
//         return res.status(200).json(AppNameByName);
//       } else {
//         return res.status(404).json(AppErrors.FAIL_SEARCHING_APP_BY_NAME);
//       }
//     } catch (error) {
//       return next(error);
//     }
//   };

//! ---------------------------------------------------------------------
//? ----------------------------- UPDATE --------------------------------
//! ---------------------------------------------------------------------

// const updateComment = async (req, res, next) => {
//   try {
//     const filterBody = {
//       commentContent: req.body.commentContent,
//       commentType: req.body.commentType, //Duda: Añadimos la posibilidad de actualizar el tipo de comentario mediante update? o lo capamos?
//     };
//     const { id } = req.params;
//     const commentById = await Comment.findById(id);
//     if (commentById) {
//       const patchComment = new Comment(filterBody);
//       patchComment._id = id;
//       await Comment.findByIdAndUpdate(id, patchComment); // Guardar los cambios en la base de datos
//       return res.status(200).json(await Comment.findById(id)); // Responder con el objeto actualizado
//     } else {
//       return res.status(404).json(CommentErrors.FAIL_UPDATING_COMMENT);
//     }
//   } catch (error) {
//     return next(error);
//   }
// };
//! ---------------------------------------------------------------------------------------
//? ----------------------------- DELETE --------------------------------------------------
//! ---------------------------------------------------------------------------------------

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteComment = await Comment.findByIdAndDelete(id);
    if (deleteComment) {
      if (await Comment.findById(id)) {
        next(CommentErrors.FAIL_DELETING_COMMENT);
      } else {
        //Solo lo borramos del commentsByMe, en User.
        await User.updateMany(
          { commentsByMe: id },
          {
            $pull: { commentsByMe: id },
          }
        );
      }
      return res.status(200).json({
        deleteObject: deleteComment,
        test: (await App.findById(id))
          ? CommentErrors.FAIL_DELETING_COMMENT
          : CommentSuccess.SUCCESS_DELETING_COMMENT,
      });
    } else {
      return res.status(404).json(CommentErrors.FAIL_DELETING_COMMENT);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------LIKE--------------------------------
//! ---------------------------------------------------------------------
const toggleFavorite = async (req, res, next) => {
  try {
    const commentFav = await Comment.findById(req.params.id); //--->Comment
    const user = await User.findById(req.user._id); //--->Nuestro user

    if (!commentFav.users.includes(user._id)) {
      await commentFav.updateOne({ $push: { users: user._id } });
      await user.updateOne({ $push: { like: commentFav._id } });
      res.status(200).json(CommentSuccess.SUCCESS_AT_LIKES);
    } else {
      await commentFav.updateOne({ $pull: { users: user._id } });
      await user.updateOne({ $pull: { like: commentFav._id } });
      res.status(200).json("Comment removed from liked comments!");
    }
  } catch (error) {
    return next("Error while adding app to favourites", error);
  }
};

//! -----------------------------------------------------------------------
//? -------------------------------GET_BY_REFERENCE ---------------------------------
//! -----------------------------------------------------------------------

const getByReference = async (req, res, next) => {
  try {
    const { refType, id } = req.params;
    // refType indica si la valoración viene de una oferta (Offer) o un usuario (User), y id es el ID de la valoración
    console.log(id);
    let comments;
    if (refType === "Offer") {
      comments = await Comment.find({ referenceOfferComment: id }).populate(
        "users referenceOfferComment"
      );
      return res.status(200).json(comments);
    } else if (refType === "User") {
      comments = await Comment.find({ referenceUser: id });
      return res.status(200).json(comments);
    } else {
      return res.status(404).json({
        error: "Invalid reference type. It must be either 'User' or 'Offer'.",
      });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createComment,
  getAll,
  deleteComment,
  toggleFavorite,
  getByReference,
};
