# Build stage
FROM node:24-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Install http-server globally
RUN npm install -g http-server

# Copy built files from builder stage
COPY --from=builder /app/dist .

# Expose port
EXPOSE 80

# Start http-server
CMD ["http-server", ".", "-p", "80", "--gzip"]
