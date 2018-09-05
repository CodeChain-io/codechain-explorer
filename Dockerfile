# Use minideb instead of alpine since some modules use native binary not supported in alpine
FROM bitnami/node:10.9.0

WORKDIR /code

# Install git because we currently fetch codechain core from github
RUN apt-get update && apt-get install git

# Install yarn
RUN npm install yarn -g

# Leverage cache based on lockfile
COPY package.json yarn.lock /code/

# Install dependencies
RUN yarn

# Install codechain explorer
COPY . /code
RUN yarn

# Run server
CMD ["yarn", "run", "start"]
