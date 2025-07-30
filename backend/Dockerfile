FROM node:24-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and service account key
COPY . .

# Expose port
EXPOSE 3001

CMD ["npm", "start"]
