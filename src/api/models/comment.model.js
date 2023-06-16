const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema(
  {

    //Usuario: Populado
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },

    //Contenido del comentario.
    commentContent: {
      type: String,
      required: true
    },

    //Reference. a quien se refiere ? Yo lo entiendo como 'destinatario', pendiente de revisar con el equipo.
    references: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },


    //Like: Usuarios que le han dado like. 
    likes: {
      type: [String],
      required: true
    },

    //Type: Privado o público
    commentType: {
      type: String,
      enum: [
        'Privado',
        'Publico'
      ],
      required: false,
    },



  },

  {
    timestamps: true,
  }
);

// we create the data schema model for mongoose
const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
