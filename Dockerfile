# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# # Build the TypeScript code
# RUN npm run build

# Expose port 3002 for the app to listen on
EXPOSE 3002

# Command to run the application
CMD ["npm", "start"]
