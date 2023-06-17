const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    //Usuario: Populado
    //QUien ha creado el comentario
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //Contenido del comentario.
    commentContent: {
      type: String,
      required: true,
    },

    //Reference. a quien se refiere ? Yo lo entiendo como 'destinatario', pendiente de revisar con el equipo.
    referenceUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    referenceOfferComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: false,
    },

    //Like: Usuarios que le han dado like.
    likes: [
      {
        type: String,
        required: false,
      },
    ],

    //Type: Privado o público
    commentType: {
      type: String,
      enum: ["Privado", "Publico"],
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

// we create the data schema model for mongoose
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
