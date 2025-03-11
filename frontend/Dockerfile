FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy configuration files
COPY jsconfig.json next.config.js postcss.config.js tailwind.config.js ./

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Use a more reliable way to run Next.js
CMD ["node_modules/.bin/next", "start"]