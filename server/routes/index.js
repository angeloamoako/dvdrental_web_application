var express = require('express');
var router = express.Router();
const db = require('../queries')
var { buildSchema, GraphQLObjectType, GraphQLString, GraphQLInt } = require("graphql")

const {graphqlHTTP} = require('express-graphql')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', db.getActors)

app = express()
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`


  type Query {
    hello: String
    actors: String
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return "Hello world!"
  },

  actors: () =>{
    output = [{'first_name':'Angelo'}, {'first_name':'Edoardo'}];
    return output;
  }
}

var app = express()
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")


app.listen(4000)

module.exports = router;
