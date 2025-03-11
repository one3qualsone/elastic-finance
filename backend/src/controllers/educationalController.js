const markdownService = require('../services/markdownService');

/**
 * Get a list of all available educational content
 */
exports.getContentList = async (req, res, next) => {
  try {
    const contentList = await markdownService.getContentList();
    res.json(contentList);
  } catch (error) {
    next(error);
  }
};

/**
 * Get educational content by slug
 */
exports.getContentBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ error: 'Slug parameter is required' });
    }
    
    const content = await markdownService.getContentBySlug(slug);
    res.type('text/markdown').send(content);
  } catch (error) {
    if (error.message.includes('Content not found')) {
      return res.status(404).json({ error: 'Content not found' });
    }
    next(error);
  }
};

/**
 * Get educational content by filename
 */
exports.getContentByFilename = async (req, res, next) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename parameter is required' });
    }
    
    const content = await markdownService.getContentByFilename(filename);
    res.type('text/markdown').send(content);
  } catch (error) {
    if (error.message.includes('Failed to fetch content')) {
      return res.status(404).json({ error: 'Content not found' });
    }
    next(error);
  }
};

