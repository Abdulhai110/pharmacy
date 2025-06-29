# Use official Node image
FROM node:18

WORKDIR /app

# Copy only package files first for layer caching
COPY package*.json ./

# Install only production deps
RUN npm install

# Copy rest of the code
COPY . .

# Build the TypeScript code
RUN npm run build

EXPOSE 8000

# Run compiled app
CMD ["npm", "start"]
