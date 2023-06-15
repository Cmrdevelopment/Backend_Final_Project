const mongoose = require('mongoose');
const Experience = require('../models/experience.model');
const User = require('../models/user.model');
//! -----------------------------------------------------------------------------
//? ---------------------------- CREATE -----------------------------------------
//! -----------------------------------------------------------------------------

const createExperience = async (req, res) => {
  
    let cathImg = req.file?.path
    try {
   
    const experienceBody = {
      workedWith: req.body.workedWith,
      duration: req.body.duration,
      technologies: req.body.technologies,
      description: req.body.description,
      image: cathImg,
    };
    console.log(experienceBody);
    const newExperience = new Experience(experienceBody);
    try {
        const savedExperience = await newExperience.save();
        if (savedExperience){
            try {
                await User.findByIdAndUpdate(req.user._id, {
                    $push:{experience:newExperience._id}
                })
            return res.status(200).json(newExperience);

            } catch (error) {
                return res.status(404).json("Error updating user experience")
            }
        } else {
            return res.status(404).json("Error creating experience")
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json('Error saving experience')
    }
    
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

//! -----------------------------------------------------------------------------
//? ---------------------------- GetAll -----------------------------------------
//! -----------------------------------------------------------------------------



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