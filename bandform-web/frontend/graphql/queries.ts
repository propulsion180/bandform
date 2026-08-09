import { graphql } from "../gql";

export const GET_ME = graphql(`
  query GetMe {
    me {
      ...MeFields
    }
  }
`);

export const GET_BANDS = graphql(`
  query GetBands {
    bands {
      ...BandCardFields
    }
  }
`);

export const GET_RECOMMENDED_BANDS = graphql(`
  query GetRecommendedBands(
    $withinCity: Boolean!
    $withinCountry: Boolean!
    $sameGenre: Boolean!
    $locGenreWeight: Int!
  ) {
    recommendBand(
      withinCity: $withinCity
      withinCountry: $withinCountry
      sameGenre: $sameGenre
      locGenreWeight: $locGenreWeight
    ) {
      ...BandCardFields
    }
  }
`);

export const GET_BAND = graphql(`
  query GetBand($id: ID!) {
    band(id: $id) {
      ...BandDetailFields
    }
  }
`);

export const GET_BAND_JOIN_REQUESTS = graphql(`
  query GetBandJoinRequests($bID: ID!) {
    bandJoinRequests(bID: $bID) {
      ...BandJoinRequestFields
    }
  }
`);

export const GET_USER_JOIN_REQUESTS = graphql(`
  query GetUserJoinRequests($uID: ID!) {
    userJoinRequests(uID: $uID) {
      ...BandJoinRequestFields
      band {
        id
        name
      }
    }
  }
`);

export const GET_RECOMMENDED_USERS = graphql(`
  query GetRecommendedUsers(
    $bp: ID!
    $withinCity: Boolean!
    $withinCountry: Boolean!
    $sameGenre: Boolean!
    $singleInstrument: Boolean!
    $locGenreWeight: Int!
  ) {
    recommendUser(
      bp: $bp
      withinCity: $withinCity
      withinCountry: $withinCountry
      sameGenre: $sameGenre
      singleInstrument: $singleInstrument
      locGenreWeight: $locGenreWeight
    ) {
      ...UserCardFields
    }
  }
`);

export const GET_BAND_MESSAGES = graphql(`
  query GetBandMessages($bandId: ID!, $limit: Int, $before: ID) {
    bandMessages(bandId: $bandId, limit: $limit, before: $before) {
      ...MessageFields
    }
  }
`);

export const GET_ADMIN_USERS = graphql(`
  query GetAdminUsers {
    users {
      id
      name
      email
      role
      city
      country
      locked
    }
  }
`);

export const GET_ADMIN_BANDS = graphql(`
  query GetAdminBands {
    bands {
      id
      name
      city
      country
    }
  }
`);
