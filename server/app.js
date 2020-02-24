const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// allow CORS
app.use(cors());

mongoose.connect('mongodb://gql_ninja_box_usr1:GottGqlNinjaUsr1@ds063177.mlab.com:63177/gql-ninja-box');
mongoose.connection.once('open', () => {
	console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true,
}));

app.listen(4000, () => {
	console.log("listening at 4000");
});



