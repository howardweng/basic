# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the app's source code to the working directory
COPY . .

# Add this line to your Dockerfile
RUN mkdir -p /app/node_modules/.cache && chmod -R 777 /app/node_modules/.cache

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"] 