const mongoose = require('mongoose');
const Experience = require('../models/experience.model');
const User = require('../models/user.model');
//! -----------------------------------------------------------------------------
//? ---------------------------- CREATE -----------------------------------------
//! -----------------------------------------------------------------------------

const createExperience = async (req, res, next) => {
    try {
        const userId = req.params.userId; // Obtén el ID del usuario desde los parámetros de la solicitud

        // Busca al usuario por su ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Crea una nueva experiencia con los datos de la solicitud
        const newExperience = new Experience({
            workedWith: req.body.workedWith,
            duration: req.body.duration,
            technologies: req.body.technologies,
            description: req.body.description,
            image: req.body.image
        });

        // Guarda la nueva experiencia en la base de datos
        const savedExperience = await newExperience.save();

        // Agrega la experiencia al usuario
        user.experiences.push(savedExperience._id);
        await user.save();

        res.status(201).json(savedExperience);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la experiencia' });
    }
};

//! -----------------------------------------------------------------------------
//? ---------------------------- GetById -----------------------------------------
//! -----------------------------------------------------------------------------



//! -----------------------------------------------------------------------------
//? ---------------------------- GetByUser -----------------------------------------
//! -----------------------------------------------------------------------------



//! -----------------------------------------------------------------------------
//? ---------------------------- UPDATE -----------------------------------------
//! -----------------------------------------------------------------------------


//! -----------------------------------------------------------------------------
//? ---------------------------- DELETE -----------------------------------------
//! -----------------------------------------------------------------------------



module.exports = { createExperience };