# CodeChain Explorer [![Gitter](https://badges.gitter.im/CodeChain-io/codechain-explorer.svg)](https://gitter.im/CodeChain-io/codechain-explorer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Build Status](https://travis-ci.org/CodeChain-io/codechain-explorer.svg?branch=master)](https://travis-ci.org/CodeChain-io/codechain-explorer)

CodeChain explorer is a simple, easy to use, an open-source visualization tool for viewing activity on the underlying blockchain network.

## Table of Contents

- [Install](https://github.com/CodeChain-io/codechain-explorer#install)
- [Running for development](https://github.com/CodeChain-io/codechain-explorer#running-for-development)
- [Running for production](https://github.com/CodeChain-io/codechain-explorer#running-for-production)

## Install

#### Requirements

The following are the software dependencies required to install and run CodeChain-explorer:

- Nodejs v10.4.1
- Yarn v1.9.2

#### Download

Download CodeChain-explorer code from the GitHub repository

```
# git clone git@github.com:kodebox-io/codechain-explorer.git
# cd codechain-explorer
```

#### Install package

Use yarn package manager to install packages

```
# yarn install
```

## Before start

#### Dependency

- Get CodeChain-indexer ready for indexing block data

#### Processor description

- Server

  - Restful API server for getting data from DB

- Client

  - Client developed by react framework

## Running for development

#### Running server, client at once

- Explorer will run at http://localhost:3000

```
# yarn run start

// You can chage the port of test server and the host URL with environment variables.
# PORT=3000 CODECHAIN_HOST=http://52.79.108.1:8080 ELASTICSEARCH_HOST=http://127.0.0.1:9200 REACT_APP_SERVER_HOST=http://127.0.0.1:8081 yarn run start
```

## Running for production

#### Before start

- Get CodeChain-indexer ready for indexing block data

### Running order

1. Server

2. Client

### Server

Run CodeChain-explorer server

```
# yarn run start-server

// You can change ElasticSearch and CodeChain host URL using an environment variables.
# CODECHAIN_HOST=http://52.79.108.1:8080 ELASTICSEARCH_HOST=http://127.0.0.1:9200 yarn run start-server
```

### Build

Build CodeChain-explorer with following script. You can get optimized, uglified build code. It will locate at "/build" directory

```
# yarn run build
```

- You can change the server host using an environment variable

```
# REACT_APP_SERVER_HOST=http://127.0.0.1:8080 yarn run build
```

### Serve static build file

It start the static server serving build directory.

```
# yarn run serve

//You can change the port using an environment variable
# SERVE_PORT=8080 yarn run serve
```

## Custom Configuration

#### Server

|                    | Default               | Options | Description |
| ------------------ | --------------------- | ------- | ----------- |
| CODECHAIN_HOST     | http://127.0.0.1:8080 |         |             |
| ELASTICSEARCH_HOST | http://127.0.0.1:9200 |         |             |
| SERVER_PORT        | 8081                  |         |             |

#### Client Build

|                               | Default               | Options | Description                     |
| ----------------------------- | --------------------- | ------- | ------------------------------- |
| REACT_APP_SERVER_HOST         | http://127.0.0.1:8081 |         |                                 |
| REACT_APP_URL                 |                       |         | This is used for the open graph |
| REACT_APP_GOOGLE_ANALYTICS_ID |                       |         |                                 |

#### Client Serve

|            | Default | Options | Description |
| ---------- | ------- | ------- | ----------- |
| SERVE_PORT | 5000    |         |             |
