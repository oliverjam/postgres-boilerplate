# Postgres Node Boilerplate

This is a shell to show how I'd structure a minimal Node app with a Postgres database.

## Local databases

### Development database

Type `psql` in your terminal to enter the Postgres CLI. Then run the following SQL to create a new user, development DB and test DB:

```sql
CREATE USER myuser WITH PASSWORD 'mypassword';
ALTER USER myuser WITH SUPERUSER;
CREATE DATABASE mydatabase WITH OWNER myuser;
CREATE DATABASE mytestdatabase WITH OWNER myuser;
```

You can change the user and database names to match your project.

There is an `example.env` file in the root of the project. You can rename this to `.env` and change the URLs to match your own local databases and user.

## Running locally

1. Clone the repo
1. Run `npm install` to install dependencies
1. Run `npm run dev` to start the development server
1. Run `npm test` to run the tests

## Project structure

The root of the project contains all the configuration files. All of the application code lives inside of `src/`.

### `server.js`

Creates an HTTP server running on the `PORT` environment variable (or `3000` if one isn't set, e.g. locally). The server handles requests with the `router.js` function.

### `router.js`

The HTTP server calls this function on every request. It is solely responsible for routing: it checks the URL of the request and calls the correct handler function for that endpoint.

### `handlers.js`

Each handler function "handles" a request for a specific URL. They manage the general application logic and determine how to respond. They can access the database using the `model.js` functions. They also create the HTTP response (setting the status code, headers and response body).

### `model.js`

Each model function should handle only data access. We want to keep this separate from our application logic so that each bit of our app has a single responsibility. This also means the model is the only place with database specific code—if we decided to switch our app from PostgreSQL to MongoDB this should be the only bit of the server we need to change. This also means we can test our data access without running the whole server.

### `database/connection.js`

Creates a `node-postgres` "pool" of query clients. We can use this to send database queries to select/insert/update data in our database. This object is exported so we can use it elsewhere in our app.

We tell `node-postgres` which database to connect to with the `connectionString` option. Our `.env` should contain the local dev and test URLs to be used here.

If you deploy to Heroku it will set an environment variable named `DATABASE_URL` for your deployed production server. Since we're already using the same environment variable for our local DB the app should pick up the Heroku DB URL and use that in production.

### `database/build.js`

Exports a function that rebuilds the database from scratch. This is useful to run before each test so you are always starting each test with fresh consistent data. You can also run the file directly if you want to rebuild your dev database with:

```sh
node src/database/build.js
```

### `database/init.sql`

This SQL should create the tables for your database, and optionally insert some test data for you to develop with. This will be run every time you run the `database/build.js` function.
