const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const Offer = require("../models/offer.model");
const {
  CommentErrors,
  CommentSuccess,
} = require("../../helpers/jsonResponseMsgs");

//! -----------------------------------------------------------------------
//? -------------------------------CREATE COMMENT ---------------------------------
//! -----------------------------------------------------------------------

const createComment = async (req, res, next) => {
  try {
    const commentBody = {
      commentContent: req.body.commentContent,
      owner: req.user._id,
      commentType: req.body.commentType,
      referenceUser: req.body.referenceUser,
      referenceOfferComment: req.body.referenceOfferComment,
    };
    const newComment = new Comment(commentBody);
    try {
      const savedComment = await newComment.save();
      console.log("entro", savedComment);
      if (savedComment) {
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $push: { commentsByMe: newComment._id },
          });
          try {
            if (req.body.referenceOfferComment) {
              await Offer.findByIdAndUpdate(req.body.referenceOfferComment, {
                $push: { comments: newComment._id },
              });
              return res.status(200).json(savedComment);
            } else {
              try {
                if (req.body.referenceUser) {
                  await User.findByIdAndUpdate(req.body.referenceUser, {
                    $push: { commentsByOthers: newComment._id },
                  });
                  return res.status(200).json(savedComment);
                }
              } catch (error) {
                return res
                  .status(404)
                  .json("error updating user reviews with him");
              }
            }
          } catch (error) {
            return res.status(404).json("error updating referenceOffer model");
          }
        } catch (error) {
          return res.status(404).json("error updating owner user comment ");
        }
      } else {
        return res.status(404).json("Error creating comment");
      }
    } catch (error) {
      return res.status(404).json("error saving comment");
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
    const allComments = await Comment.find();
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
//       .populate("owner")
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
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (deletedComment) {
      //Solo lo borramos del commentsByMe, en User.
      await User.updateMany(
        { commentsByMe: id },
        {
          $pull: { commentsByMe: id },
        }
      );

      try {
        await User.updateMany(
          { comentsThatILike: id },
          {
            $pull: { comentsThatILike: id },
          }
        );

        return res.status(200).json({
          deletedObject: deletedComment,
          message: CommentSuccess.SUCCESS_DELETING_COMMENT,
        });
      } catch (error) { }
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
    const commentId = req.params.id;
    const userId = req.user._id;

    const commentFav = await Comment.findById(commentId);
    const user = await User.findById(userId);

    if (!commentFav || !user) {
      return res.status(404).json("User or comment not found");
    }

    if (!commentFav.likes.includes(userId)) {
      await Comment.findByIdAndUpdate(commentId, { $push: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $push: { comentsThatILike: commentFav._id } });
      return res.status(200).json("Comment added to liked comments");
    } else {
      await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { comentsThatILike: commentFav._id } });
      return res.status(200).json("Comment removed from liked comments");
    }
  } catch (error) {
    return next(
      "Error while adding/removing comment to/from favourites",
      error
    );
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
        "owner referenceOfferComment"
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
