const mongoose = require('mongoose');


const RatingsSchema = new mongoose.Schema(
  {
    //Puntuacion. Pendiente de revisar con el equipo: el enum.
    score: {
      type: number,
      enum: [
        '1',
        '2',
        '3',
        '4',
        '5'
      ],
      required: true,
    },

    // Usuario
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },
    
    // Reference: Populado (usuario, oferta) (Preguntar a pedro a que se refiere? Se refiere al textArea donde escribes el comentario, que puede ser tanto para el user como para la oferta?)
    reference: [{
      model: { type: String, enum: ['User', 'Offer'] },
      id: { type: mongoose.Schema.Types.ObjectId }
    }],

  },

  {
    timestamps: true,
  }
);

// we create the data schema model for mongoose
const Ratings = mongoose.model('Ratings', RatingsSchema);
module.exports = Ratings;
