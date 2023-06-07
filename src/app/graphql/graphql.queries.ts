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

const GET_PAST_RENTALS = gql`
  query getPastRentals($customer_id: Int){
    pastRentals(customer_id: $customer_id){
      title
    }
  }
`;


const GET_ACTIVE_RENTALS = gql`
  query getActiveRentalsForUser($customer_id: Int){
    activeRentals(customer_id: $customer_id){
      title
    }
  }
`;


export { GET_ACTORS, GET_FILMS, GET_ACTORS_BY_FILM, GET_PAST_RENTALS, GET_ACTIVE_RENTALS }
