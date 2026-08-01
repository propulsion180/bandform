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
    "\n   mutation Login($name: String!, $password: String!){\n    login(name: $name, password: $password){\n       user {\n         id\n         name\n         email\n         age\n         city\n         country\n         description\n         role\n         genres{\n           name \n         }\n         instruments{\n           name\n         }\n         bandMemberships{\n           band{\n             name\n             description\n             genres{\n               name\n             }\n             members{\n               user{\n                 name\n               }\n             }\n             openPositions{\n               instrument{\n                 name\n               }\n               filled\n             }\n           }\n           joinedDate\n         }\n       }\n    }\n  }\n  ": typeof types.LoginDocument,
    "\n    mutation Logout{\n      logout\n    }\n  ": typeof types.LogoutDocument,
    "  \n    mutation CreateUser($name: String!, $email: String!, $plainPassword: String!, $age: Int!, $city: String!, $country: String!, $description: String!, $genres: [String!]!, $instruments: [String!]!) {\n      createUser(name: $name, email: $email, plainPassword: $plainPassword, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments){\n        id\n        name\n      }\n    }\n  ": typeof types.CreateUserDocument,
    "\n    mutation UpdateUser($id: ID!, $name: String, $age: Int, $city: String, $country: String, $description: String, $genres: [String!], $instruments: [String!]){\n      updateUser(id: $id, name: $name, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments)\n    }\n  ": typeof types.UpdateUserDocument,
    "\n    mutation DeleteUser($id: ID!){\n      deleteUser(id: $id)\n    }\n  ": typeof types.DeleteUserDocument,
    "  \n    mutation CreateBand($name: String!, $description: String!, $city: String!, $country: String!, $genres: [String!]!){\n      createBand(name: $name, description: $description, city: $city, country: $country, genres: $genres){\n        name\n        description\n        city\n        country\n        genres{\n          name\n        }\n        members{\n          user{\n            name\n          }\n        }\n        openPositions{\n          id\n          instrument{\n            name\n          }\n          description\n        }\n        joinRequests{\n          id\n          user{\n            name\n          }\n          interestedInstruments{\n            name\n          }\n        }\n      }\n    }\n  ": typeof types.CreateBandDocument,
    "\n    mutation UpdateBand($id: ID!, $name: String, $description: String, $city: String, $country: String, $genres: [String!]){\n      updateBand(id: $id, name: $name, description: $description, city: $city, country: $country, genres: $genres)\n    }\n  ": typeof types.UpdateBandDocument,
    "\n    mutation DeleteBand($id: ID!){\n      deleteUser(id: $id)\n    }\n  ": typeof types.DeleteBandDocument,
    "\n    mutation DeleteBandMember($bmID: ID!){\n      deleteBandMember(bmID: $bmID)\n    }\n  ": typeof types.DeleteBandMemberDocument,
    "\n    mutation CreateBandPosition($bandId: ID!, $instrumentName: String!, $description: String!){\n      createBandPosition(bandId: $bandId, instrumentName: $instrumentName, description: $description){\n        instrument{\n          name\n        }\n        description\n      }\n    }\n  ": typeof types.CreateBandPositionDocument,
    "\n    mutation UpdateBandPosition($bpId: ID!, $bId: ID, $instrument: String, $description: String, $filled: Boolean, $fillerId: ID!){\n      updateBandPosition(bpId: $bpId, bId: $bId, instrument: $instrument, description: $description, filled: $filled, fillerId: $fillerId)\n    }\n  ": typeof types.UpdateBandPositionDocument,
    "\n    mutation DeleteBandPosition($pbId: ID!){\n      deleteBandPosition(pbId: $pbId)\n    }\n  ": typeof types.DeleteBandPositionDocument,
    "\n    mutation CreateJoinRequest($uID: ID!, $bID: ID!, $bpID: ID!, $interestedInstruments: [String!], $message: String){\n      createJoinRequest(uID: $uID, bID: $bID, bpID: $bpID, interestedInstruments: $interestedInstruments, message: $message){\n        status\n      }\n    }\n  ": typeof types.CreateJoinRequestDocument,
    "  \n    mutation DeleteJoinRequest($id: ID!){\n      deleteJoinRequest(id: $id)\n    }\n  ": typeof types.DeleteJoinRequestDocument,
};
const documents: Documents = {
    "\n   mutation Login($name: String!, $password: String!){\n    login(name: $name, password: $password){\n       user {\n         id\n         name\n         email\n         age\n         city\n         country\n         description\n         role\n         genres{\n           name \n         }\n         instruments{\n           name\n         }\n         bandMemberships{\n           band{\n             name\n             description\n             genres{\n               name\n             }\n             members{\n               user{\n                 name\n               }\n             }\n             openPositions{\n               instrument{\n                 name\n               }\n               filled\n             }\n           }\n           joinedDate\n         }\n       }\n    }\n  }\n  ": types.LoginDocument,
    "\n    mutation Logout{\n      logout\n    }\n  ": types.LogoutDocument,
    "  \n    mutation CreateUser($name: String!, $email: String!, $plainPassword: String!, $age: Int!, $city: String!, $country: String!, $description: String!, $genres: [String!]!, $instruments: [String!]!) {\n      createUser(name: $name, email: $email, plainPassword: $plainPassword, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments){\n        id\n        name\n      }\n    }\n  ": types.CreateUserDocument,
    "\n    mutation UpdateUser($id: ID!, $name: String, $age: Int, $city: String, $country: String, $description: String, $genres: [String!], $instruments: [String!]){\n      updateUser(id: $id, name: $name, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments)\n    }\n  ": types.UpdateUserDocument,
    "\n    mutation DeleteUser($id: ID!){\n      deleteUser(id: $id)\n    }\n  ": types.DeleteUserDocument,
    "  \n    mutation CreateBand($name: String!, $description: String!, $city: String!, $country: String!, $genres: [String!]!){\n      createBand(name: $name, description: $description, city: $city, country: $country, genres: $genres){\n        name\n        description\n        city\n        country\n        genres{\n          name\n        }\n        members{\n          user{\n            name\n          }\n        }\n        openPositions{\n          id\n          instrument{\n            name\n          }\n          description\n        }\n        joinRequests{\n          id\n          user{\n            name\n          }\n          interestedInstruments{\n            name\n          }\n        }\n      }\n    }\n  ": types.CreateBandDocument,
    "\n    mutation UpdateBand($id: ID!, $name: String, $description: String, $city: String, $country: String, $genres: [String!]){\n      updateBand(id: $id, name: $name, description: $description, city: $city, country: $country, genres: $genres)\n    }\n  ": types.UpdateBandDocument,
    "\n    mutation DeleteBand($id: ID!){\n      deleteUser(id: $id)\n    }\n  ": types.DeleteBandDocument,
    "\n    mutation DeleteBandMember($bmID: ID!){\n      deleteBandMember(bmID: $bmID)\n    }\n  ": types.DeleteBandMemberDocument,
    "\n    mutation CreateBandPosition($bandId: ID!, $instrumentName: String!, $description: String!){\n      createBandPosition(bandId: $bandId, instrumentName: $instrumentName, description: $description){\n        instrument{\n          name\n        }\n        description\n      }\n    }\n  ": types.CreateBandPositionDocument,
    "\n    mutation UpdateBandPosition($bpId: ID!, $bId: ID, $instrument: String, $description: String, $filled: Boolean, $fillerId: ID!){\n      updateBandPosition(bpId: $bpId, bId: $bId, instrument: $instrument, description: $description, filled: $filled, fillerId: $fillerId)\n    }\n  ": types.UpdateBandPositionDocument,
    "\n    mutation DeleteBandPosition($pbId: ID!){\n      deleteBandPosition(pbId: $pbId)\n    }\n  ": types.DeleteBandPositionDocument,
    "\n    mutation CreateJoinRequest($uID: ID!, $bID: ID!, $bpID: ID!, $interestedInstruments: [String!], $message: String){\n      createJoinRequest(uID: $uID, bID: $bID, bpID: $bpID, interestedInstruments: $interestedInstruments, message: $message){\n        status\n      }\n    }\n  ": types.CreateJoinRequestDocument,
    "  \n    mutation DeleteJoinRequest($id: ID!){\n      deleteJoinRequest(id: $id)\n    }\n  ": types.DeleteJoinRequestDocument,
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
export function graphql(source: "\n   mutation Login($name: String!, $password: String!){\n    login(name: $name, password: $password){\n       user {\n         id\n         name\n         email\n         age\n         city\n         country\n         description\n         role\n         genres{\n           name \n         }\n         instruments{\n           name\n         }\n         bandMemberships{\n           band{\n             name\n             description\n             genres{\n               name\n             }\n             members{\n               user{\n                 name\n               }\n             }\n             openPositions{\n               instrument{\n                 name\n               }\n               filled\n             }\n           }\n           joinedDate\n         }\n       }\n    }\n  }\n  "): (typeof documents)["\n   mutation Login($name: String!, $password: String!){\n    login(name: $name, password: $password){\n       user {\n         id\n         name\n         email\n         age\n         city\n         country\n         description\n         role\n         genres{\n           name \n         }\n         instruments{\n           name\n         }\n         bandMemberships{\n           band{\n             name\n             description\n             genres{\n               name\n             }\n             members{\n               user{\n                 name\n               }\n             }\n             openPositions{\n               instrument{\n                 name\n               }\n               filled\n             }\n           }\n           joinedDate\n         }\n       }\n    }\n  }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Logout{\n      logout\n    }\n  "): (typeof documents)["\n    mutation Logout{\n      logout\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "  \n    mutation CreateUser($name: String!, $email: String!, $plainPassword: String!, $age: Int!, $city: String!, $country: String!, $description: String!, $genres: [String!]!, $instruments: [String!]!) {\n      createUser(name: $name, email: $email, plainPassword: $plainPassword, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments){\n        id\n        name\n      }\n    }\n  "): (typeof documents)["  \n    mutation CreateUser($name: String!, $email: String!, $plainPassword: String!, $age: Int!, $city: String!, $country: String!, $description: String!, $genres: [String!]!, $instruments: [String!]!) {\n      createUser(name: $name, email: $email, plainPassword: $plainPassword, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments){\n        id\n        name\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateUser($id: ID!, $name: String, $age: Int, $city: String, $country: String, $description: String, $genres: [String!], $instruments: [String!]){\n      updateUser(id: $id, name: $name, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments)\n    }\n  "): (typeof documents)["\n    mutation UpdateUser($id: ID!, $name: String, $age: Int, $city: String, $country: String, $description: String, $genres: [String!], $instruments: [String!]){\n      updateUser(id: $id, name: $name, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments)\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteUser($id: ID!){\n      deleteUser(id: $id)\n    }\n  "): (typeof documents)["\n    mutation DeleteUser($id: ID!){\n      deleteUser(id: $id)\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "  \n    mutation CreateBand($name: String!, $description: String!, $city: String!, $country: String!, $genres: [String!]!){\n      createBand(name: $name, description: $description, city: $city, country: $country, genres: $genres){\n        name\n        description\n        city\n        country\n        genres{\n          name\n        }\n        members{\n          user{\n            name\n          }\n        }\n        openPositions{\n          id\n          instrument{\n            name\n          }\n          description\n        }\n        joinRequests{\n          id\n          user{\n            name\n          }\n          interestedInstruments{\n            name\n          }\n        }\n      }\n    }\n  "): (typeof documents)["  \n    mutation CreateBand($name: String!, $description: String!, $city: String!, $country: String!, $genres: [String!]!){\n      createBand(name: $name, description: $description, city: $city, country: $country, genres: $genres){\n        name\n        description\n        city\n        country\n        genres{\n          name\n        }\n        members{\n          user{\n            name\n          }\n        }\n        openPositions{\n          id\n          instrument{\n            name\n          }\n          description\n        }\n        joinRequests{\n          id\n          user{\n            name\n          }\n          interestedInstruments{\n            name\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateBand($id: ID!, $name: String, $description: String, $city: String, $country: String, $genres: [String!]){\n      updateBand(id: $id, name: $name, description: $description, city: $city, country: $country, genres: $genres)\n    }\n  "): (typeof documents)["\n    mutation UpdateBand($id: ID!, $name: String, $description: String, $city: String, $country: String, $genres: [String!]){\n      updateBand(id: $id, name: $name, description: $description, city: $city, country: $country, genres: $genres)\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteBand($id: ID!){\n      deleteUser(id: $id)\n    }\n  "): (typeof documents)["\n    mutation DeleteBand($id: ID!){\n      deleteUser(id: $id)\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteBandMember($bmID: ID!){\n      deleteBandMember(bmID: $bmID)\n    }\n  "): (typeof documents)["\n    mutation DeleteBandMember($bmID: ID!){\n      deleteBandMember(bmID: $bmID)\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateBandPosition($bandId: ID!, $instrumentName: String!, $description: String!){\n      createBandPosition(bandId: $bandId, instrumentName: $instrumentName, description: $description){\n        instrument{\n          name\n        }\n        description\n      }\n    }\n  "): (typeof documents)["\n    mutation CreateBandPosition($bandId: ID!, $instrumentName: String!, $description: String!){\n      createBandPosition(bandId: $bandId, instrumentName: $instrumentName, description: $description){\n        instrument{\n          name\n        }\n        description\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateBandPosition($bpId: ID!, $bId: ID, $instrument: String, $description: String, $filled: Boolean, $fillerId: ID!){\n      updateBandPosition(bpId: $bpId, bId: $bId, instrument: $instrument, description: $description, filled: $filled, fillerId: $fillerId)\n    }\n  "): (typeof documents)["\n    mutation UpdateBandPosition($bpId: ID!, $bId: ID, $instrument: String, $description: String, $filled: Boolean, $fillerId: ID!){\n      updateBandPosition(bpId: $bpId, bId: $bId, instrument: $instrument, description: $description, filled: $filled, fillerId: $fillerId)\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteBandPosition($pbId: ID!){\n      deleteBandPosition(pbId: $pbId)\n    }\n  "): (typeof documents)["\n    mutation DeleteBandPosition($pbId: ID!){\n      deleteBandPosition(pbId: $pbId)\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateJoinRequest($uID: ID!, $bID: ID!, $bpID: ID!, $interestedInstruments: [String!], $message: String){\n      createJoinRequest(uID: $uID, bID: $bID, bpID: $bpID, interestedInstruments: $interestedInstruments, message: $message){\n        status\n      }\n    }\n  "): (typeof documents)["\n    mutation CreateJoinRequest($uID: ID!, $bID: ID!, $bpID: ID!, $interestedInstruments: [String!], $message: String){\n      createJoinRequest(uID: $uID, bID: $bID, bpID: $bpID, interestedInstruments: $interestedInstruments, message: $message){\n        status\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "  \n    mutation DeleteJoinRequest($id: ID!){\n      deleteJoinRequest(id: $id)\n    }\n  "): (typeof documents)["  \n    mutation DeleteJoinRequest($id: ID!){\n      deleteJoinRequest(id: $id)\n    }\n  "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;