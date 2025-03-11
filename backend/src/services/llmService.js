// backend/src/services/llmService.js
const axios = require('axios');

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Analyze news sentiment for a stock
 * @param {string} symbol - Stock symbol
 * @param {Array} newsItems - Recent news articles about the stock
 * @returns {Promise<Object>} Sentiment analysis and score
 */
const analyzeNewsSentiment = async (symbol, newsItems) => {
  try {
    // Prepare news content for analysis
    const newsContent = newsItems
      .map(item => `Title: ${item.title}\nDate: ${item.date}\n`)
      .join('\n');
    
    // Create prompt for the LLM
    const prompt = `
You are a financial analyst expert in stock market sentiment analysis.
Please analyze the sentiment in these recent news articles about ${symbol}:

${newsContent}

Provide an analysis of the overall sentiment toward ${symbol} based on these articles.
Rate the sentiment on a scale of 1-10 where:
1-3: Bearish (negative)
4-6: Neutral
7-10: Bullish (positive)

Format your response as a JSON object with these fields:
- sentiment_score: [number between 1-10]
- analysis: [concise analysis of the sentiment in 2-3 sentences]
- key_factors: [array of up to 3 key factors affecting sentiment]
    `;

    // Make request to OpenAI API
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a financial analyst expert who provides objective analysis in JSON format only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Low temperature for more consistent responses
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // Parse the response
    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing news sentiment:', error);
    // Return default neutral sentiment if there's an error
    return {
      sentiment_score: 5,
      analysis: "Unable to analyze sentiment due to an error.",
      key_factors: ["Error in analysis"]
    };
  }
};

module.exports = {
  analyzeNewsSentiment
};