# Building an Express and TypeORM API with TypeScript and PostgreSQL Database

This project serves as a practical example of how to build a RESTful API using Express.js and TypeORM with TypeScript. It showcases the implementation of these technologies for seamless interaction with a PostgreSQL database.

## Technologies I Use
* Node.JS
* Express.JS
* TypeScript
* TypeORM
* PostgreSQL

## Prerequisites

Before you get started, ensure you have the following prerequisites installed on your system:

- ***Node.js:*** Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

- ***PostgreSQL (PG):*** Install PostgreSQL and have it running on your machine. You can download it from [postgresql.org](https://www.postgresql.org/).
  

## Getting Started

1. Clone this repository to your local machine:
  ```bash
   git clone https://github.com/Farha-Dahman/NodeJS-Project.git
  ```
2. Install project dependencies:
  ```bash
   npm install
  ```
3. Create a Postgres database and set your credentials on a `.env` file, similar to `.env.example`
4. Run the application:
  ```bash
   npm run start
  ```
5. open `http://localhost:8000/`
6. use curl, postman or other tools to send http requests to test your typeorm-based API
   
## API Documentation

The API documentation is available using Swagger. You can access it locally at [http://localhost:8000/api-docs/](http://localhost:8000/api-docs/).

## How to use CLI?

1. install `typeorm` globally: `npm i -g typeorm`
2. run `typeorm -h` to show list of available commands

### Useful commands

* running typeorm migration run `npm run migration:run`
* running typeorm create a migration from a model `npm run migration:generate src/migration/migrationName`
* running typeorm revert a migration `npm run migration:revert`
