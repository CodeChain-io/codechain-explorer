# CodeChain Explorer [![Gitter](https://badges.gitter.im/CodeChain-io/codechain-explorer.svg)](https://gitter.im/CodeChain-io/codechain-explorer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

CodeChain explorer is a simple, easy to use, an open-source visualization tool for viewing activity on the underlying blockchain network.

## Table of Contents

- [Install](https://github.com/CodeChain-io/codechain-explorer#install)
- [Running for development](https://github.com/CodeChain-io/codechain-explorer#running-for-development)
- [Running for production](https://github.com/CodeChain-io/codechain-explorer#running-for-production)

## Install

#### Requirements

The following are the software dependencies required to install and run CodeChain-explorer:

- [CodeChain](https://github.com/CodeChain-io/codechain) version of commit [`a47061`](https://github.com/CodeChain-io/codechain/commit/a47061089ac93c238a97c49aa430adec9e1c5c52)
- ElasticSearch [`v6.2.4`](https://www.elastic.co/guide/en/beats/libbeat/6.2/elasticsearch-installation.html)
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

- Get CodeChain ready with CodeChain RPC server
- Get ElasticSearch database ready for indexing block data

#### Processor description

- Worker

  - Data synchronizing tool between CodeChain and ElasticSearch

- Server

  - Restful API server for getting data from DB

- Client

  - Client developed by react framework

## Running for development

#### Running worker, server, client at once

- Explorer will run at http://localhost:3000
- Static file server will run at http://localhost:5000 internally for serving asset images

```
# yarn run start

// You can chage the port of test server and the host URL with environment variables.
# PORT=3000 CODECHAIN_CHAIN=husky CODECHAIN_HOST=http://52.79.108.1:8080 ELASTICSEARCH_HOST=http://127.0.0.1:9200 REACT_APP_SERVER_HOST=http://127.0.0.1:8081 yarn run start
```

## Running for production

#### Before start

- Get CodeChain ready with CodeChain RPC server
- Get ElasticSearch database ready for indexing block data

### Running order

1. Worker

2. Server

3. Client

### Worker

Run CodeChain-worker for indexing data to ElasticSearch

```
# yarn run start-worker

// You can change ElasticSearch and CodeChain host URL using an environment variables.
# CODECHAIN_CHAIN=huksy CODECHAIN_HOST=http://52.79.108.1:8080 ELASTICSEARCH_HOST=http://127.0.0.1:9200 yarn run start-worker
```

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

## Tools

#### Delete all indices in the elasticsearch

```
# yarn run clear
```

## Custom Configuration

#### Worker

|                    | Default               | Options     | Description |
| ------------------ | --------------------- | ----------- | ----------- |
| CODECHAIN_HOST     | http://127.0.0.1:8080 |             |             |
| ELASTICSEARCH_HOST | http://127.0.0.1:9200 |             |             |
| CODECHAIN_CHAIN    | solo                  | solo, husky |             |

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
