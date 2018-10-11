# CodeChain Explorer [![Gitter](https://badges.gitter.im/CodeChain-io/codechain-explorer.svg)](https://gitter.im/CodeChain-io/codechain-explorer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Build Status](https://travis-ci.org/CodeChain-io/codechain-explorer.svg?branch=master)](https://travis-ci.org/CodeChain-io/codechain-explorer)

CodeChain explorer is a simple, easy to use, an open-source visualization tool for viewing activity on the underlying blockchain network.

## Table of Contents

- [Install](https://github.com/CodeChain-io/codechain-explorer#install)
- [Running for development](https://github.com/CodeChain-io/codechain-explorer#running-for-development)
- [Running for production](https://github.com/CodeChain-io/codechain-explorer#running-for-production)

## Install

### Download

Download CodeChain-explorer code from the GitHub repository

```
# git clone git@github.com:kodebox-io/codechain-explorer.git
# cd codechain-explorer
```

### Install package

Use yarn package manager to install packages

```
# yarn install
```

## Before start

### Dependency

- Get CodeChain-indexer ready for indexing block data and running the API server

### Running for development

- Explorer will run at http://localhost:3000

```
# yarn run start

// You can chage the port of test server and the host URL with environment variables.
# PORT=3000 REACT_APP_SERVER_HOST=http://127.0.0.1:8081 yarn run start
```

### Running for production

#### Build

Build CodeChain-explorer with following script. You can get optimized, uglified build code. It will locate at "/build" directory

```
# yarn run build
```

- You can change the server host using an environment variable

```
# REACT_APP_SERVER_HOST=http://127.0.0.1:8080 yarn run build
```

#### Serve static build file

It start the static server serving build directory.

```
# yarn run serve

//You can change the port using an environment variable
# SERVE_PORT=8080 yarn run serve
```

## Custom Configuration

### Build

|                               | Default               | Options | Description                     |
| ----------------------------- | --------------------- | ------- | ------------------------------- |
| REACT_APP_SERVER_HOST         | http://127.0.0.1:8081 |         |                                 |
| REACT_APP_URL                 |                       |         | This is used for the open graph |
| REACT_APP_GOOGLE_ANALYTICS_ID |                       |         |                                 |

### Serve

|            | Default | Options | Description |
| ---------- | ------- | ------- | ----------- |
| SERVE_PORT | 5000    |         |             |
