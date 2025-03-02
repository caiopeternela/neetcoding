# stage 1: build stage
FROM node:18 AS builder

# set the working directory
WORKDIR /app

# copy package*.json files
COPY package*.json ./

# install all dependencies
RUN npm install

# copy other source code files
COPY . .

# build the app
RUN npm run build

# stage 2: production stage
FROM node:18

# set the working directory
WORKDIR /app

# copy package*.json files
COPY package*.json ./

# install only production dependencies
RUN npm install --only=production

# copy built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# expose the listening port
EXPOSE 3000

# run the app
CMD ["npm", "start"]
