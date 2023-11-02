# Express and TypeORM API with TypeScript

This project is an example of using Express.js and TypeORM with TypeScript to create a RESTful API. It demonstrates the setup and usage of these technologies.

## Prerequisites

Before you get started, ensure you have the following prerequisites installed on your system:

- Node.js: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

- PostgreSQL (PG): Install PostgreSQL and have it running on your machine. You can download it from [postgresql.org](https://www.postgresql.org/).

- TypeScript: You should have TypeScript installed globally. If not, install it with `npm install -g typescript`.

- TypeORM: Install TypeORM globally using `npm install -g typeorm`.

- Prettier: You can use Prettier for code formatting. Install it with `npm install -g prettier`.

## Getting Started

1. Clone this repository to your local machine.
2. 


# Project use Express and TypeORM with TypeScript and PG

1. clone repository 
2. run `npm i`
3. edit `data-source.json` and change your database configuration (you can also change a database type, but don't forget to install specific database drivers)
4. run `npm start`
5. open `http://localhost:3000/posts` and you'll empty array
6. use curl, postman or other tools to send http requests to test your typeorm-based API

## How to use CLI?

1. install `typeorm` globally: `npm i -g typeorm`
2. run `typeorm -h` to show list of available commands