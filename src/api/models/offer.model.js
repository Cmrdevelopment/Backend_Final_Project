const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
  {
    // Usuarios que siguen la oferta
    owner: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },

    // Tipo de la oferta
    offerType: {
      type: String,
      enum: ["LookingForJob", "OfferMySelf"],
      required: true,
    },
    offerTitle: {
      type: String,
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
      enum: ["Remote", "Office", "Hybrid"],
      required: true,
    },

    // Tecnologías que piden en la oferta
    //technologies: { type: String, required: true },

    technologies: [
      {
        type: String,
      },
    ],

    // Años de experiencia
    //Comentario: Revisar si puede usarse el max: 100.
    experienceYears: {
      type: Number,
      min: 0,
      max: 100,
    },

    // Logo de la compañia
    image: {
      type: String,
    },

    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      required: false,
    },

    ratings: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Ratings",
      required: false,
    },

    interestedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: false,
    },

    // Estado de la Oferta
    offerState: {
      type: String,
      enum: ["Close", "Suspended", "Open"],
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

// we create the data schema model for mongoose
const Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;
