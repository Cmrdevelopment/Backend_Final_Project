const mongoose = require('mongoose');


const OfferSchema = new mongoose.Schema(
  {
    //Nombre Oferta
    offerName: { type: String, required: true },
    // Tipo de la oferta
    offerType: {
      type: String,
      enum: [
        'LookForJob',
        'OfferMySelf'
      ],
      required: true,
    },

    // Salario anual
    annualSalary: {
      type: Number,
      required: false,
    },

    description: {
      type: String,
      required: true,
    },

    // Ciudad del trabajo
    city: {
      type: String,
      required: true,
    },

    // Tipo de trabajo
    jobType: {
      type: String,
      enum: [
        'Remote',
        'Office',
        'Hybrid'
      ],
      required: true,
    },

    // Tecnologías que piden en la oferta
    technologies: { type: String, required: true },

    // Años de experiencia
    //Comentario: Revisar si puede usarse el max: 100.
    experienceYears: {
      type: Number, min: 0, max: 100,
    },

    // Logo de la compañia
    image: {
      type: String,
    },

    // Usuarios que siguen la oferta
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },

    // Comentarios sobre la oferta
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Comment',
      required: false,
    },

    // Valoraciones sobre la oferta
    ratings: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Ratings',
      required: true,
    },

    // Usuarios ineresados en la oferta
    interestedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },

    // Estado de la Oferta
    offerState: {
      type: String,
      enum: [
        'Close',
        'Suspended',
        'Open'
      ],
    },

  },

  {
    timestamps: true,
  }
);

// we create the data schema model for mongoose
const Offer = mongoose.model('Offer', OfferSchema);
module.exports = Offer;
