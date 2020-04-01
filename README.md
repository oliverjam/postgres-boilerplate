# Postgres Node Boilerplate

This is a shell to show how I'd structure a minimal Node app with a Postgres database.

## Local databases

### Development database

Create a new user:

```sh
psql -c "CREATE USER myuser WITH PASSWORD 'mypassword'"
```

then make that user a "superuser" (with access to all tables you end up creating):

```sh
psql -c "ALTER USER myuser WITH SUPERUSER"
```

then create a new database owned by that user:

```sh
psql -c "CREATE DATABASE mydatabase WITH OWNER myuser"
```

There is an `example.env` file in the root of the project. You can rename this to `.env` and change the values to your own local database and user.

### Testing database

If you want to test your database locally you should create a separate test database:

```sh
psql -c CREATE DATABASE mytestdatabase
```

then make the same user the owner:

```sh
psql -c ALTER OWNER DATABASE mytestdatabase OWNER TO myuser
```

Then update the test script in the `package.json` to set the `PGNAME` environment variable to the name of your test database:

```json
{
  "test": "PGNAME=mytestdatabase tape **/*.test.js | tap-spec"
}
```

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

`node-postgres` will use sensible default values to connect to a database, so we only need to set certain values as environment variables. Our `.env` should contain the database name and user credentials for our local development database.

If we want to connect to a completely new database (e.g. a remote one on Heroku) we can pass a `connectionString` property in the `pg.Pool` options object. This is a URL that looks like `postgres://username:password.somedomain.com:5432/databasename`. It's the same environment variables but all set in one go.

Heroku will set an environment variable named `DATABASE_URL`, which will be a connection string like the one above. So we can pass that to `pg.Pool`: if the environment variable is defined `pg` will use it, otherwise it'll fall back to your local database.

### `database/build.js`

Exports a function that rebuilds the database from scratch. This is useful to run before each test so you are always starting each test with fresh consistent data.

### `database/init.sql`

This SQL should create the tables for your database, and optionally insert some test data for you to develop with. This will be run every time you run the `database/build.js` function.
