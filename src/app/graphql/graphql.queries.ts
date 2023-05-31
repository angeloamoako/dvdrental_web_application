import {gql} from 'apollo-angular'

const GET_ACTORS = gql`
  query {
    actors{
    first_name
    }
  }
`

const GET_FILMS = gql`
  query{
    films{
      title,
      release_year,
      rating,
      genre,
      language,
      cost
    }
  }

`

export {GET_ACTORS, GET_FILMS}
