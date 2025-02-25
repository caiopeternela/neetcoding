# stage 1: build stage
FROM node:18 AS builder

# set the working directory in the container to /app
WORKDIR /app

# copy package.json and package-lock.json into the working directory
COPY package*.json ./

# install any needed packages specified in package.json
RUN npm install

# bundle app source inside the docker image
COPY . .

# build the app
RUN npm run build

# stage 2: production stage
FROM node:18

# install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# set the working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install only production dependencies
RUN npm install --only=production

# copy built app from the builder stage
COPY --from=builder /app/dist ./dist

# make port 3000 available to the world outside this container
EXPOSE 3000

# define the command to run your app using CMD which defines your runtime
CMD [ "npm", "run", "serve" ]
