const User = require('../models/user.model');

//! -----------------------------------------------------------------------
//? -------------------------------CREATE COMMENT ---------------------------------
//! -----------------------------------------------------------------------
// const createComment = async (req, res, next) => {
//     try {

//         const filterBody = {
//             commentContent: req.body.commentContent,
//             commentType: req.body.commentType,
//         };

//         const newComment = new Comment(filterBody);

//         try {
//             // aqui guardamos en la base de datos
//             const savedComment = await newComment.save();
//             if (savedComment) {
//                 // ahora lo que tenemos que guardar el id en el array de offer de quien lo creo
//                 try {
//                     await User.findByIdAndUpdate(req.user._id, {
//                         $push: { offersCreated: newOffer._id },
//                     });
//                     return res.status(200).json(savedComment);
//                 } catch (error) {
//                     return res.status(404).json("error updating user comment");
//                 }
//             } else {
//                 return res.status(404).json("Error creating comment");
//             }
//         } catch (error) {
//             return res.status(404).json("error saving comment");
//         }
//     } catch (error) {
//         return res.status(500).json(error.message);
//     }
// };

// module.exports = {
//     createComment,
// };
