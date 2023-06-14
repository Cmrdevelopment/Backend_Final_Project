const mongoose = require('mongoose');


const ExperienceSchema = new mongoose.Schema(
  {
    // Empresa donde se trabajó
    workedWith: {
      type: String,
      required: true,
    },

    //Tiempo
    duration: {
      type: Number,
      required: true,
    },
    
    //Tecnologías con las que se trabajó en la experiencia laboral
    technologies: { type: String },

    // Descripcion
    description: {
      type: String,
      required: true,
    },

    //Imagen ¿Sería necesario? consultar con el equipo.
    image: {
      type: String,
      required: true,
    },

  },

  {
    timestamps: true,
  }
);

// we create the data schema model for mongoose
const Experience = mongoose.model('Experience', ExperienceSchema);
module.exports = Experience;
