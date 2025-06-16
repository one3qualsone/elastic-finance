# Elastic Finance

Live site:
https://valueinvesting.oneequalsone.uk/

A finance website built with Next.js, Tailwind CSS, and the Yahoo Finance API to help analyze investment opportunities according to value investing principles.

## Features

- **Educational Content**: Learn about value investing principles based on Warren Buffett's strategies
- **Stock Analysis**: Track and analyze stocks using fundamental metrics
- **Financial Data Visualization**: Interactive charts to visualize stock performance and financial metrics
- **Value Investing Scores**: Get a bullish/bearish rating (1-10) based on value investing principles
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, React
- **Backend**: Node.js, Express
- **Data Visualization**: Chart.js for financial charts
- **API Integration**: Yahoo Finance API (via yahoo-finance2)
- **Containerization**: Docker and Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/one3qualsone/elastic-finance.git
   cd elastic-finance
   ```

2. Create environment files:
   ```bash
   # Backend .env
   echo "PORT=4000
   NODE_ENV=production
   CACHE_TTL=900
   CORS_ORIGIN=http://localhost:3000" > backend/.env

   # Frontend .env
   echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > frontend/.env
   ```

3. Start the application with Docker Compose:
   ```bash
   docker-compose up
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## Development

### Running in Development Mode (without Docker)

```bash
# Start backend
cd backend
npm install
npm run dev

# Start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## Using the Yahoo Finance API

The project uses the `yahoo-finance2` npm package, which doesn't require an API key. It works by making request to Yahoo Finance's public endpoints.

Benefits of using yahoo-finance2:
- No API key required
- No rate limiting concerns (though we still implement caching for performance)
- Provides comprehensive financial data

## Educational Content

The educational section provides comprehensive guides on:

- Trading Fundamentals
- Value Investing Principles
- Bond Analysis
- Financial Ratio Analysis
- Stock Valuation Techniques

## Project Structure

```
elastic-finance/
├── backend/              # Express server
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── index.js      # Entry point
├── frontend/             # Next.js application
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── docs/                 # Educational markdown files
└── docker-compose.yml    # Docker configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
