# Stage 1: Build the NestJS application
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Build the application
RUN npm run build

# Stage 2: Setup the production environment
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy built assets from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Install production dependencies
COPY package*.json ./

RUN npm install --only=production

VOLUME [ "/download", "/config"]

# If you are building your code for production
# RUN npm ci --only=production

# Bind the port that the app runs on
EXPOSE 9999

# Run the application
CMD ["node", "dist/main"]
