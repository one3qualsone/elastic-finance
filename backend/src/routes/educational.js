const express = require('express');
const router = express.Router();
const educationalController = require('../controllers/educationalController');

/**
 * @route GET /api/educational-content
 * @desc Get a list of all available educational content
 */
router.get('/', educationalController.getContentList);

/**
 * @route GET /api/educational-content/:slug
 * @desc Get educational content by slug
 */
router.get('/:slug', educationalController.getContentBySlug);

/**
 * @route GET /api/educational-content/file/:filename
 * @desc Get educational content by filename
 */
router.get('/file/:filename', educationalController.getContentByFilename);

module.exports = router;