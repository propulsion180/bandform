/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment BandCardFields on Band {\n    id\n    name\n    city\n    country\n    genres {\n      name\n    }\n    openPositions {\n      id\n      filled\n    }\n  }\n": typeof types.BandCardFieldsFragmentDoc,
    "\n  fragment BandDetailFields on Band {\n    id\n    name\n    description\n    city\n    country\n    owner {\n      id\n      name\n    }\n    genres {\n      name\n    }\n    members {\n      id\n      role\n      user {\n        id\n        name\n      }\n      instruments {\n        name\n      }\n    }\n    openPositions {\n      id\n      description\n      filled\n      instrument {\n        id\n        name\n      }\n      filledBy {\n        id\n        name\n      }\n    }\n  }\n": typeof types.BandDetailFieldsFragmentDoc,
    "\n  fragment BandJoinRequestFields on JoinRequest {\n    id\n    status\n    message\n    requestedDate\n    invitedByBand\n    proposedRole\n    user {\n      id\n      name\n    }\n    position {\n      id\n      instrument {\n        name\n      }\n    }\n    interestedInstruments {\n      name\n    }\n  }\n": typeof types.BandJoinRequestFieldsFragmentDoc,
    "\n  fragment UserCardFields on User {\n    id\n    name\n    city\n    country\n    instruments {\n      name\n    }\n    genres {\n      name\n    }\n  }\n": typeof types.UserCardFieldsFragmentDoc,
    "\n  fragment MessageFields on Message {\n    id\n    body\n    sentAt\n    sender {\n      id\n      name\n    }\n  }\n": typeof types.MessageFieldsFragmentDoc,
    "\n  fragment MeFields on User {\n    id\n    name\n    email\n    age\n    city\n    country\n    description\n    role\n    status\n    genres {\n      name\n    }\n    instruments {\n      name\n    }\n    bandMemberships {\n      id\n      role\n      joinedDate\n      band {\n        id\n        name\n        owner {\n          id\n        }\n      }\n    }\n  }\n": typeof types.MeFieldsFragmentDoc,
    "\n  mutation Login($name: String!, $password: String!) {\n    login(name: $name, password: $password) {\n      user {\n        ...MeFields\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  mutation CreateUser(\n    $name: String!\n    $email: String!\n    $plainPassword: String!\n    $age: Int!\n    $city: String!\n    $country: String!\n    $description: String!\n    $genres: [String!]!\n    $instruments: [String!]!\n    $status: UserStatus\n  ) {\n    createUser(\n      name: $name\n      email: $email\n      plainPassword: $plainPassword\n      age: $age\n      city: $city\n      country: $country\n      description: $description\n      genres: $genres\n      instruments: $instruments\n      status: $status\n    ) {\n      id\n      name\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation UpdateUser(\n    $id: ID!\n    $name: String\n    $email: String\n    $age: Int\n    $city: String\n    $country: String\n    $description: String\n    $status: UserStatus\n    $genres: [String!]\n    $instruments: [String!]\n  ) {\n    updateUser(\n      id: $id\n      name: $name\n      email: $email\n      age: $age\n      city: $city\n      country: $country\n      description: $description\n      status: $status\n      genres: $genres\n      instruments: $instruments\n    )\n  }\n": typeof types.UpdateUserDocument,
    "\n  mutation ChangePassword($newPassword: String!) {\n    changePassword(newPassword: $newPassword)\n  }\n": typeof types.ChangePasswordDocument,
    "\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id)\n  }\n": typeof types.DeleteUserDocument,
    "\n  mutation UnlockUser($id: ID!) {\n    unlockUser(id: $id)\n  }\n": typeof types.UnlockUserDocument,
    "\n  mutation CreateBand(\n    $name: String!\n    $description: String!\n    $city: String!\n    $country: String!\n    $genres: [String!]!\n  ) {\n    createBand(\n      name: $name\n      description: $description\n      city: $city\n      country: $country\n      genres: $genres\n    ) {\n      id\n    }\n  }\n": typeof types.CreateBandDocument,
    "\n  mutation UpdateBand(\n    $id: ID!\n    $name: String\n    $description: String\n    $city: String\n    $country: String\n    $genres: [String!]\n  ) {\n    updateBand(\n      id: $id\n      name: $name\n      description: $description\n      city: $city\n      country: $country\n      genres: $genres\n    )\n  }\n": typeof types.UpdateBandDocument,
    "\n  mutation DeleteBand($id: ID!) {\n    deleteBand(id: $id)\n  }\n": typeof types.DeleteBandDocument,
    "\n  mutation DeleteBandMember($bmID: ID!) {\n    deleteBandMember(bmID: $bmID)\n  }\n": typeof types.DeleteBandMemberDocument,
    "\n  mutation CreateBandMember(\n    $bID: ID!\n    $uID: ID!\n    $instrumentNames: [String]\n    $role: String\n  ) {\n    createBandMember(\n      bID: $bID\n      uID: $uID\n      instrumentNames: $instrumentNames\n      role: $role\n    ) {\n      id\n    }\n  }\n": typeof types.CreateBandMemberDocument,
    "\n  mutation CreateBandPosition(\n    $bandId: ID!\n    $instrumentName: String!\n    $description: String!\n  ) {\n    createBandPosition(\n      bandId: $bandId\n      instrumentName: $instrumentName\n      description: $description\n    ) {\n      id\n    }\n  }\n": typeof types.CreateBandPositionDocument,
    "\n  mutation UpdateBandPosition(\n    $bpId: ID!\n    $bId: ID\n    $instrument: String\n    $description: String\n    $filled: Boolean\n    $fillerId: ID\n  ) {\n    updateBandPosition(\n      bpId: $bpId\n      bId: $bId\n      instrument: $instrument\n      description: $description\n      filled: $filled\n      fillerId: $fillerId\n    )\n  }\n": typeof types.UpdateBandPositionDocument,
    "\n  mutation DeleteBandPosition($pbId: ID!) {\n    deleteBandPosition(pbId: $pbId)\n  }\n": typeof types.DeleteBandPositionDocument,
    "\n  mutation CreateJoinRequest(\n    $uID: ID!\n    $bID: ID!\n    $bpId: ID!\n    $interestedInstruments: [String!]\n    $message: String\n  ) {\n    createJoinRequest(\n      uID: $uID\n      bID: $bID\n      bpId: $bpId\n      interestedInstruments: $interestedInstruments\n      message: $message\n    ) {\n      id\n      status\n    }\n  }\n": typeof types.CreateJoinRequestDocument,
    "\n  mutation InviteToBand(\n    $bID: ID!\n    $bpId: ID!\n    $uID: ID!\n    $proposedRole: String!\n    $message: String\n  ) {\n    inviteToBand(\n      bID: $bID\n      bpId: $bpId\n      uID: $uID\n      proposedRole: $proposedRole\n      message: $message\n    ) {\n      id\n      status\n    }\n  }\n": typeof types.InviteToBandDocument,
    "\n  mutation DeleteJoinRequest($id: ID!) {\n    deleteJoinRequest(id: $id)\n  }\n": typeof types.DeleteJoinRequestDocument,
    "\n  mutation RejectJoinRequest($id: ID!) {\n    reject(id: $id)\n  }\n": typeof types.RejectJoinRequestDocument,
    "\n  mutation AcceptJoinRequest($id: ID!, $bandRole: String) {\n    accept(id: $id, bandRole: $bandRole)\n  }\n": typeof types.AcceptJoinRequestDocument,
    "\n  mutation SendMessage($bandId: ID!, $body: String!) {\n    sendMessage(bandId: $bandId, body: $body) {\n      ...MessageFields\n    }\n  }\n": typeof types.SendMessageDocument,
    "\n  mutation IssueWsTicket {\n    issueWsTicket\n  }\n": typeof types.IssueWsTicketDocument,
    "\n  mutation CreateRandomizedBand(\n    $yourUID: ID!\n    $yourInstrument: String!\n    $yourRole: String\n    $name: String!\n    $instruments: [String!]!\n    $city: String!\n    $country: String!\n    $genres: [String!]!\n    $description: String!\n    $instrumentSearchDepth: Int!\n  ) {\n    randomizedBandCreator(\n      yourUID: $yourUID\n      yourInstrument: $yourInstrument\n      yourRole: $yourRole\n      name: $name\n      instruments: $instruments\n      city: $city\n      country: $country\n      genres: $genres\n      description: $description\n      instrumentSearchDepth: $instrumentSearchDepth\n    ) {\n      id\n      name\n      members {\n        id\n      }\n      openPositions {\n        id\n      }\n    }\n  }\n": typeof types.CreateRandomizedBandDocument,
    "\n  query GetMe {\n    me {\n      ...MeFields\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  query GetBands {\n    bands {\n      ...BandCardFields\n    }\n  }\n": typeof types.GetBandsDocument,
    "\n  query GetRecommendedBands(\n    $withinCity: Boolean!\n    $withinCountry: Boolean!\n    $sameGenre: Boolean!\n    $locGenreWeight: Int!\n  ) {\n    recommendBand(\n      withinCity: $withinCity\n      withinCountry: $withinCountry\n      sameGenre: $sameGenre\n      locGenreWeight: $locGenreWeight\n    ) {\n      ...BandCardFields\n    }\n  }\n": typeof types.GetRecommendedBandsDocument,
    "\n  query GetBand($id: ID!) {\n    band(id: $id) {\n      ...BandDetailFields\n    }\n  }\n": typeof types.GetBandDocument,
    "\n  query GetBandJoinRequests($bID: ID!) {\n    bandJoinRequests(bID: $bID) {\n      ...BandJoinRequestFields\n    }\n  }\n": typeof types.GetBandJoinRequestsDocument,
    "\n  query GetUserJoinRequests($uID: ID!) {\n    userJoinRequests(uID: $uID) {\n      ...BandJoinRequestFields\n      band {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetUserJoinRequestsDocument,
    "\n  query GetRecommendedUsers(\n    $bp: ID!\n    $withinCity: Boolean!\n    $withinCountry: Boolean!\n    $sameGenre: Boolean!\n    $singleInstrument: Boolean!\n    $locGenreWeight: Int!\n  ) {\n    recommendUser(\n      bp: $bp\n      withinCity: $withinCity\n      withinCountry: $withinCountry\n      sameGenre: $sameGenre\n      singleInstrument: $singleInstrument\n      locGenreWeight: $locGenreWeight\n    ) {\n      ...UserCardFields\n    }\n  }\n": typeof types.GetRecommendedUsersDocument,
    "\n  query GetBandMessages($bandId: ID!, $limit: Int, $before: ID) {\n    bandMessages(bandId: $bandId, limit: $limit, before: $before) {\n      ...MessageFields\n    }\n  }\n": typeof types.GetBandMessagesDocument,
    "\n  query GetAdminUsers {\n    users {\n      id\n      name\n      email\n      role\n      city\n      country\n      locked\n    }\n  }\n": typeof types.GetAdminUsersDocument,
    "\n  query GetAdminBands {\n    bands {\n      id\n      name\n      city\n      country\n    }\n  }\n": typeof types.GetAdminBandsDocument,
    "\n  subscription BandMessageAdded($bandId: ID!, $ticket: String!) {\n    messageAdded(bandId: $bandId, ticket: $ticket) {\n      ...MessageFields\n    }\n  }\n": typeof types.BandMessageAddedDocument,
    "\n  subscription Notifications($ticket: String!) {\n    notifications(ticket: $ticket) {\n      id\n      message\n      sender\n    }\n  }\n": typeof types.NotificationsDocument,
};
const documents: Documents = {
    "\n  fragment BandCardFields on Band {\n    id\n    name\n    city\n    country\n    genres {\n      name\n    }\n    openPositions {\n      id\n      filled\n    }\n  }\n": types.BandCardFieldsFragmentDoc,
    "\n  fragment BandDetailFields on Band {\n    id\n    name\n    description\n    city\n    country\n    owner {\n      id\n      name\n    }\n    genres {\n      name\n    }\n    members {\n      id\n      role\n      user {\n        id\n        name\n      }\n      instruments {\n        name\n      }\n    }\n    openPositions {\n      id\n      description\n      filled\n      instrument {\n        id\n        name\n      }\n      filledBy {\n        id\n        name\n      }\n    }\n  }\n": types.BandDetailFieldsFragmentDoc,
    "\n  fragment BandJoinRequestFields on JoinRequest {\n    id\n    status\n    message\n    requestedDate\n    invitedByBand\n    proposedRole\n    user {\n      id\n      name\n    }\n    position {\n      id\n      instrument {\n        name\n      }\n    }\n    interestedInstruments {\n      name\n    }\n  }\n": types.BandJoinRequestFieldsFragmentDoc,
    "\n  fragment UserCardFields on User {\n    id\n    name\n    city\n    country\n    instruments {\n      name\n    }\n    genres {\n      name\n    }\n  }\n": types.UserCardFieldsFragmentDoc,
    "\n  fragment MessageFields on Message {\n    id\n    body\n    sentAt\n    sender {\n      id\n      name\n    }\n  }\n": types.MessageFieldsFragmentDoc,
    "\n  fragment MeFields on User {\n    id\n    name\n    email\n    age\n    city\n    country\n    description\n    role\n    status\n    genres {\n      name\n    }\n    instruments {\n      name\n    }\n    bandMemberships {\n      id\n      role\n      joinedDate\n      band {\n        id\n        name\n        owner {\n          id\n        }\n      }\n    }\n  }\n": types.MeFieldsFragmentDoc,
    "\n  mutation Login($name: String!, $password: String!) {\n    login(name: $name, password: $password) {\n      user {\n        ...MeFields\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  mutation CreateUser(\n    $name: String!\n    $email: String!\n    $plainPassword: String!\n    $age: Int!\n    $city: String!\n    $country: String!\n    $description: String!\n    $genres: [String!]!\n    $instruments: [String!]!\n    $status: UserStatus\n  ) {\n    createUser(\n      name: $name\n      email: $email\n      plainPassword: $plainPassword\n      age: $age\n      city: $city\n      country: $country\n      description: $description\n      genres: $genres\n      instruments: $instruments\n      status: $status\n    ) {\n      id\n      name\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation UpdateUser(\n    $id: ID!\n    $name: String\n    $email: String\n    $age: Int\n    $city: String\n    $country: String\n    $description: String\n    $status: UserStatus\n    $genres: [String!]\n    $instruments: [String!]\n  ) {\n    updateUser(\n      id: $id\n      name: $name\n      email: $email\n      age: $age\n      city: $city\n      country: $country\n      description: $description\n      status: $status\n      genres: $genres\n      instruments: $instruments\n    )\n  }\n": types.UpdateUserDocument,
    "\n  mutation ChangePassword($newPassword: String!) {\n    changePassword(newPassword: $newPassword)\n  }\n": types.ChangePasswordDocument,
    "\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id)\n  }\n": types.DeleteUserDocument,
    "\n  mutation UnlockUser($id: ID!) {\n    unlockUser(id: $id)\n  }\n": types.UnlockUserDocument,
    "\n  mutation CreateBand(\n    $name: String!\n    $description: String!\n    $city: String!\n    $country: String!\n    $genres: [String!]!\n  ) {\n    createBand(\n      name: $name\n      description: $description\n      city: $city\n      country: $country\n      genres: $genres\n    ) {\n      id\n    }\n  }\n": types.CreateBandDocument,
    "\n  mutation UpdateBand(\n    $id: ID!\n    $name: String\n    $description: String\n    $city: String\n    $country: String\n    $genres: [String!]\n  ) {\n    updateBand(\n      id: $id\n      name: $name\n      description: $description\n      city: $city\n      country: $country\n      genres: $genres\n    )\n  }\n": types.UpdateBandDocument,
    "\n  mutation DeleteBand($id: ID!) {\n    deleteBand(id: $id)\n  }\n": types.DeleteBandDocument,
    "\n  mutation DeleteBandMember($bmID: ID!) {\n    deleteBandMember(bmID: $bmID)\n  }\n": types.DeleteBandMemberDocument,
    "\n  mutation CreateBandMember(\n    $bID: ID!\n    $uID: ID!\n    $instrumentNames: [String]\n    $role: String\n  ) {\n    createBandMember(\n      bID: $bID\n      uID: $uID\n      instrumentNames: $instrumentNames\n      role: $role\n    ) {\n      id\n    }\n  }\n": types.CreateBandMemberDocument,
    "\n  mutation CreateBandPosition(\n    $bandId: ID!\n    $instrumentName: String!\n    $description: String!\n  ) {\n    createBandPosition(\n      bandId: $bandId\n      instrumentName: $instrumentName\n      description: $description\n    ) {\n      id\n    }\n  }\n": types.CreateBandPositionDocument,
    "\n  mutation UpdateBandPosition(\n    $bpId: ID!\n    $bId: ID\n    $instrument: String\n    $description: String\n    $filled: Boolean\n    $fillerId: ID\n  ) {\n    updateBandPosition(\n      bpId: $bpId\n      bId: $bId\n      instrument: $instrument\n      description: $description\n      filled: $filled\n      fillerId: $fillerId\n    )\n  }\n": types.UpdateBandPositionDocument,
    "\n  mutation DeleteBandPosition($pbId: ID!) {\n    deleteBandPosition(pbId: $pbId)\n  }\n": types.DeleteBandPositionDocument,
    "\n  mutation CreateJoinRequest(\n    $uID: ID!\n    $bID: ID!\n    $bpId: ID!\n    $interestedInstruments: [String!]\n    $message: String\n  ) {\n    createJoinRequest(\n      uID: $uID\n      bID: $bID\n      bpId: $bpId\n      interestedInstruments: $interestedInstruments\n      message: $message\n    ) {\n      id\n      status\n    }\n  }\n": types.CreateJoinRequestDocument,
    "\n  mutation InviteToBand(\n    $bID: ID!\n    $bpId: ID!\n    $uID: ID!\n    $proposedRole: String!\n    $message: String\n  ) {\n    inviteToBand(\n      bID: $bID\n      bpId: $bpId\n      uID: $uID\n      proposedRole: $proposedRole\n      message: $message\n    ) {\n      id\n      status\n    }\n  }\n": types.InviteToBandDocument,
    "\n  mutation DeleteJoinRequest($id: ID!) {\n    deleteJoinRequest(id: $id)\n  }\n": types.DeleteJoinRequestDocument,
    "\n  mutation RejectJoinRequest($id: ID!) {\n    reject(id: $id)\n  }\n": types.RejectJoinRequestDocument,
    "\n  mutation AcceptJoinRequest($id: ID!, $bandRole: String) {\n    accept(id: $id, bandRole: $bandRole)\n  }\n": types.AcceptJoinRequestDocument,
    "\n  mutation SendMessage($bandId: ID!, $body: String!) {\n    sendMessage(bandId: $bandId, body: $body) {\n      ...MessageFields\n    }\n  }\n": types.SendMessageDocument,
    "\n  mutation IssueWsTicket {\n    issueWsTicket\n  }\n": types.IssueWsTicketDocument,
    "\n  mutation CreateRandomizedBand(\n    $yourUID: ID!\n    $yourInstrument: String!\n    $yourRole: String\n    $name: String!\n    $instruments: [String!]!\n    $city: String!\n    $country: String!\n    $genres: [String!]!\n    $description: String!\n    $instrumentSearchDepth: Int!\n  ) {\n    randomizedBandCreator(\n      yourUID: $yourUID\n      yourInstrument: $yourInstrument\n      yourRole: $yourRole\n      name: $name\n      instruments: $instruments\n      city: $city\n      country: $country\n      genres: $genres\n      description: $description\n      instrumentSearchDepth: $instrumentSearchDepth\n    ) {\n      id\n      name\n      members {\n        id\n      }\n      openPositions {\n        id\n      }\n    }\n  }\n": types.CreateRandomizedBandDocument,
    "\n  query GetMe {\n    me {\n      ...MeFields\n    }\n  }\n": types.GetMeDocument,
    "\n  query GetBands {\n    bands {\n      ...BandCardFields\n    }\n  }\n": types.GetBandsDocument,
    "\n  query GetRecommendedBands(\n    $withinCity: Boolean!\n    $withinCountry: Boolean!\n    $sameGenre: Boolean!\n    $locGenreWeight: Int!\n  ) {\n    recommendBand(\n      withinCity: $withinCity\n      withinCountry: $withinCountry\n      sameGenre: $sameGenre\n      locGenreWeight: $locGenreWeight\n    ) {\n      ...BandCardFields\n    }\n  }\n": types.GetRecommendedBandsDocument,
    "\n  query GetBand($id: ID!) {\n    band(id: $id) {\n      ...BandDetailFields\n    }\n  }\n": types.GetBandDocument,
    "\n  query GetBandJoinRequests($bID: ID!) {\n    bandJoinRequests(bID: $bID) {\n      ...BandJoinRequestFields\n    }\n  }\n": types.GetBandJoinRequestsDocument,
    "\n  query GetUserJoinRequests($uID: ID!) {\n    userJoinRequests(uID: $uID) {\n      ...BandJoinRequestFields\n      band {\n        id\n        name\n      }\n    }\n  }\n": types.GetUserJoinRequestsDocument,
    "\n  query GetRecommendedUsers(\n    $bp: ID!\n    $withinCity: Boolean!\n    $withinCountry: Boolean!\n    $sameGenre: Boolean!\n    $singleInstrument: Boolean!\n    $locGenreWeight: Int!\n  ) {\n    recommendUser(\n      bp: $bp\n      withinCity: $withinCity\n      withinCountry: $withinCountry\n      sameGenre: $sameGenre\n      singleInstrument: $singleInstrument\n      locGenreWeight: $locGenreWeight\n    ) {\n      ...UserCardFields\n    }\n  }\n": types.GetRecommendedUsersDocument,
    "\n  query GetBandMessages($bandId: ID!, $limit: Int, $before: ID) {\n    bandMessages(bandId: $bandId, limit: $limit, before: $before) {\n      ...MessageFields\n    }\n  }\n": types.GetBandMessagesDocument,
    "\n  query GetAdminUsers {\n    users {\n      id\n      name\n      email\n      role\n      city\n      country\n      locked\n    }\n  }\n": types.GetAdminUsersDocument,
    "\n  query GetAdminBands {\n    bands {\n      id\n      name\n      city\n      country\n    }\n  }\n": types.GetAdminBandsDocument,
    "\n  subscription BandMessageAdded($bandId: ID!, $ticket: String!) {\n    messageAdded(bandId: $bandId, ticket: $ticket) {\n      ...MessageFields\n    }\n  }\n": types.BandMessageAddedDocument,
    "\n  subscription Notifications($ticket: String!) {\n    notifications(ticket: $ticket) {\n      id\n      message\n      sender\n    }\n  }\n": types.NotificationsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BandCardFields on Band {\n    id\n    name\n    city\n    country\n    genres {\n      name\n    }\n    openPositions {\n      id\n      filled\n    }\n  }\n"): (typeof documents)["\n  fragment BandCardFields on Band {\n    id\n    name\n    city\n    country\n    genres {\n      name\n    }\n    openPositions {\n      id\n      filled\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BandDetailFields on Band {\n    id\n    name\n    description\n    city\n    country\n    owner {\n      id\n      name\n    }\n    genres {\n      name\n    }\n    members {\n      id\n      role\n      user {\n        id\n        name\n      }\n      instruments {\n        name\n      }\n    }\n    openPositions {\n      id\n      description\n      filled\n      instrument {\n        id\n        name\n      }\n      filledBy {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BandDetailFields on Band {\n    id\n    name\n    description\n    city\n    country\n    owner {\n      id\n      name\n    }\n    genres {\n      name\n    }\n    members {\n      id\n      role\n      user {\n        id\n        name\n      }\n      instruments {\n        name\n      }\n    }\n    openPositions {\n      id\n      description\n      filled\n      instrument {\n        id\n        name\n      }\n      filledBy {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BandJoinRequestFields on JoinRequest {\n    id\n    status\n    message\n    requestedDate\n    invitedByBand\n    proposedRole\n    user {\n      id\n      name\n    }\n    position {\n      id\n      instrument {\n        name\n      }\n    }\n    interestedInstruments {\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment BandJoinRequestFields on JoinRequest {\n    id\n    status\n    message\n    requestedDate\n    invitedByBand\n    proposedRole\n    user {\n      id\n      name\n    }\n    position {\n      id\n      instrument {\n        name\n      }\n    }\n    interestedInstruments {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserCardFields on User {\n    id\n    name\n    city\n    country\n    instruments {\n      name\n    }\n    genres {\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment UserCardFields on User {\n    id\n    name\n    city\n    country\n    instruments {\n      name\n    }\n    genres {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MessageFields on Message {\n    id\n    body\n    sentAt\n    sender {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment MessageFields on Message {\n    id\n    body\n    sentAt\n    sender {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MeFields on User {\n    id\n    name\n    email\n    age\n    city\n    country\n    description\n    role\n    status\n    genres {\n      name\n    }\n    instruments {\n      name\n    }\n    bandMemberships {\n      id\n      role\n      joinedDate\n      band {\n        id\n        name\n        owner {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MeFields on User {\n    id\n    name\n    email\n    age\n    city\n    country\n    description\n    role\n    status\n    genres {\n      name\n    }\n    instruments {\n      name\n    }\n    bandMemberships {\n      id\n      role\n      joinedDate\n      band {\n        id\n        name\n        owner {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($name: String!, $password: String!) {\n    login(name: $name, password: $password) {\n      user {\n        ...MeFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($name: String!, $password: String!) {\n    login(name: $name, password: $password) {\n      user {\n        ...MeFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser(\n    $name: String!\n    $email: String!\n    $plainPassword: String!\n    $age: Int!\n    $city: String!\n    $country: String!\n    $description: String!\n    $genres: [String!]!\n    $instruments: [String!]!\n    $status: UserStatus\n  ) {\n    createUser(\n      name: $name\n      email: $email\n      plainPassword: $plainPassword\n      age: $age\n      city: $city\n      country: $country\n      description: $description\n      genres: $genres\n      instruments: $instruments\n      status: $status\n    ) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser(\n    $name: String!\n    $email: String!\n    $plainPassword: String!\n    $age: Int!\n    $city: String!\n    $country: String!\n    $description: String!\n    $genres: [String!]!\n    $instruments: [String!]!\n    $status: UserStatus\n  ) {\n    createUser(\n      name: $name\n      email: $email\n      plainPassword: $plainPassword\n      age: $age\n      city: $city\n      country: $country\n      description: $description\n      genres: $genres\n      instruments: $instruments\n      status: $status\n    ) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser(\n    $id: ID!\n    $name: String\n    $email: String\n    $age: Int\n    $city: String\n    $country: String\n    $description: String\n    $status: UserStatus\n    $genres: [String!]\n    $instruments: [String!]\n  ) {\n    updateUser(\n      id: $id\n      name: $name\n      email: $email\n      age: $age\n      city: $city\n      country: $country\n      description: $description\n      status: $status\n      genres: $genres\n      instruments: $instruments\n    )\n  }\n"): (typeof documents)["\n  mutation UpdateUser(\n    $id: ID!\n    $name: String\n    $email: String\n    $age: Int\n    $city: String\n    $country: String\n    $description: String\n    $status: UserStatus\n    $genres: [String!]\n    $instruments: [String!]\n  ) {\n    updateUser(\n      id: $id\n      name: $name\n      email: $email\n      age: $age\n      city: $city\n      country: $country\n      description: $description\n      status: $status\n      genres: $genres\n      instruments: $instruments\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangePassword($newPassword: String!) {\n    changePassword(newPassword: $newPassword)\n  }\n"): (typeof documents)["\n  mutation ChangePassword($newPassword: String!) {\n    changePassword(newPassword: $newPassword)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnlockUser($id: ID!) {\n    unlockUser(id: $id)\n  }\n"): (typeof documents)["\n  mutation UnlockUser($id: ID!) {\n    unlockUser(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateBand(\n    $name: String!\n    $description: String!\n    $city: String!\n    $country: String!\n    $genres: [String!]!\n  ) {\n    createBand(\n      name: $name\n      description: $description\n      city: $city\n      country: $country\n      genres: $genres\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateBand(\n    $name: String!\n    $description: String!\n    $city: String!\n    $country: String!\n    $genres: [String!]!\n  ) {\n    createBand(\n      name: $name\n      description: $description\n      city: $city\n      country: $country\n      genres: $genres\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateBand(\n    $id: ID!\n    $name: String\n    $description: String\n    $city: String\n    $country: String\n    $genres: [String!]\n  ) {\n    updateBand(\n      id: $id\n      name: $name\n      description: $description\n      city: $city\n      country: $country\n      genres: $genres\n    )\n  }\n"): (typeof documents)["\n  mutation UpdateBand(\n    $id: ID!\n    $name: String\n    $description: String\n    $city: String\n    $country: String\n    $genres: [String!]\n  ) {\n    updateBand(\n      id: $id\n      name: $name\n      description: $description\n      city: $city\n      country: $country\n      genres: $genres\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteBand($id: ID!) {\n    deleteBand(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteBand($id: ID!) {\n    deleteBand(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteBandMember($bmID: ID!) {\n    deleteBandMember(bmID: $bmID)\n  }\n"): (typeof documents)["\n  mutation DeleteBandMember($bmID: ID!) {\n    deleteBandMember(bmID: $bmID)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateBandMember(\n    $bID: ID!\n    $uID: ID!\n    $instrumentNames: [String]\n    $role: String\n  ) {\n    createBandMember(\n      bID: $bID\n      uID: $uID\n      instrumentNames: $instrumentNames\n      role: $role\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateBandMember(\n    $bID: ID!\n    $uID: ID!\n    $instrumentNames: [String]\n    $role: String\n  ) {\n    createBandMember(\n      bID: $bID\n      uID: $uID\n      instrumentNames: $instrumentNames\n      role: $role\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateBandPosition(\n    $bandId: ID!\n    $instrumentName: String!\n    $description: String!\n  ) {\n    createBandPosition(\n      bandId: $bandId\n      instrumentName: $instrumentName\n      description: $description\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateBandPosition(\n    $bandId: ID!\n    $instrumentName: String!\n    $description: String!\n  ) {\n    createBandPosition(\n      bandId: $bandId\n      instrumentName: $instrumentName\n      description: $description\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateBandPosition(\n    $bpId: ID!\n    $bId: ID\n    $instrument: String\n    $description: String\n    $filled: Boolean\n    $fillerId: ID\n  ) {\n    updateBandPosition(\n      bpId: $bpId\n      bId: $bId\n      instrument: $instrument\n      description: $description\n      filled: $filled\n      fillerId: $fillerId\n    )\n  }\n"): (typeof documents)["\n  mutation UpdateBandPosition(\n    $bpId: ID!\n    $bId: ID\n    $instrument: String\n    $description: String\n    $filled: Boolean\n    $fillerId: ID\n  ) {\n    updateBandPosition(\n      bpId: $bpId\n      bId: $bId\n      instrument: $instrument\n      description: $description\n      filled: $filled\n      fillerId: $fillerId\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteBandPosition($pbId: ID!) {\n    deleteBandPosition(pbId: $pbId)\n  }\n"): (typeof documents)["\n  mutation DeleteBandPosition($pbId: ID!) {\n    deleteBandPosition(pbId: $pbId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateJoinRequest(\n    $uID: ID!\n    $bID: ID!\n    $bpId: ID!\n    $interestedInstruments: [String!]\n    $message: String\n  ) {\n    createJoinRequest(\n      uID: $uID\n      bID: $bID\n      bpId: $bpId\n      interestedInstruments: $interestedInstruments\n      message: $message\n    ) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation CreateJoinRequest(\n    $uID: ID!\n    $bID: ID!\n    $bpId: ID!\n    $interestedInstruments: [String!]\n    $message: String\n  ) {\n    createJoinRequest(\n      uID: $uID\n      bID: $bID\n      bpId: $bpId\n      interestedInstruments: $interestedInstruments\n      message: $message\n    ) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InviteToBand(\n    $bID: ID!\n    $bpId: ID!\n    $uID: ID!\n    $proposedRole: String!\n    $message: String\n  ) {\n    inviteToBand(\n      bID: $bID\n      bpId: $bpId\n      uID: $uID\n      proposedRole: $proposedRole\n      message: $message\n    ) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation InviteToBand(\n    $bID: ID!\n    $bpId: ID!\n    $uID: ID!\n    $proposedRole: String!\n    $message: String\n  ) {\n    inviteToBand(\n      bID: $bID\n      bpId: $bpId\n      uID: $uID\n      proposedRole: $proposedRole\n      message: $message\n    ) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteJoinRequest($id: ID!) {\n    deleteJoinRequest(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteJoinRequest($id: ID!) {\n    deleteJoinRequest(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RejectJoinRequest($id: ID!) {\n    reject(id: $id)\n  }\n"): (typeof documents)["\n  mutation RejectJoinRequest($id: ID!) {\n    reject(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AcceptJoinRequest($id: ID!, $bandRole: String) {\n    accept(id: $id, bandRole: $bandRole)\n  }\n"): (typeof documents)["\n  mutation AcceptJoinRequest($id: ID!, $bandRole: String) {\n    accept(id: $id, bandRole: $bandRole)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendMessage($bandId: ID!, $body: String!) {\n    sendMessage(bandId: $bandId, body: $body) {\n      ...MessageFields\n    }\n  }\n"): (typeof documents)["\n  mutation SendMessage($bandId: ID!, $body: String!) {\n    sendMessage(bandId: $bandId, body: $body) {\n      ...MessageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation IssueWsTicket {\n    issueWsTicket\n  }\n"): (typeof documents)["\n  mutation IssueWsTicket {\n    issueWsTicket\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRandomizedBand(\n    $yourUID: ID!\n    $yourInstrument: String!\n    $yourRole: String\n    $name: String!\n    $instruments: [String!]!\n    $city: String!\n    $country: String!\n    $genres: [String!]!\n    $description: String!\n    $instrumentSearchDepth: Int!\n  ) {\n    randomizedBandCreator(\n      yourUID: $yourUID\n      yourInstrument: $yourInstrument\n      yourRole: $yourRole\n      name: $name\n      instruments: $instruments\n      city: $city\n      country: $country\n      genres: $genres\n      description: $description\n      instrumentSearchDepth: $instrumentSearchDepth\n    ) {\n      id\n      name\n      members {\n        id\n      }\n      openPositions {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRandomizedBand(\n    $yourUID: ID!\n    $yourInstrument: String!\n    $yourRole: String\n    $name: String!\n    $instruments: [String!]!\n    $city: String!\n    $country: String!\n    $genres: [String!]!\n    $description: String!\n    $instrumentSearchDepth: Int!\n  ) {\n    randomizedBandCreator(\n      yourUID: $yourUID\n      yourInstrument: $yourInstrument\n      yourRole: $yourRole\n      name: $name\n      instruments: $instruments\n      city: $city\n      country: $country\n      genres: $genres\n      description: $description\n      instrumentSearchDepth: $instrumentSearchDepth\n    ) {\n      id\n      name\n      members {\n        id\n      }\n      openPositions {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMe {\n    me {\n      ...MeFields\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      ...MeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBands {\n    bands {\n      ...BandCardFields\n    }\n  }\n"): (typeof documents)["\n  query GetBands {\n    bands {\n      ...BandCardFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRecommendedBands(\n    $withinCity: Boolean!\n    $withinCountry: Boolean!\n    $sameGenre: Boolean!\n    $locGenreWeight: Int!\n  ) {\n    recommendBand(\n      withinCity: $withinCity\n      withinCountry: $withinCountry\n      sameGenre: $sameGenre\n      locGenreWeight: $locGenreWeight\n    ) {\n      ...BandCardFields\n    }\n  }\n"): (typeof documents)["\n  query GetRecommendedBands(\n    $withinCity: Boolean!\n    $withinCountry: Boolean!\n    $sameGenre: Boolean!\n    $locGenreWeight: Int!\n  ) {\n    recommendBand(\n      withinCity: $withinCity\n      withinCountry: $withinCountry\n      sameGenre: $sameGenre\n      locGenreWeight: $locGenreWeight\n    ) {\n      ...BandCardFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBand($id: ID!) {\n    band(id: $id) {\n      ...BandDetailFields\n    }\n  }\n"): (typeof documents)["\n  query GetBand($id: ID!) {\n    band(id: $id) {\n      ...BandDetailFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBandJoinRequests($bID: ID!) {\n    bandJoinRequests(bID: $bID) {\n      ...BandJoinRequestFields\n    }\n  }\n"): (typeof documents)["\n  query GetBandJoinRequests($bID: ID!) {\n    bandJoinRequests(bID: $bID) {\n      ...BandJoinRequestFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserJoinRequests($uID: ID!) {\n    userJoinRequests(uID: $uID) {\n      ...BandJoinRequestFields\n      band {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserJoinRequests($uID: ID!) {\n    userJoinRequests(uID: $uID) {\n      ...BandJoinRequestFields\n      band {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRecommendedUsers(\n    $bp: ID!\n    $withinCity: Boolean!\n    $withinCountry: Boolean!\n    $sameGenre: Boolean!\n    $singleInstrument: Boolean!\n    $locGenreWeight: Int!\n  ) {\n    recommendUser(\n      bp: $bp\n      withinCity: $withinCity\n      withinCountry: $withinCountry\n      sameGenre: $sameGenre\n      singleInstrument: $singleInstrument\n      locGenreWeight: $locGenreWeight\n    ) {\n      ...UserCardFields\n    }\n  }\n"): (typeof documents)["\n  query GetRecommendedUsers(\n    $bp: ID!\n    $withinCity: Boolean!\n    $withinCountry: Boolean!\n    $sameGenre: Boolean!\n    $singleInstrument: Boolean!\n    $locGenreWeight: Int!\n  ) {\n    recommendUser(\n      bp: $bp\n      withinCity: $withinCity\n      withinCountry: $withinCountry\n      sameGenre: $sameGenre\n      singleInstrument: $singleInstrument\n      locGenreWeight: $locGenreWeight\n    ) {\n      ...UserCardFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBandMessages($bandId: ID!, $limit: Int, $before: ID) {\n    bandMessages(bandId: $bandId, limit: $limit, before: $before) {\n      ...MessageFields\n    }\n  }\n"): (typeof documents)["\n  query GetBandMessages($bandId: ID!, $limit: Int, $before: ID) {\n    bandMessages(bandId: $bandId, limit: $limit, before: $before) {\n      ...MessageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAdminUsers {\n    users {\n      id\n      name\n      email\n      role\n      city\n      country\n      locked\n    }\n  }\n"): (typeof documents)["\n  query GetAdminUsers {\n    users {\n      id\n      name\n      email\n      role\n      city\n      country\n      locked\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAdminBands {\n    bands {\n      id\n      name\n      city\n      country\n    }\n  }\n"): (typeof documents)["\n  query GetAdminBands {\n    bands {\n      id\n      name\n      city\n      country\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription BandMessageAdded($bandId: ID!, $ticket: String!) {\n    messageAdded(bandId: $bandId, ticket: $ticket) {\n      ...MessageFields\n    }\n  }\n"): (typeof documents)["\n  subscription BandMessageAdded($bandId: ID!, $ticket: String!) {\n    messageAdded(bandId: $bandId, ticket: $ticket) {\n      ...MessageFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription Notifications($ticket: String!) {\n    notifications(ticket: $ticket) {\n      id\n      message\n      sender\n    }\n  }\n"): (typeof documents)["\n  subscription Notifications($ticket: String!) {\n    notifications(ticket: $ticket) {\n      id\n      message\n      sender\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;