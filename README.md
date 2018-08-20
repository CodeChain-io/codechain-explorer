# CodeChain Explorer [![Gitter](https://badges.gitter.im/CodeChain-io/codechain-explorer.svg)](https://gitter.im/CodeChain-io/codechain-explorer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

CodeChain explorer is a simple, easy to use, an open-source visualization tool for viewing activity on the underlying blockchain network.

## Table of Contents
* [Install](https://github.com/CodeChain-io/codechain-explorer#install)
* [Running for development](https://github.com/CodeChain-io/codechain-explorer#running-for-development)
* [Build for production](https://github.com/CodeChain-io/codechain-explorer#running-for-production)

## Install
### Requirements
The following are the software dependencies required to install and run CodeChain-explorer:
* [CodeChain](https://github.com/CodeChain-io/codechain) version of commit [`91fa82`](https://github.com/CodeChain-io/codechain/commit/91fa82814106e92bf2cf1f31e0a48b3737febe│aDataMappingService)
* Nodejs v10.4.1
* ElasticSearch v6.2.4
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
## Running for development
### Before start
* Get CodeChain ready with CodeChain RPC server
* Get ElasticSearch database ready for indexing block data
### Running order
1. Worker
- Data synchronizing tool between CodeChain and ElasticSearch
2. Server
- Restful API server for getting data from DB
3. Client
- Client developed by react framework
### Worker
Run CodeChain-worker for indexing data to ElasticSearch
```
# yarn run start-worker

// You can change ElasticSearch and CodeChain host URL using an environment variables.
# CODECHAIN_HOST=127.0.0.1:8080 ELASTICSERACH_HOST=127.0.0.1:9200 yarn run start-worker
```
### Server
Run CodeChain-explorer server
```
# yarn run start-server

// You can change ElasticSearch and CodeChain host URL using an environment variables.
# CODECHAIN_HOST=127.0.0.1:8080 ELASTICSERACH_HOST=127.0.0.1:9200 yarn run start-server
```
### Client
Run CodeChain-explorer client in development mode
```
# yarn run start-client

// You can change the server host using an environment variable
# REACT_APP_SERVER_HOST=127.0.0.1:8080 yarn run start-client
```
### Running worker, server, client at once
```
# yarn run start

// You can chage each host URL with environment variables.
# CODECHAIN_HOST=127.0.0.1:8080 ELASTICSERACH_HOST=127.0.0.1:9200 REACT_APP_SERVER_HOST=127.0.0.1:8081 yarn run start
```
## Running for production
### Build
Build CodeChain-explorer with following script. You can get optimized, uglified build code. It will locate at "/build" directory
```
# yarn run build
```
* You can change the server host using an environment variable
```
# REACT_APP_SERVER_HOST=127.0.0.1:8080 yarn run build
```
## Tools
### Delete all indices in the elasticsearch
```
# yarn run clear-index
```
