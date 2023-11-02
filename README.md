# Express and TypeORM API with TypeScript and PostgreSQL Database

This project serves as a practical example of how to build a RESTful API using Express.js and TypeORM with TypeScript. It showcases the implementation of these technologies for seamless interaction with a PostgreSQL database.

## Prerequisites

Before you get started, ensure you have the following prerequisites installed on your system:

- Node.js: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

- PostgreSQL (PG): Install PostgreSQL and have it running on your machine. You can download it from [postgresql.org](https://www.postgresql.org/).

- TypeScript: You should have TypeScript installed globally. If not, install it with `npm install -g typescript`.

- TypeORM: Install TypeORM globally using `npm install -g typeorm`.

- Prettier: You can use Prettier for code formatting. Install it with `npm install -g prettier`.

## Getting Started

1. Clone this repository to your local machine.
2. Install project dependencies: `npm install`.
3. Configure the environment by creating a .env file in the project root. Define the following environment variables:
  
    - DB_HOST= your-database-host
    - DB_PORT= your-database-port
    - DB_USERNAME= your-database-username
    - DB_PASSWORD= your-database-password
    - DB_DATABASE= your-database-name
4. Run the application: `npm start`.
5. open `http://localhost:8000/`.
6. use curl, postman or other tools to send http requests to test your typeorm-based API5. 


## How to use CLI?

1. install `typeorm` globally: `npm i -g typeorm`
2. run `typeorm -h` to show list of available commands
