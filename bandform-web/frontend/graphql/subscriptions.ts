import { graphql } from "../gql";

export const BAND_MESSAGE_ADDED = graphql(`
  subscription BandMessageAdded($bandId: ID!, $ticket: String!) {
    messageAdded(bandId: $bandId, ticket: $ticket) {
      ...MessageFields
    }
  }
`);
