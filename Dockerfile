# Use minideb instead of alpine since some modules use native binary not supported in alpine
FROM node:12-slim
WORKDIR /code

# Copy package.json and lock file to install dependencies
COPY package.json yarn.lock /code/

# Install dependencies
RUN yarn install && yarn cache clean

# Copy codechain indexer
COPY . /code

RUN ./scripts/build-preset/busan-waterworks.sh

RUN rm -r node_modules

RUN yarn global add serve

# Run server
CMD PORT=3001 serve build
