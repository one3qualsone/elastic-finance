FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Install serve for static file serving
RUN npm install -g serve

# Copy configuration files
COPY jsconfig.json next.config.js postcss.config.js tailwind.config.js ./

# Copy scripts directory
COPY scripts ./scripts/

# Create necessary directories for images
RUN mkdir -p public/images/learn

# Generate placeholder images
RUN node scripts/setup-images.js

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Use serve to serve static files instead of next start
CMD ["serve", "-s", "out", "-p", "3000"]