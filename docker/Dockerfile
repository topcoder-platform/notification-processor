# Use the base image with Node.js 10.15-jessie
FROM node:10.15-jessie

# Copy the current directory into the Docker image
COPY . /submission-notification-processor

# Set working directory for future use
WORKDIR /submission-notification-processor

# Install the dependencies from package.json
RUN npm install
CMD npm run start
