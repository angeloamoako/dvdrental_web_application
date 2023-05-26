var express = require('express');
var router = express.Router();
const db = require('../queries')
var { buildSchema } = require("graphql")

const {graphqlHTTP} = require('express-graphql')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', db.getActors)

app = express()
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`

  type Actor{
    actor_id: Int
    first_name: String
    last_name: String
  }

  type Film {
    title: String
    release_year: String
    rating: String
    genre: String
    language: String
    cost: Float
  }

  type Query {
    hello: String
    actors: [Actor]
    films: [Film]
  }
`)

// The root provides a resolver function for each API endpoint
let root = {
  hello: () => {
    return "Hello world!"
  },

  actors: () => {
    return db.getActors();
  },

  films: () => {
    return db.getFilms();
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
