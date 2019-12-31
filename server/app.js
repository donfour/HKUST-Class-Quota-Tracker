// module dependencies
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

// constants
const MONGODB_URL = process.env.MONGODB_URL_READ_ONLY;
const PORT = 4000;

// setup
const app = express();

// allow cors
app.use(cors());

app.use('/graphql', graphqlHTTP(req => ({
    schema,
    graphiql: true, // GUI for testing graphql server
    rootValue: { db: req.app.locals.db } // inject db into parent object in the resolve function
})));

MongoClient.connect(MONGODB_URL) // connect to db, then start server
  .catch(err => console.error(err.stack))
  .then(client => {
    app.locals.db = client.db('hkust_class_quota');
    app.listen(PORT, () => {
        console.log(`Now listening for requests on port ${PORT}`);
     });
  });