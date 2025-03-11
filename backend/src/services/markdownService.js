// backend/src/services/markdownService.js
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

// Path to the educational content files
const CONTENT_PATH = path.join(config.docsPath, 'educational');

/**
 * Get a list of all available educational content files
 * @returns {Promise<Array>} List of available content files
 */
const getContentList = async () => {
  try {
    const files = await fs.readdir(CONTENT_PATH);
    
    // Filter and format the content list
    const contentList = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file
          .replace('.md', '')
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9-]/g, '')
          .toLowerCase();
        
        return {
          slug,
          filename: file,
          title: file.replace('.md', '').replace(/-/g, ' ')
        };
      });
    
    return contentList;
  } catch (error) {
    console.error('Error reading content directory:', error);
    throw new Error('Failed to get content list');
  }
};

/**
 * Get content of a markdown file by slug
 * @param {string} slug - Slug identifier for the content
 * @returns {Promise<string>} Content of the markdown file
 */
const getContentBySlug = async (slug) => {
  try {
    // Get content map
    const contentList = await getContentList();
    const contentItem = contentList.find(item => item.slug === slug);
    
    if (!contentItem) {
      throw new Error(`Content not found for slug: ${slug}`);
    }
    
    // Read the markdown file
    const filePath = path.join(CONTENT_PATH, contentItem.filename);
    const content = await fs.readFile(filePath, 'utf-8');
    
    return content;
  } catch (error) {
    console.error(`Error fetching content for ${slug}:`, error);
    throw new Error(`Failed to fetch content for ${slug}`);
  }
};

/**
 * Get content of a markdown file by filename
 * @param {string} filename - Filename of the markdown file
 * @returns {Promise<string>} Content of the markdown file
 */
const getContentByFilename = async (filename) => {
  try {
    // Read the markdown file
    const filePath = path.join(CONTENT_PATH, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    
    return content;
  } catch (error) {
    console.error(`Error fetching content for ${filename}:`, error);
    throw new Error(`Failed to fetch content for ${filename}`);
  }
};

module.exports = {
  getContentList,
  getContentBySlug,
  getContentByFilename
};