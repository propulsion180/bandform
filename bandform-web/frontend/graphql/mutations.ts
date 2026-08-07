import { graphql } from "../gql";

export const LOGIN = graphql(`
  mutation Login($name: String!, $password: String!) {
    login(name: $name, password: $password) {
      user {
        ...MeFields
      }
    }
  }
`);

export const LOGOUT = graphql(`
  mutation Logout {
    logout
  }
`);

export const SIGNUP = graphql(`
  mutation CreateUser(
    $name: String!
    $email: String!
    $plainPassword: String!
    $age: Int!
    $city: String!
    $country: String!
    $description: String!
    $genres: [String!]!
    $instruments: [String!]!
    $status: UserStatus
  ) {
    createUser(
      name: $name
      email: $email
      plainPassword: $plainPassword
      age: $age
      city: $city
      country: $country
      description: $description
      genres: $genres
      instruments: $instruments
      status: $status
    ) {
      id
      name
    }
  }
`);

export const UPDATE_USER = graphql(`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $email: String
    $age: Int
    $city: String
    $country: String
    $description: String
    $status: UserStatus
    $genres: [String!]
    $instruments: [String!]
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
      age: $age
      city: $city
      country: $country
      description: $description
      status: $status
      genres: $genres
      instruments: $instruments
    )
  }
`);

export const CHANGE_PASSWORD = graphql(`
  mutation ChangePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword)
  }
`);

export const DELETE_USER = graphql(`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`);

export const CREATE_BAND = graphql(`
  mutation CreateBand(
    $name: String!
    $description: String!
    $city: String!
    $country: String!
    $genres: [String!]!
  ) {
    createBand(
      name: $name
      description: $description
      city: $city
      country: $country
      genres: $genres
    ) {
      id
    }
  }
`);

export const UPDATE_BAND = graphql(`
  mutation UpdateBand(
    $id: ID!
    $name: String
    $description: String
    $city: String
    $country: String
    $genres: [String!]
  ) {
    updateBand(
      id: $id
      name: $name
      description: $description
      city: $city
      country: $country
      genres: $genres
    )
  }
`);

export const DELETE_BAND = graphql(`
  mutation DeleteBand($id: ID!) {
    deleteBand(id: $id)
  }
`);

export const DELETE_BAND_MEMBER = graphql(`
  mutation DeleteBandMember($bmID: ID!) {
    deleteBandMember(bmID: $bmID)
  }
`);

export const CREATE_BAND_MEMBER = graphql(`
  mutation CreateBandMember(
    $bID: ID!
    $uID: ID!
    $instrumentNames: [String]
    $role: String
  ) {
    createBandMember(
      bID: $bID
      uID: $uID
      instrumentNames: $instrumentNames
      role: $role
    ) {
      id
    }
  }
`);

export const CREATE_BAND_POSITION = graphql(`
  mutation CreateBandPosition(
    $bandId: ID!
    $instrumentName: String!
    $description: String!
  ) {
    createBandPosition(
      bandId: $bandId
      instrumentName: $instrumentName
      description: $description
    ) {
      id
    }
  }
`);

export const UPDATE_BAND_POSITION = graphql(`
  mutation UpdateBandPosition(
    $bpId: ID!
    $bId: ID
    $instrument: String
    $description: String
    $filled: Boolean
    $fillerId: ID
  ) {
    updateBandPosition(
      bpId: $bpId
      bId: $bId
      instrument: $instrument
      description: $description
      filled: $filled
      fillerId: $fillerId
    )
  }
`);

export const DELETE_BAND_POSITION = graphql(`
  mutation DeleteBandPosition($pbId: ID!) {
    deleteBandPosition(pbId: $pbId)
  }
`);

export const CREATE_JOIN_REQUEST = graphql(`
  mutation CreateJoinRequest(
    $uID: ID!
    $bID: ID!
    $bpId: ID!
    $interestedInstruments: [String!]
    $message: String
  ) {
    createJoinRequest(
      uID: $uID
      bID: $bID
      bpId: $bpId
      interestedInstruments: $interestedInstruments
      message: $message
    ) {
      id
      status
    }
  }
`);

export const INVITE_TO_BAND = graphql(`
  mutation InviteToBand(
    $bID: ID!
    $bpId: ID!
    $uID: ID!
    $proposedRole: String!
    $message: String
  ) {
    inviteToBand(
      bID: $bID
      bpId: $bpId
      uID: $uID
      proposedRole: $proposedRole
      message: $message
    ) {
      id
      status
    }
  }
`);

export const DELETE_JOIN_REQUEST = graphql(`
  mutation DeleteJoinRequest($id: ID!) {
    deleteJoinRequest(id: $id)
  }
`);

export const REJECT_JOIN_REQUEST = graphql(`
  mutation RejectJoinRequest($id: ID!) {
    reject(id: $id)
  }
`);

export const ACCEPT_JOIN_REQUEST = graphql(`
  mutation AcceptJoinRequest($id: ID!, $bandRole: String) {
    accept(id: $id, bandRole: $bandRole)
  }
`);

export const SEND_MESSAGE = graphql(`
  mutation SendMessage($bandId: ID!, $body: String!) {
    sendMessage(bandId: $bandId, body: $body) {
      ...MessageFields
    }
  }
`);

export const ISSUE_WS_TICKET = graphql(`
  mutation IssueWsTicket {
    issueWsTicket
  }
`);

export const CREATE_RANDOMIZED_BAND = graphql(`
  mutation CreateRandomizedBand(
    $yourUID: ID!
    $yourInstrument: String!
    $yourRole: String
    $name: String!
    $instruments: [String!]!
    $city: String!
    $country: String!
    $genres: [String!]!
    $description: String!
    $instrumentSearchDepth: Int!
  ) {
    randomizedBandCreator(
      yourUID: $yourUID
      yourInstrument: $yourInstrument
      yourRole: $yourRole
      name: $name
      instruments: $instruments
      city: $city
      country: $country
      genres: $genres
      description: $description
      instrumentSearchDepth: $instrumentSearchDepth
    ) {
      id
      name
      members {
        id
      }
      openPositions {
        id
      }
    }
  }
`);
