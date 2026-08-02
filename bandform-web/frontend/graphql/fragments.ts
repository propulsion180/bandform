import { graphql } from "../gql";

export const BandCardFields = graphql(`
  fragment BandCardFields on Band {
    id
    name
    city
    country
    genres {
      name
    }
    openPositions {
      id
      filled
    }
  }
`);

export const BandDetailFields = graphql(`
  fragment BandDetailFields on Band {
    id
    name
    description
    city
    country
    owner {
      id
      name
    }
    genres {
      name
    }
    members {
      id
      role
      user {
        id
        name
      }
      instruments {
        name
      }
    }
    openPositions {
      id
      description
      filled
      instrument {
        id
        name
      }
      filledBy {
        id
        name
      }
    }
  }
`);

export const BandJoinRequestFields = graphql(`
  fragment BandJoinRequestFields on JoinRequest {
    id
    status
    message
    requestedDate
    invitedByBand
    proposedRole
    user {
      id
      name
    }
    position {
      id
      instrument {
        name
      }
    }
    interestedInstruments {
      name
    }
  }
`);

export const UserCardFields = graphql(`
  fragment UserCardFields on User {
    id
    name
    city
    country
    instruments {
      name
    }
    genres {
      name
    }
  }
`);

export const MeFields = graphql(`
  fragment MeFields on User {
    id
    name
    email
    age
    city
    country
    description
    role
    status
    genres {
      name
    }
    instruments {
      name
    }
    bandMemberships {
      id
      role
      joinedDate
      band {
        id
        name
        owner {
          id
        }
      }
    }
  }
`);
