const { isAuth } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/files.middleware');
const {
   createExperience
} = require('../controllers/experience.controllers');

const express = require('express');
const ExperienceRoutes = express.Router();

ExperienceRoutes.post('/create', createExperience);


module.exports = ExperienceRoutes;
