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
      cost,
      duration,
      length
    }
  }

`;

const GET_ACTORS_BY_FILM = gql`
  query getActorsByFilm($filmName: String){
    actorsFromFilm (filmName: $filmName){
    first_name
    last_name
  }
 }
`;

export {GET_ACTORS, GET_FILMS, GET_ACTORS_BY_FILM}
