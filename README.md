This project is a news website that allows posting, updating and deleting comments, voting for favourite comments and articles, and filtering articles by topic, comments by article id and users by their username.
Link to the deployed version: https://news-nc-jadwiga.herokuapp.com/

Minimum requirements:
Node: v18.1.0.
Postgress: ^8.7.3

Installation:

1. Git clone the following repo: https://github.com/JadwigaPowroznik/Backend-Project
2. Install the dependencies: npm install
3. Setup the local database: npm run setup-dbs
4. Seed the database: npm run seed
5. Run the test: npm test
6. Start the server listening: npm start

Developer has to create the environment variebles to connect to a database using dotenv package. There should be two files created - .env.test and .env.development. They allow to connect to a database on different routes - test or development. It helps to aviod unnecessary updates to a database while running tests. The database is re-seeded before each test so any updates to a database are 'cancelled'. The development route allows for changes to be present (no reseeding) so client can interact with the app.

To interact with a database and to create the environment variables follow the steps below:

1. install node-postgres ( npm install pg),
2. create API pg.Pool - access pg documentation for steup info,
3. install dotenv package (npm install dotenv),
4. create 2 files: .env.test and .env.development and include the following information in both files (note that test database should be different to development database)
   PGDATABASE=db_name <-- for development file  
   PGDATABASE=db_name_test <-- for test file
   Optional info to be included in both files:
   PGUSER=username
   PGPASSWORD=password
