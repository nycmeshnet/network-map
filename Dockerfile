# Use official Node.js 14 image as the base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create a production build
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Command to run the application (serve built files using a lightweight HTTP server like 'serve')
CMD ["npx", "serve", "-s", "build", "-l", "3000"]