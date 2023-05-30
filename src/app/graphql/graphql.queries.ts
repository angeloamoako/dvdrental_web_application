import {gql} from 'apollo-angular'

const GET_ACTORS = gql`
  query {
    actors{
    first_name
    }
  }
`

export {GET_ACTORS}
